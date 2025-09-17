package main

import (
    "database/sql"
    "os"
    "strconv"
    "github.com/gin-gonic/gin"
    _ "github.com/lib/pq"
)

type TestResult struct {
    ID      int    `json:"id"`
    UserID  int    `json:"user_id"`
    Score   int    `json:"score"`
    Details string `json:"details"`
}

func getDB() (*sql.DB, error) {
    host := os.Getenv("POSTGRES_HOST")
    port := os.Getenv("POSTGRES_PORT")
    user := os.Getenv("POSTGRES_USER")
    password := os.Getenv("POSTGRES_PASSWORD")
    dbname := os.Getenv("POSTGRES_DB")
    dsn := "host=" + host + " port=" + port + " user=" + user + " password=" + password + " dbname=" + dbname + " sslmode=disable"
    return sql.Open("postgres", dsn)
}

func initDB(db *sql.DB) error {
    _, err := db.Exec(`CREATE TABLE IF NOT EXISTS test_results (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        score INTEGER NOT NULL,
        details TEXT
    )`)
    return err
}

func main() {
    r := gin.Default()

    r.GET("/health", func(c *gin.Context) {
        c.JSON(200, gin.H{"status": "ok"})
    })

    r.POST("/results", func(c *gin.Context) {
        var result TestResult
        if err := c.ShouldBindJSON(&result); err != nil {
            c.JSON(400, gin.H{"error": err.Error()})
            return
        }
        db, err := getDB()
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        defer db.Close()
        if err := initDB(db); err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        err = db.QueryRow("INSERT INTO test_results (user_id, score, details) VALUES ($1, $2, $3) RETURNING id", result.UserID, result.Score, result.Details).Scan(&result.ID)
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        c.JSON(201, result)
    })

    r.GET("/results", func(c *gin.Context) {
        db, err := getDB()
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        defer db.Close()
        if err := initDB(db); err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        rows, err := db.Query("SELECT id, user_id, score, details FROM test_results")
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        defer rows.Close()
        results := []TestResult{}
        for rows.Next() {
            var r TestResult
            if err := rows.Scan(&r.ID, &r.UserID, &r.Score, &r.Details); err != nil {
                c.JSON(500, gin.H{"error": err.Error()})
                return
            }
            results = append(results, r)
        }
        c.JSON(200, results)
    })

    r.GET("/results/:id", func(c *gin.Context) {
        idStr := c.Param("id")
        id, err := strconv.Atoi(idStr)
        if err != nil {
            c.JSON(400, gin.H{"error": "Invalid ID"})
            return
        }
        db, err := getDB()
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        defer db.Close()
        if err := initDB(db); err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        var r TestResult
        err = db.QueryRow("SELECT id, user_id, score, details FROM test_results WHERE id = $1", id).Scan(&r.ID, &r.UserID, &r.Score, &r.Details)
        if err == sql.ErrNoRows {
            c.JSON(404, gin.H{"error": "Result not found"})
            return
        } else if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        c.JSON(200, r)
    })

    r.PUT("/results/:id", func(c *gin.Context) {
        idStr := c.Param("id")
        id, err := strconv.Atoi(idStr)
        if err != nil {
            c.JSON(400, gin.H{"error": "Invalid ID"})
            return
        }
        var result TestResult
        if err := c.ShouldBindJSON(&result); err != nil {
            c.JSON(400, gin.H{"error": err.Error()})
            return
        }
        db, err := getDB()
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        defer db.Close()
        if err := initDB(db); err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        res, err := db.Exec("UPDATE test_results SET user_id = $1, score = $2, details = $3 WHERE id = $4", result.UserID, result.Score, result.Details, id)
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        count, _ := res.RowsAffected()
        if count == 0 {
            c.JSON(404, gin.H{"error": "Result not found"})
            return
        }
        result.ID = id
        c.JSON(200, result)
    })

    r.DELETE("/results/:id", func(c *gin.Context) {
        idStr := c.Param("id")
        id, err := strconv.Atoi(idStr)
        if err != nil {
            c.JSON(400, gin.H{"error": "Invalid ID"})
            return
        }
        db, err := getDB()
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        defer db.Close()
        if err := initDB(db); err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        res, err := db.Exec("DELETE FROM test_results WHERE id = $1", id)
        if err != nil {
            c.JSON(500, gin.H{"error": err.Error()})
            return
        }
        count, _ := res.RowsAffected()
        if count == 0 {
            c.JSON(404, gin.H{"error": "Result not found"})
            return
        }
        c.JSON(200, gin.H{"success": true})
    })

    r.Run(":80")
}
