FROM golang:1.21-alpine AS builder

WORKDIR /app

# Install Docker client
RUN apk add --no-cache docker

# Copy Go module files
COPY go.mod go.sum ./
RUN go mod download

# Copy the rest of the application
COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/bin/server ./cmd/server

# Create the final image
FROM alpine:latest

# Install Docker client
RUN apk add --no-cache docker

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/bin/server /app/server

# Expose the port
EXPOSE 3001

# Run the application
CMD ["/app/server"] 