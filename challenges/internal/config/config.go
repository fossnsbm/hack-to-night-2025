package config

import (
	"fmt"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

// Config holds the application configuration
type Config struct {
	Port             int
	TursoDatabaseURL string
	TursoAuthToken   string
	DockerNetwork    string
	ContainerTimeout time.Duration
	BaseDomain       string
}

// LoadConfig loads the configuration from environment variables
func LoadConfig() (*Config, error) {
	// Load .env.local file
	err := godotenv.Load(filepath.Join(".env.local"))
	if err != nil {
		return nil, fmt.Errorf("error loading .env.local file: %w", err)
	}

	// Set default values
	config := &Config{
		Port:             3001,
		DockerNetwork:    "ctf-network",
		ContainerTimeout: 30 * time.Minute,
		BaseDomain:       "ctf.local",
	}

	// Get database credentials from environment
	config.TursoDatabaseURL = os.Getenv("TURSO_DATABASE_URL")
	config.TursoAuthToken = os.Getenv("TURSO_AUTH_TOKEN")

	// Validate required environment variables
	if config.TursoDatabaseURL == "" || config.TursoAuthToken == "" {
		return nil, fmt.Errorf("TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local")
	}

	// Override with environment variables if provided
	if port := os.Getenv("PORT"); port != "" {
		p, err := strconv.Atoi(port)
		if err == nil {
			config.Port = p
		}
	}

	if network := os.Getenv("DOCKER_NETWORK"); network != "" {
		config.DockerNetwork = network
	}

	if timeout := os.Getenv("CONTAINER_TIMEOUT"); timeout != "" {
		duration, err := time.ParseDuration(timeout)
		if err == nil {
			config.ContainerTimeout = duration
		}
	}

	if domain := os.Getenv("BASE_DOMAIN"); domain != "" {
		config.BaseDomain = domain
	}

	return config, nil
}
