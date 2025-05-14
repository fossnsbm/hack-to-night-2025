package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"

	"github.com/joho/godotenv"
	_ "github.com/tursodatabase/libsql-client-go/libsql"
)

// Challenge represents a CTF challenge metadata
type Challenge struct {
	Title       string `json:"title"`
	Description string `json:"description"`
	Category    string `json:"category"`
	Points      int    `json:"points"`
	Flag        string `json:"flag"`
	RequiresVM  bool   `json:"-"` // Not in the info.json file, determined by presence of docker-compose.yml
	Path        string `json:"-"` // Path to the challenge directory
}

func main() {
	fmt.Println("CTF Challenge Seeder")
	fmt.Println("====================")

	// Load environment variables
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: Error loading .env file, using environment variables")
	}

	// Get the database URL and auth token from environment variables
	dbURL := os.Getenv("DATABASE_URL")
	authToken := os.Getenv("DATABASE_AUTH_TOKEN")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	// Connect to the database
	connectionString := fmt.Sprintf("%s?authToken=%s", dbURL, authToken)
	db, err := sql.Open("libsql", connectionString)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer db.Close()

	// Test the connection
	if err := db.Ping(); err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	// Get CTFs directory
	ctfsDir := filepath.Join("challenges", "ctfs")
	fmt.Printf("Scanning directory: %s\n", ctfsDir)

	// Read all subdirectories in the CTFs directory
	entries, err := os.ReadDir(ctfsDir)
	if err != nil {
		log.Fatalf("Failed to read CTFs directory: %v", err)
	}

	// Create a slice to store all challenges
	var challenges []Challenge

	// Process each CTF directory
	for _, entry := range entries {
		if !entry.IsDir() {
			continue
		}

		ctfPath := filepath.Join(ctfsDir, entry.Name())
		challenge, err := processChallenge(ctfPath)
		if err != nil {
			log.Printf("Warning: Failed to process challenge %s: %v", entry.Name(), err)
			continue
		}

		challenges = append(challenges, challenge)
		fmt.Printf("Processed challenge: %s (Type: %s, Points: %d, VM: %v)\n",
			challenge.Title, challenge.Category, challenge.Points, challenge.RequiresVM)
	}

	// Seed challenges to the database
	err = seedChallenges(db, challenges)
	if err != nil {
		log.Fatalf("Failed to seed challenges to database: %v", err)
	}

	fmt.Printf("\nSuccessfully seeded %d challenges to the database\n", len(challenges))
}

// processChallenge reads and processes a challenge directory
func processChallenge(path string) (Challenge, error) {
	var challenge Challenge
	challenge.Path = path

	// Read info.json file
	infoPath := filepath.Join(path, "info.json")
	infoData, err := os.ReadFile(infoPath)
	if err != nil {
		return challenge, fmt.Errorf("failed to read info.json: %w", err)
	}

	// Parse info.json
	err = json.Unmarshal(infoData, &challenge)
	if err != nil {
		return challenge, fmt.Errorf("failed to parse info.json: %w", err)
	}

	// Check if the challenge requires a VM (has docker-compose.yml)
	dockerComposePath := filepath.Join(path, "docker-compose.yml")
	_, err = os.Stat(dockerComposePath)
	if err == nil {
		challenge.RequiresVM = true
	} else {
		// If no docker-compose.yml, it should have a Makefile
		makefilePath := filepath.Join(path, "Makefile")
		_, err = os.Stat(makefilePath)
		if err != nil {
			log.Printf("Warning: Challenge %s has neither docker-compose.yml nor Makefile", challenge.Title)
		}
	}

	return challenge, nil
}

// seedChallenges inserts or updates challenges in the database
func seedChallenges(db *sql.DB, challenges []Challenge) error {
	// First, create the challenges table if it doesn't exist
	createTableSQL := `
	CREATE TABLE IF NOT EXISTS challenges (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL UNIQUE,
		description TEXT NOT NULL,
		category TEXT NOT NULL,
		points INTEGER NOT NULL,
		flag TEXT NOT NULL,
		requires_vm BOOLEAN NOT NULL,
		path TEXT NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`

	_, err := db.Exec(createTableSQL)
	if err != nil {
		return fmt.Errorf("failed to create challenges table: %w", err)
	}

	// Create a transaction for all the inserts
	tx, err := db.Begin()
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback()

	// Prepare the insert statement
	insertSQL := `
	INSERT INTO challenges (title, description, category, points, flag, requires_vm, path)
	VALUES (?, ?, ?, ?, ?, ?, ?)
	ON CONFLICT (title) DO UPDATE SET
		description = excluded.description,
		category = excluded.category,
		points = excluded.points,
		flag = excluded.flag,
		requires_vm = excluded.requires_vm,
		path = excluded.path,
		updated_at = CURRENT_TIMESTAMP;`

	// Insert each challenge
	for _, challenge := range challenges {
		_, err := tx.Exec(insertSQL,
			challenge.Title,
			challenge.Description,
			challenge.Category,
			challenge.Points,
			challenge.Flag,
			challenge.RequiresVM,
			challenge.Path)

		if err != nil {
			return fmt.Errorf("failed to insert challenge %s: %w", challenge.Title, err)
		}
	}

	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}
