#!/bin/bash

# Build and push all challenge Docker images to local registry
# Usage: ./build-challenges.sh [category] [challenge_name]

REGISTRY="localhost:5000"
CHALLENGES_DIR="./challenges"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_header() {
    echo -e "${BLUE}===== $1 =====${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

build_and_push() {
    local category=$1
    local challenge=$2
    local dockerfile_path="$CHALLENGES_DIR/$category/$challenge"
    
    if [ ! -f "$dockerfile_path/Dockerfile" ]; then
        print_error "No Dockerfile found in $dockerfile_path"
        return 1
    fi
    
    local image_name="$REGISTRY/ctf-$category:$challenge"
    
    print_header "Building $category/$challenge"
    
    # Build the image
    if docker build -t "$image_name" "$dockerfile_path"; then
        print_success "Built $image_name"
    else
        print_error "Failed to build $image_name"
        return 1
    fi
    
    # Push to registry
    if docker push "$image_name"; then
        print_success "Pushed $image_name"
        echo -e "CTFd Docker Image Name: ${YELLOW}$image_name${NC}"
    else
        print_error "Failed to push $image_name"
        return 1
    fi
    
    echo
}

# Check if registry is running
if ! curl -s http://localhost:5000/v2/ > /dev/null; then
    print_error "Local Docker registry is not running on localhost:5000"
    print_warning "Make sure to run: docker-compose up -d registry"
    exit 1
fi

# Build specific challenge if arguments provided
if [ $# -eq 2 ]; then
    build_and_push "$1" "$2"
    exit $?
fi

# Build all challenges
print_header "Building all challenge Docker images"

for category_dir in "$CHALLENGES_DIR"/*; do
    if [ -d "$category_dir" ]; then
        category=$(basename "$category_dir")
        
        # Skip .git directory
        if [ "$category" = ".git" ]; then
            continue
        fi
        
        for challenge_dir in "$category_dir"/*; do
            if [ -d "$challenge_dir" ]; then
                challenge=$(basename "$challenge_dir")
                build_and_push "$category" "$challenge"
            fi
        done
    fi
done

print_header "Build Summary"
print_success "All challenges processed!"
print_warning "Remember to configure these images in CTFd admin panel" 