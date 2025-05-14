package docker

import (
	"context"
	"fmt"
	"io"
	"os"
	"path/filepath"
	"strings"
	"sync"
	"time"

	"github.com/docker/docker/api/types"
	"github.com/docker/docker/api/types/container"
	"github.com/docker/docker/api/types/filters"
	"github.com/docker/docker/client"
	"github.com/docker/docker/pkg/archive"
	"github.com/hack-to-night-2025/challenges/internal/config"
)

// ContainerInfo stores information about an active container
type ContainerInfo struct {
	ContainerID   string
	ContainerName string
	Hostname      string
	Status        string
	TeamID        int
	ChallengeID   int
	ExpiresAt     time.Time
	TimeoutCancel context.CancelFunc
}

// Service manages Docker containers
type Service struct {
	client       *client.Client
	config       *config.Config
	containers   map[string]*ContainerInfo // containerName -> ContainerInfo
	mu           sync.RWMutex
	basePath     string
	activeTimers map[string]context.CancelFunc // containerName -> cancel function
}

// NewService creates a new Docker service
func NewService(config *config.Config) (*Service, error) {
	dockerClient, err := client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	if err != nil {
		return nil, fmt.Errorf("error creating docker client: %w", err)
	}

	// Get the base directory
	dir, err := os.Getwd()
	if err != nil {
		return nil, fmt.Errorf("error getting working directory: %w", err)
	}

	return &Service{
		client:       dockerClient,
		config:       config,
		containers:   make(map[string]*ContainerInfo),
		activeTimers: make(map[string]context.CancelFunc),
		basePath:     dir,
	}, nil
}

// StartContainer starts a container for a team and challenge
func (s *Service) StartContainer(teamID, challengeID int, challengeTag string) (*ContainerInfo, error) {
	// Generate container name
	containerName := fmt.Sprintf("ctf-%s-team-%d", challengeTag, teamID)

	// Lock for thread safety
	s.mu.Lock()
	defer s.mu.Unlock()

	// Check if there's already a container for this team/challenge
	if containerInfo, exists := s.containers[containerName]; exists {
		// Renew the timeout
		s.renewContainerTimeout(containerName)
		return containerInfo, nil
	}

	// Look for the challenge folder with the tag directly
	ctx := context.Background()
	challengePath := filepath.Join(s.basePath, "challenges", challengeTag)

	// Check if path exists
	if _, err := os.Stat(challengePath); os.IsNotExist(err) {
		return nil, fmt.Errorf("challenge path not found for %s", challengeTag)
	}

	// Check if there's a Dockerfile
	dockerfilePath := filepath.Join(challengePath, "Dockerfile")
	_, err := os.Stat(dockerfilePath)
	if os.IsNotExist(err) {
		return nil, fmt.Errorf("Dockerfile not found for challenge %s", challengeTag)
	}

	// Build the Docker image
	tar, err := archive.TarWithOptions(challengePath, &archive.TarOptions{})
	if err != nil {
		return nil, fmt.Errorf("error creating tar archive: %w", err)
	}
	defer tar.Close()

	imageName := fmt.Sprintf("ctf/%s", challengeTag)
	buildOptions := types.ImageBuildOptions{
		Tags:       []string{imageName},
		Dockerfile: "Dockerfile",
		Remove:     true,
	}

	buildResponse, err := s.client.ImageBuild(ctx, tar, buildOptions)
	if err != nil {
		return nil, fmt.Errorf("error building image: %w", err)
	}
	defer buildResponse.Body.Close()

	// Wait for the build to complete
	_, err = io.Copy(io.Discard, buildResponse.Body)
	if err != nil {
		return nil, fmt.Errorf("error reading build response: %w", err)
	}

	// Create and start the container
	hostConfig := &container.HostConfig{
		NetworkMode: container.NetworkMode(s.config.DockerNetwork),
	}

	// Define labels for traefik
	hostname := fmt.Sprintf("%s-team-%d.%s", challengeTag, teamID, s.config.BaseDomain)
	labels := map[string]string{
		"traefik.enable": "true",
		fmt.Sprintf("traefik.http.routers.%s.rule", containerName):                      fmt.Sprintf("Host(`%s`)", hostname),
		fmt.Sprintf("traefik.http.services.%s.loadbalancer.server.port", containerName): "80",
	}

	// Create the container
	containerConfig := &container.Config{
		Image:  imageName,
		Labels: labels,
	}

	resp, err := s.client.ContainerCreate(ctx, containerConfig, hostConfig, nil, nil, containerName)
	if err != nil {
		return nil, fmt.Errorf("error creating container: %w", err)
	}

	// Start the container
	if err := s.client.ContainerStart(ctx, resp.ID, container.StartOptions{}); err != nil {
		return nil, fmt.Errorf("error starting container: %w", err)
	}

	// Set timeout for the container
	expiresAt := time.Now().Add(s.config.ContainerTimeout)
	containerInfo := &ContainerInfo{
		ContainerID:   resp.ID,
		ContainerName: containerName,
		TeamID:        teamID,
		ChallengeID:   challengeID,
		Hostname:      hostname,
		Status:        "running",
		ExpiresAt:     expiresAt,
	}

	// Store the container
	s.containers[containerName] = containerInfo

	// Set up the timeout
	s.setContainerTimeout(containerName, resp.ID)

	return containerInfo, nil
}

// StopContainer stops a container
func (s *Service) StopContainer(teamID, challengeID int, challengeTag string) error {
	containerName := fmt.Sprintf("ctf-%s-team-%d", challengeTag, teamID)

	// Lock for thread safety
	s.mu.Lock()
	defer s.mu.Unlock()

	// Clear any existing timeout
	s.clearContainerTimeout(containerName)

	// Check if we have the container in our map
	if _, exists := s.containers[containerName]; exists {
		delete(s.containers, containerName)
	}

	// Look up container by name in Docker
	ctx := context.Background()
	containers, err := s.client.ContainerList(ctx, container.ListOptions{
		All: true,
		Filters: filters.NewArgs(
			filters.Arg("name", containerName),
		),
	})
	if err != nil {
		return fmt.Errorf("error listing containers: %w", err)
	}

	if len(containers) == 0 {
		return fmt.Errorf("container %s not found", containerName)
	}

	// Stop and remove the container
	stopTimeout := 10 // seconds
	if err := s.client.ContainerStop(ctx, containers[0].ID, container.StopOptions{Timeout: &stopTimeout}); err != nil {
		return fmt.Errorf("error stopping container: %w", err)
	}

	if err := s.client.ContainerRemove(ctx, containers[0].ID, container.RemoveOptions{
		Force: true,
	}); err != nil {
		return fmt.Errorf("error removing container: %w", err)
	}

	return nil
}

// RenewContainerTimeout renews the timeout for a container
func (s *Service) RenewContainerTimeout(teamID, challengeID int, challengeTag string) (*ContainerInfo, error) {
	containerName := fmt.Sprintf("ctf-%s-team-%d", challengeTag, teamID)

	// Lock for thread safety
	s.mu.Lock()
	defer s.mu.Unlock()

	// Check if the container exists
	containerInfo, exists := s.containers[containerName]
	if !exists {
		// Try to look it up in Docker
		ctx := context.Background()
		containers, err := s.client.ContainerList(ctx, container.ListOptions{
			All: true,
			Filters: filters.NewArgs(
				filters.Arg("name", containerName),
			),
		})
		if err != nil {
			return nil, fmt.Errorf("error listing containers: %w", err)
		}

		if len(containers) == 0 {
			return nil, fmt.Errorf("container %s not found", containerName)
		}

		// Container exists in Docker but not in our map
		containerInfo = &ContainerInfo{
			ContainerID:   containers[0].ID,
			ContainerName: containerName,
		}
	}

	// Renew the timeout
	s.renewContainerTimeout(containerName)

	// Update expiration time
	containerInfo.ExpiresAt = time.Now().Add(s.config.ContainerTimeout)

	return containerInfo, nil
}

// GetContainerInfo gets information about a container
func (s *Service) GetContainerInfo(containerName string) (*ContainerInfo, error) {
	// Lock for thread safety
	s.mu.RLock()
	defer s.mu.RUnlock()

	// Check if the container exists in our map
	containerInfo, exists := s.containers[containerName]
	if !exists {
		return nil, fmt.Errorf("container %s not found", containerName)
	}

	return containerInfo, nil
}

// Internal method to renew container timeout
func (s *Service) renewContainerTimeout(containerName string) {
	// Clear existing timeout if any
	s.clearContainerTimeout(containerName)

	// Get container ID
	containerInfo, exists := s.containers[containerName]
	if !exists {
		return
	}

	// Set new timeout
	s.setContainerTimeout(containerName, containerInfo.ContainerID)
}

// Internal method to set container timeout
func (s *Service) setContainerTimeout(containerName, containerID string) {
	// Clear existing timeout if any
	s.clearContainerTimeout(containerName)

	// Create a context with cancel for the timeout
	ctx, cancel := context.WithCancel(context.Background())
	s.activeTimers[containerName] = cancel

	// Start a goroutine for the timeout
	go func() {
		timeout := time.NewTimer(s.config.ContainerTimeout)
		defer timeout.Stop()

		select {
		case <-timeout.C:
			// Timer expired, stop the container
			s.mu.Lock()
			defer s.mu.Unlock()

			// Remove from containers map
			delete(s.containers, containerName)
			delete(s.activeTimers, containerName)

			// Stop and remove the container
			stopTimeout := 10 // seconds
			if err := s.client.ContainerStop(context.Background(), containerID, container.StopOptions{Timeout: &stopTimeout}); err != nil {
				fmt.Printf("Error stopping container %s: %v\n", containerName, err)
				return
			}

			if err := s.client.ContainerRemove(context.Background(), containerID, container.RemoveOptions{
				Force: true,
			}); err != nil {
				fmt.Printf("Error removing container %s: %v\n", containerName, err)
			}

		case <-ctx.Done():
			// Context cancelled, timeout was cleared
			return
		}
	}()

	// Update expiration time in the container info
	if containerInfo, exists := s.containers[containerName]; exists {
		containerInfo.ExpiresAt = time.Now().Add(s.config.ContainerTimeout)
		containerInfo.TimeoutCancel = cancel
	}
}

// Internal method to clear container timeout
func (s *Service) clearContainerTimeout(containerName string) {
	// Check if there's an active timeout
	cancel, exists := s.activeTimers[containerName]
	if exists {
		// Cancel the timeout
		cancel()
		delete(s.activeTimers, containerName)
	}

	// Also clean up the TimeoutCancel in ContainerInfo
	if containerInfo, exists := s.containers[containerName]; exists && containerInfo.TimeoutCancel != nil {
		containerInfo.TimeoutCancel()
		containerInfo.TimeoutCancel = nil
	}
}

// Helper to convert string array to map
func sliceToMap(slice []string) map[string]struct{} {
	result := make(map[string]struct{}, len(slice))
	for _, s := range slice {
		result[s] = struct{}{}
	}
	return result
}

// Slugify converts a string to a slug
func Slugify(text string) string {
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
