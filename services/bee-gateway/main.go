package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/go-resty/resty/v2"
)

type Config struct {
	Port             string
	IntelligenceURL  string
	SocialURL        string
	ScraperURL       string
	FrontendURL      string
}

type Gateway struct {
	config Config
	client *resty.Client
}

func NewGateway() *Gateway {
	config := Config{
		Port:             getEnv("PORT", "80"),
		IntelligenceURL:  getEnv("INTELLIGENCE_URL", "http://bee-intelligence:8080"),
		SocialURL:        getEnv("SOCIAL_URL", "http://bee-social:4000"),
		ScraperURL:       getEnv("SCRAPER_URL", "http://bee-scraper:3001"),
		FrontendURL:      getEnv("FRONTEND_URL", "http://localhost:5173"),
	}

	client := resty.New()
	client.SetTimeout(30 * time.Second)

	return &Gateway{
		config: config,
		client: client,
	}
}

func (g *Gateway) setupRoutes(app *fiber.App) {
	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":    "ok",
			"service":   "bee-gateway",
			"timestamp": time.Now().UTC(),
		})
	})

	// API Routes
	api := app.Group("/api")

	// Intelligence service routes (ML & Analysis)
	intelligence := api.Group("/intelligence")
	intelligence.Post("/analyze/compatibility", g.proxyToIntelligence)
	intelligence.Post("/analyze/results", g.proxyToIntelligence)
	intelligence.Get("/recommendations/:userId", g.proxyToIntelligence)
	intelligence.Post("/profiles", g.proxyToIntelligence)
	intelligence.Get("/profiles/:id", g.proxyToIntelligence)

	// Social service routes (Real-time features)
	social := api.Group("/social")
	social.Get("/scenarios", g.proxyToSocial)
	social.Post("/scenarios", g.proxyToSocial)
	social.Get("/community/:userId", g.proxyToSocial)
	social.Post("/messages", g.proxyToSocial)

	// Scraper service routes
	scraper := api.Group("/scraper")
	scraper.Post("/bdsm-results/:testId", g.proxyToScraper)
	scraper.Get("/status", g.proxyToScraper)

	// Aggregation endpoints (combining multiple services)
	api.Get("/dashboard/:userId", g.getDashboard)
	api.Post("/compatibility", g.analyzeCompatibility)
}

func (g *Gateway) proxyToIntelligence(c *fiber.Ctx) error {
	return g.proxyRequest(c, g.config.IntelligenceURL)
}

func (g *Gateway) proxyToSocial(c *fiber.Ctx) error {
	return g.proxyRequest(c, g.config.SocialURL)
}

func (g *Gateway) proxyToScraper(c *fiber.Ctx) error {
	return g.proxyRequest(c, g.config.ScraperURL)
}

func (g *Gateway) proxyRequest(c *fiber.Ctx, serviceURL string) error {
	url := serviceURL + c.OriginalURL()

	var resp *resty.Response
	var err error

	switch c.Method() {
	case "GET":
		resp, err = g.client.R().Get(url)
	case "POST":
		resp, err = g.client.R().
			SetBody(c.Body()).
			SetHeader("Content-Type", "application/json").
			Post(url)
	case "PUT":
		resp, err = g.client.R().
			SetBody(c.Body()).
			SetHeader("Content-Type", "application/json").
			Put(url)
	case "DELETE":
		resp, err = g.client.R().Delete(url)
	default:
		return c.Status(405).JSON(fiber.Map{"error": "Method not allowed"})
	}

	if err != nil {
		log.Printf("Proxy error to %s: %v", url, err)
		return c.Status(503).JSON(fiber.Map{
			"error":   "Service unavailable",
			"service": serviceURL,
		})
	}

	c.Set("Content-Type", "application/json")
	return c.Status(resp.StatusCode()).Send(resp.Body())
}

// Aggregation endpoint: Dashboard data from multiple services
func (g *Gateway) getDashboard(c *fiber.Ctx) error {
	userId := c.Params("userId")

	// Parallel requests to multiple services
	profileChan := make(chan *resty.Response, 1)
	socialChan := make(chan *resty.Response, 1)

	// Get profile data
	go func() {
		resp, _ := g.client.R().Get(fmt.Sprintf("%s/api/profiles/%s", g.config.IntelligenceURL, userId))
		profileChan <- resp
	}()

	// Get social data
	go func() {
		resp, _ := g.client.R().Get(fmt.Sprintf("%s/api/community/%s", g.config.SocialURL, userId))
		socialChan <- resp
	}()

	// Collect responses
	profileResp := <-profileChan
	socialResp := <-socialChan

	dashboard := fiber.Map{
		"userId":    userId,
		"timestamp": time.Now().UTC(),
	}

	if profileResp != nil && profileResp.StatusCode() == 200 {
		var profileData map[string]interface{}
		json.Unmarshal(profileResp.Body(), &profileData)
		dashboard["profile"] = profileData
	}

	if socialResp != nil && socialResp.StatusCode() == 200 {
		var socialData map[string]interface{}
		json.Unmarshal(socialResp.Body(), &socialData)
		dashboard["social"] = socialData
	}

	return c.JSON(dashboard)
}

// Advanced compatibility analysis combining multiple services
func (g *Gateway) analyzeCompatibility(c *fiber.Ctx) error {
	var request struct {
		User1ID string `json:"user1_id"`
		User2ID string `json:"user2_id"`
	}

	if err := c.BodyParser(&request); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid request body"})
	}

	// Get analysis from intelligence service
	analysisResp, err := g.client.R().
		SetBody(request).
		Post(fmt.Sprintf("%s/api/analyze/compatibility", g.config.IntelligenceURL))

	if err != nil {
		return c.Status(503).JSON(fiber.Map{"error": "Intelligence service unavailable"})
	}

	// Get social compatibility from social service
	socialResp, _ := g.client.R().
		SetBody(request).
		Post(fmt.Sprintf("%s/api/social/compatibility", g.config.SocialURL))

	result := fiber.Map{
		"timestamp": time.Now().UTC(),
	}

	if analysisResp.StatusCode() == 200 {
		var analysisData map[string]interface{}
		json.Unmarshal(analysisResp.Body(), &analysisData)
		result["analysis"] = analysisData
	}

	if socialResp != nil && socialResp.StatusCode() == 200 {
		var socialData map[string]interface{}
		json.Unmarshal(socialResp.Body(), &socialData)
		result["social_compatibility"] = socialData
	}

	return c.JSON(result)
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func main() {
	gateway := NewGateway()

	app := fiber.New(fiber.Config{
		AppName:      "BeeGateway v1.0",
		ServerHeader: "BeeGateway",
	})

	// Middleware
	app.Use(logger.New())
	app.Use(recover.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowMethods: "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders: "Origin,Content-Type,Accept,Authorization",
	}))

	// Setup routes
	gateway.setupRoutes(app)

	// Serve static files (frontend)
	app.Static("/", "./public")

	log.Printf("🚀 BeeGateway starting on port %s", gateway.config.Port)
	log.Printf("📡 Intelligence: %s", gateway.config.IntelligenceURL)
	log.Printf("💬 Social: %s", gateway.config.SocialURL)
	log.Printf("🕷️ Scraper: %s", gateway.config.ScraperURL)

	log.Fatal(app.Listen(":" + gateway.config.Port))
}
