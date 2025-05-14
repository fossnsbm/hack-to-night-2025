package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"strconv"
	"strings"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/hack-to-night-2025/challenges/internal/artifacts"
	"github.com/hack-to-night-2025/challenges/internal/config"
	"github.com/hack-to-night-2025/challenges/internal/db"
	"github.com/hack-to-night-2025/challenges/internal/docker"
)

// VmStartRequest is the request body for /vm/start
type VmStartRequest struct {
	TeamID      int `json:"teamId"`
	ChallengeID int `json:"challengeId"`
}

// VmStopRequest is the request body for /vm/stop
type VmStopRequest struct {
	TeamID      int `json:"teamId"`
	ChallengeID int `json:"challengeId"`
}

// VmRenewRequest is the request body for /vm/renew
type VmRenewRequest struct {
	TeamID      int `json:"teamId"`
	ChallengeID int `json:"challengeId"`
}

// ErrorResponse is the response body for errors
type ErrorResponse struct {
	Success bool   `json:"success"`
	Message string `json:"message"`
}

func main() {
	// Load configuration
	cfg, err := config.LoadConfig()
	if err != nil {
		log.Fatalf("Error loading configuration: %v", err)
	}

	// Initialize database client
	dbClient, err := db.NewClient(cfg.TursoDatabaseURL, cfg.TursoAuthToken)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}
	defer dbClient.Close()

	// Initialize Docker service
	dockerService, err := docker.NewService(cfg)
	if err != nil {
		log.Fatalf("Error initializing Docker service: %v", err)
	}

	// Initialize artifacts service
	artifactsService, err := artifacts.NewService()
	if err != nil {
		log.Fatalf("Error initializing artifacts service: %v", err)
	}

	// Initialize router
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	// Health check endpoint
	r.Get("/health", func(w http.ResponseWriter, r *http.Request) {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"status":    "ok",
			"timestamp": time.Now().Format(time.RFC3339),
		})
	})

	// VM endpoints
	r.Post("/vm/start", func(w http.ResponseWriter, r *http.Request) {
		var req VmStartRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Validate request
		if req.TeamID == 0 || req.ChallengeID == 0 {
			respondWithError(w, "Missing required parameters: teamId and challengeId", http.StatusBadRequest)
			return
		}

		// Verify team exists
		teamExists, err := dbClient.VerifyTeam(req.TeamID)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error verifying team: %v", err), http.StatusInternalServerError)
			return
		}
		if !teamExists {
			respondWithError(w, fmt.Sprintf("Team with ID %d not found", req.TeamID), http.StatusNotFound)
			return
		}

		// Get challenge data
		challenge, err := dbClient.GetChallenge(req.ChallengeID)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error getting challenge: %v", err), http.StatusInternalServerError)
			return
		}
		if challenge == nil {
			respondWithError(w, fmt.Sprintf("Challenge with ID %d not found", req.ChallengeID), http.StatusNotFound)
			return
		}

		// Generate challenge tag
		var categoryPrefix string
		switch strings.ToLower(challenge.Category) {
		case "web":
			categoryPrefix = "web"
		case "cryptography":
			categoryPrefix = "cry"
		case "forensics":
			categoryPrefix = "fns"
		case "reverse engineering":
			categoryPrefix = "rev"
		case "misc":
			categoryPrefix = "msc"
		default:
			categoryPrefix = strings.ToLower(challenge.Category[:3])
		}
		titleSlug := slugify(challenge.Title)
		challengeTag := fmt.Sprintf("%s-%s", categoryPrefix, titleSlug)

		// Start container
		containerInfo, err := dockerService.StartContainer(req.TeamID, req.ChallengeID, challengeTag)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error starting container: %v", err), http.StatusInternalServerError)
			return
		}

		// Return container info
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":       true,
			"containerId":   containerInfo.ContainerID,
			"containerName": containerInfo.ContainerName,
			"hostname":      containerInfo.Hostname,
			"status":        containerInfo.Status,
			"expiresAt":     containerInfo.ExpiresAt.Format(time.RFC3339),
		})
	})

	r.Post("/vm/stop", func(w http.ResponseWriter, r *http.Request) {
		var req VmStopRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Validate request
		if req.TeamID == 0 || req.ChallengeID == 0 {
			respondWithError(w, "Missing required parameters: teamId and challengeId", http.StatusBadRequest)
			return
		}

		// Get challenge data
		challenge, err := dbClient.GetChallenge(req.ChallengeID)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error getting challenge: %v", err), http.StatusInternalServerError)
			return
		}
		if challenge == nil {
			respondWithError(w, fmt.Sprintf("Challenge with ID %d not found", req.ChallengeID), http.StatusNotFound)
			return
		}

		// Generate challenge tag
		var categoryPrefix string
		switch strings.ToLower(challenge.Category) {
		case "web":
			categoryPrefix = "web"
		case "cryptography":
			categoryPrefix = "cry"
		case "forensics":
			categoryPrefix = "fns"
		case "reverse engineering":
			categoryPrefix = "rev"
		case "misc":
			categoryPrefix = "msc"
		default:
			categoryPrefix = strings.ToLower(challenge.Category[:3])
		}
		titleSlug := slugify(challenge.Title)
		challengeTag := fmt.Sprintf("%s-%s", categoryPrefix, titleSlug)

		// Stop container
		err = dockerService.StopContainer(req.TeamID, req.ChallengeID, challengeTag)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error stopping container: %v", err), http.StatusInternalServerError)
			return
		}

		// Return success
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success": true,
			"message": "Container stopped successfully",
		})
	})

	r.Post("/vm/renew", func(w http.ResponseWriter, r *http.Request) {
		var req VmRenewRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Validate request
		if req.TeamID == 0 || req.ChallengeID == 0 {
			respondWithError(w, "Missing required parameters: teamId and challengeId", http.StatusBadRequest)
			return
		}

		// Get challenge data
		challenge, err := dbClient.GetChallenge(req.ChallengeID)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error getting challenge: %v", err), http.StatusInternalServerError)
			return
		}
		if challenge == nil {
			respondWithError(w, fmt.Sprintf("Challenge with ID %d not found", req.ChallengeID), http.StatusNotFound)
			return
		}

		// Generate challenge tag
		var categoryPrefix string
		switch strings.ToLower(challenge.Category) {
		case "web":
			categoryPrefix = "web"
		case "cryptography":
			categoryPrefix = "cry"
		case "forensics":
			categoryPrefix = "fns"
		case "reverse engineering":
			categoryPrefix = "rev"
		case "misc":
			categoryPrefix = "msc"
		default:
			categoryPrefix = strings.ToLower(challenge.Category[:3])
		}
		titleSlug := slugify(challenge.Title)
		challengeTag := fmt.Sprintf("%s-%s", categoryPrefix, titleSlug)

		// Renew container timeout
		containerInfo, err := dockerService.RenewContainerTimeout(req.TeamID, req.ChallengeID, challengeTag)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error renewing container timeout: %v", err), http.StatusInternalServerError)
			return
		}

		// Return container info
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":   true,
			"expiresAt": containerInfo.ExpiresAt.Format(time.RFC3339),
			"message":   "Container timeout renewed",
		})
	})

	// Artifacts endpoints
	r.Get("/artifacts/{challengeId}", func(w http.ResponseWriter, r *http.Request) {
		// Get challenge ID from path
		challengeIDStr := chi.URLParam(r, "challengeId")
		challengeID, err := strconv.Atoi(challengeIDStr)
		if err != nil {
			respondWithError(w, "Invalid challenge ID", http.StatusBadRequest)
			return
		}

		// Get challenge data
		challenge, err := dbClient.GetChallenge(challengeID)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error getting challenge: %v", err), http.StatusInternalServerError)
			return
		}
		if challenge == nil {
			respondWithError(w, fmt.Sprintf("Challenge with ID %d not found", challengeID), http.StatusNotFound)
			return
		}

		// List artifacts
		artifacts, err := artifactsService.ListArtifacts(challenge)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error listing artifacts: %v", err), http.StatusInternalServerError)
			return
		}

		// Return artifacts
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(map[string]interface{}{
			"success":        true,
			"challengeId":    challengeID,
			"challengeTitle": challenge.Title,
			"artifacts":      artifacts,
		})
	})

	r.Get("/artifacts/{challengeId}/{artifactName}", func(w http.ResponseWriter, r *http.Request) {
		// Get challenge ID and artifact name from path
		challengeIDStr := chi.URLParam(r, "challengeId")
		artifactName := chi.URLParam(r, "artifactName")

		challengeID, err := strconv.Atoi(challengeIDStr)
		if err != nil {
			respondWithError(w, "Invalid challenge ID", http.StatusBadRequest)
			return
		}

		// Get challenge data
		challenge, err := dbClient.GetChallenge(challengeID)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error getting challenge: %v", err), http.StatusInternalServerError)
			return
		}
		if challenge == nil {
			respondWithError(w, fmt.Sprintf("Challenge with ID %d not found", challengeID), http.StatusNotFound)
			return
		}

		// Get artifact
		artifact, err := artifactsService.GetArtifact(challenge, artifactName)
		if err != nil {
			respondWithError(w, fmt.Sprintf("Error getting artifact: %v", err), http.StatusInternalServerError)
			return
		}

		// Set headers for download
		w.Header().Set("Content-Type", artifact.MimeType)
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", artifact.Name))
		w.Header().Set("Content-Length", fmt.Sprintf("%d", artifact.Size))

		// Stream the file
		http.ServeFile(w, r, artifact.Path)
	})

	// Start server
	server := &http.Server{
		Addr:    fmt.Sprintf(":%d", cfg.Port),
		Handler: r,
	}

	// Start the server in a goroutine
	go func() {
		log.Printf("Server listening on :%d", cfg.Port)
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Error starting server: %v", err)
		}
	}()

	// Wait for interrupt signal to gracefully shut down the server
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down server...")

	// Create a deadline for server shutdown
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Attempt graceful shutdown
	if err := server.Shutdown(ctx); err != nil {
		log.Fatalf("Server forced to shutdown: %v", err)
	}

	log.Println("Server exited properly")
}

// respondWithError sends a JSON error response
func respondWithError(w http.ResponseWriter, message string, statusCode int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(ErrorResponse{
		Success: false,
		Message: message,
	})
}

// slugify converts a string to a slug
func slugify(text string) string {
	// Convert to lowercase
	text = strings.ToLower(text)
	// Replace spaces with hyphens
	text = strings.ReplaceAll(text, " ", "-")
	// Remove special characters
	text = strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			return r
		}
		return -1
	}, text)
	// Replace multiple hyphens with a single one
	for strings.Contains(text, "--") {
		text = strings.ReplaceAll(text, "--", "-")
	}
	// Trim hyphens from beginning and end
	text = strings.Trim(text, "-")
	return text
}
