package artifacts

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/hack-to-night-2025/challenges/internal/db"
)

// ArtifactInfo holds information about an artifact file
type ArtifactInfo struct {
	Name         string    `json:"name"`
	Size         int64     `json:"size"`
	Path         string    `json:"path"`
	LastModified time.Time `json:"lastModified"`
	MimeType     string    `json:"mimeType"`
}

// Service manages challenge artifacts
type Service struct {
	basePath string
}

// NewService creates a new artifacts service
func NewService() (*Service, error) {
	// Get the base directory
	dir, err := os.Getwd()
	if err != nil {
		return nil, fmt.Errorf("error getting working directory: %w", err)
	}

	return &Service{
		basePath: dir,
	}, nil
}

// FindChallengeFolder finds the folder for a challenge
func (s *Service) FindChallengeFolder(challenge *db.Challenge) (string, error) {
	if challenge == nil || challenge.Category == "" || challenge.Title == "" {
		return "", fmt.Errorf("invalid challenge data")
	}

	// Create a tag using the three-letter category prefix and challenge title slug
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

	// Convert title to slug for challenge tag
	titleSlug := slugify(challenge.Title)

	// Build tag and path
	challengeTag := fmt.Sprintf("%s-%s", categoryPrefix, titleSlug)
	expectedPath := filepath.Join(s.basePath, "challenges", challengeTag)

	// Check if path exists
	if _, err := os.Stat(expectedPath); os.IsNotExist(err) {
		return "", fmt.Errorf("challenge directory not found: %s", expectedPath)
	}

	return expectedPath, nil
}

// slugify converts a string to a slug (moved from docker package to avoid dependency)
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

// ListArtifacts lists all artifacts for a challenge
func (s *Service) ListArtifacts(challenge *db.Challenge) ([]ArtifactInfo, error) {
	challengeFolder, err := s.FindChallengeFolder(challenge)
	if err != nil {
		return nil, err
	}

	// Look for an 'artifacts' subdirectory
	artifactsDir := filepath.Join(challengeFolder, "artifacts")
	if _, err := os.Stat(artifactsDir); os.IsNotExist(err) {
		return []ArtifactInfo{}, nil // Return empty list if no artifacts directory
	}

	// Read directory contents
	entries, err := os.ReadDir(artifactsDir)
	if err != nil {
		return nil, fmt.Errorf("error reading artifacts directory: %w", err)
	}

	artifacts := make([]ArtifactInfo, 0, len(entries))
	for _, entry := range entries {
		if entry.IsDir() {
			continue // Skip directories
		}

		filePath := filepath.Join(artifactsDir, entry.Name())
		info, err := entry.Info()
		if err != nil {
			return nil, fmt.Errorf("error getting file info: %w", err)
		}

		artifacts = append(artifacts, ArtifactInfo{
			Name:         entry.Name(),
			Size:         info.Size(),
			Path:         filePath,
			LastModified: info.ModTime(),
			MimeType:     getMimeType(filePath),
		})
	}

	return artifacts, nil
}

// GetArtifact gets a specific artifact
func (s *Service) GetArtifact(challenge *db.Challenge, artifactName string) (*ArtifactInfo, error) {
	challengeFolder, err := s.FindChallengeFolder(challenge)
	if err != nil {
		return nil, err
	}

	// Build artifact path
	artifactPath := filepath.Join(challengeFolder, "artifacts", artifactName)

	// Check if file exists
	fileInfo, err := os.Stat(artifactPath)
	if os.IsNotExist(err) {
		return nil, fmt.Errorf("artifact not found: %s", artifactName)
	}
	if err != nil {
		return nil, fmt.Errorf("error checking artifact: %w", err)
	}

	// Check if it's a file (not a directory)
	if fileInfo.IsDir() {
		return nil, fmt.Errorf("artifact is a directory: %s", artifactName)
	}

	// Return artifact info
	return &ArtifactInfo{
		Name:         artifactName,
		Size:         fileInfo.Size(),
		Path:         artifactPath,
		LastModified: fileInfo.ModTime(),
		MimeType:     getMimeType(artifactPath),
	}, nil
}

// getMimeType returns the MIME type for a file based on its extension
func getMimeType(filePath string) string {
	ext := strings.ToLower(filepath.Ext(filePath))

	mimeTypes := map[string]string{
		".txt":  "text/plain",
		".pdf":  "application/pdf",
		".zip":  "application/zip",
		".tar":  "application/x-tar",
		".gz":   "application/gzip",
		".exe":  "application/octet-stream",
		".png":  "image/png",
		".jpg":  "image/jpeg",
		".jpeg": "image/jpeg",
		".gif":  "image/gif",
		".html": "text/html",
		".js":   "text/javascript",
		".json": "application/json",
		".css":  "text/css",
		".bin":  "application/octet-stream",
		".elf":  "application/octet-stream",
		".pcap": "application/vnd.tcpdump.pcap",
	}

	if mime, ok := mimeTypes[ext]; ok {
		return mime
	}

	// Default MIME type
	return "application/octet-stream"
}
