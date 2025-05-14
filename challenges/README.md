# CTF Challenges Server (Go version)

This server manages CTF challenges, including spinning up Docker containers for VM-based challenges and serving challenge artifacts.

## Features

- Container management with automatic timeouts
- Artifact serving for challenges
- Integration with Traefik for subdomain routing
- Graceful shutdown
- Persistent challenges stored in Turso database

## Setup

1. Copy the `.env.local` file from the platform directory (containing Turso database credentials).
2. Install Go dependencies:
   ```
   go mod tidy
   ```
3. Build and run the server:
   ```
   go run cmd/server/main.go
   ```

## API Endpoints

### VM Management

- **Start VM**: `POST /vm/start`
  ```json
  {
    "teamId": 1,
    "challengeId": 2
  }
  ```

- **Stop VM**: `POST /vm/stop`
  ```json
  {
    "teamId": 1,
    "challengeId": 2
  }
  ```

- **Renew VM Timeout**: `POST /vm/renew`
  ```json
  {
    "teamId": 1,
    "challengeId": 2
  }
  ```

### Artifacts

- **List Artifacts**: `GET /artifacts/:challengeId`
- **Download Artifact**: `GET /artifacts/:challengeId/:artifactName`

## Challenge Structure

Each challenge should be organized as follows using the tag naming convention:

```
challenges/
  ├── challenges/
  │   ├── web-cookie-monster/
  │   │   ├── challenge.json
  │   │   ├── Dockerfile (optional)
  │   │   └── artifacts/
  │   │       ├── file1.zip
  │   │       ├── file2.txt
  │   │       └── ...
  │   ├── rev-binary-analysis/
  │   ├── fns-detective/
  │   ├── cry-encryption/
  │   └── msc-trivia/
```

Each challenge folder uses a tag-based naming format:
- `web-`: Web challenges
- `rev-`: Reverse engineering challenges
- `fns-`: Forensics challenges
- `cry-`: Cryptography challenges
- `msc-`: Miscellaneous challenges

## Docker Containers

- Containers are automatically spun up when requested through the API
- Each container has a 30-minute timeout by default (configurable via environment variables)
- Timeouts can be renewed through the API
- Containers are accessible through subdomains: `[challenge-tag]-team-[teamId].[base-domain]`
- Integrates with Traefik for load balancing and routing

## Configuration

The server can be configured via environment variables in `.env.local`:

```
TURSO_DATABASE_URL=...  # Required
TURSO_AUTH_TOKEN=...    # Required
PORT=3001               # Optional (default: 3001)
DOCKER_NETWORK=ctf-network  # Optional (default: ctf-network)
CONTAINER_TIMEOUT=30m   # Optional (default: 30 minutes)
BASE_DOMAIN=ctf.local   # Optional (default: ctf.local)
```

## Building with Docker

```
docker build -t ctf-challenges-server .
docker run -p 3001:3001 -v /var/run/docker.sock:/var/run/docker.sock --env-file .env.local ctf-challenges-server
``` 