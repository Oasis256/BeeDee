package main

import (
	"log"
	"os"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func main() {
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

	// Health check
	app.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"status":    "ok",
			"service":   "beedee",
			"timestamp": time.Now().UTC(),
			"version":   "1.0.0",
		})
	})

	// Basic API routes
	app.Get("/api/status", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"service":     "beedee",
			"status":      "running",
			"uptime":      time.Since(time.Now()),
			"environment": getEnv("NODE_ENV", "development"),
		})
	})

	// Catch-all for undefined routes
	app.Use(func(c *fiber.Ctx) error {
		return c.Status(404).JSON(fiber.Map{
			"error":   "Route not found",
			"path":    c.Path(),
			"method":  c.Method(),
			"service": "beedee",
		})
	})

	port := getEnv("PORT", "80")
	log.Printf("🚀 BeeGateway starting on port %s", port)

	log.Fatal(app.Listen(":" + port))
}
