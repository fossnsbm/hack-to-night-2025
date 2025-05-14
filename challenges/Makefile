.PHONY: build run clean test docker docker-run deps update-deps help fix-deps network build-seeder run-seeder

# Default target
all: help

# Build variables
BINARY_NAME=ctf-challenges-server
SEEDER_BINARY_NAME=ctf-seeder
DOCKER_IMAGE=ctf-challenges-server
BUILD_DIR=./bin
GO_FILES=$(shell find . -name "*.go" -type f)

# Help target
help:
	@echo "CTF Challenges Server - Makefile Commands"
	@echo ""
	@echo "Usage:"
	@echo "  make build        - Build the challenges server binary"
	@echo "  make run          - Run the challenges server"
	@echo "  make build-seeder - Build the CTF seeder binary"
	@echo "  make run-seeder   - Run the CTF seeder to populate the database"
	@echo "  make clean        - Remove build artifacts"
	@echo "  make test         - Run tests"
	@echo "  make deps         - Download Go dependencies"
	@echo "  make update-deps  - Update Go dependencies"
	@echo "  make fix-deps     - Fix dependency issues (esp. libsql-client-go)"
	@echo "  make docker       - Build Docker image"
	@echo "  make docker-run   - Run Docker image"
	@echo "  make network      - Create Docker network for the application"
	@echo ""

# Build the Go binary
build: $(GO_FILES)
	@echo "Building $(BINARY_NAME)..."
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(BINARY_NAME) ./cmd/server
	@echo "Build complete: $(BUILD_DIR)/$(BINARY_NAME)"

# Build the CTF seeder binary
build-seeder: $(GO_FILES)
	@echo "Building $(SEEDER_BINARY_NAME)..."
	@mkdir -p $(BUILD_DIR)
	@go build -o $(BUILD_DIR)/$(SEEDER_BINARY_NAME) ./cmd/ctfseeder
	@echo "Build complete: $(BUILD_DIR)/$(SEEDER_BINARY_NAME)"

# Run the application
run:
	@echo "Running $(BINARY_NAME)..."
	@go run ./cmd/server

# Run the CTF seeder
run-seeder:
	@echo "Running $(SEEDER_BINARY_NAME)..."
	@go run ./cmd/ctfseeder

# Clean build artifacts
clean:
	@echo "Cleaning up..."
	@rm -rf $(BUILD_DIR)
	@echo "Cleanup complete"

# Run tests
test:
	@echo "Running tests..."
	@go test -v ./...

# Download dependencies
deps:
	@echo "Downloading dependencies..."
	@go mod download
	@go mod tidy
	@echo "Dependencies downloaded"

# Update dependencies
update-deps:
	@echo "Updating dependencies..."
	@go get -u ./...
	@go mod tidy
	@echo "Dependencies updated"

# Fix dependency issues
fix-deps:
	@echo "Fixing dependency issues..."
	@go mod edit -droprequire=github.com/tursodatabase/libsql-client-go
	@go get github.com/tursodatabase/libsql-client-go@v0.0.0-20240902231107-85af5b9d094d
	@go mod tidy
	@echo "Dependencies fixed"

# Build Docker image
docker:
	@echo "Building Docker image: $(DOCKER_IMAGE)..."
	@docker build -t $(DOCKER_IMAGE) .
	@echo "Docker image built"

# Run Docker image
docker-run:
	@echo "Running Docker image: $(DOCKER_IMAGE)..."
	@docker run -p 3001:3001 \
		-v /var/run/docker.sock:/var/run/docker.sock \
		--network ctf-network \
		--env-file .env.local \
		$(DOCKER_IMAGE)

# Network setup
network:
	@echo "Creating Docker network: ctf-network..."
	@docker network create ctf-network || echo "Network already exists" 