#!/bin/bash
# ==========================================
# PetTwin Care - Datadog Agent Setup Script
# Automated installation and configuration
# ==========================================

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ==========================================
# Helper Functions
# ==========================================

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# ==========================================
# Environment Check
# ==========================================

check_prerequisites() {
    log_info "Checking prerequisites..."

    # Check Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    log_success "Docker found: $(docker --version)"

    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
        log_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    log_success "Docker Compose found"

    # Check for .env file
    if [ ! -f .env ]; then
        log_warning ".env file not found"
        if [ -f backend/.env ]; then
            log_info "Using backend/.env"
        else
            log_error "No .env file found. Please create one with DD_API_KEY and DD_APP_KEY"
            exit 1
        fi
    fi
}

# ==========================================
# Datadog Credentials Check
# ==========================================

check_datadog_credentials() {
    log_info "Checking Datadog credentials..."

    # Load .env file
    if [ -f .env ]; then
        source .env
    elif [ -f backend/.env ]; then
        source backend/.env
    fi

    if [ -z "${DD_API_KEY:-}" ]; then
        log_error "DD_API_KEY not found in .env file"
        log_info "Get your API key from: https://app.datadoghq.com/organization-settings/api-keys"
        exit 1
    fi

    if [ -z "${DD_SITE:-}" ]; then
        log_warning "DD_SITE not set, defaulting to datadoghq.eu"
        export DD_SITE="datadoghq.eu"
    fi

    log_success "Datadog credentials configured"
    log_info "Site: ${DD_SITE}"
}

# ==========================================
# Docker Network Setup
# ==========================================

setup_network() {
    log_info "Setting up Docker network..."

    if docker network ls | grep -q pettwin-network; then
        log_success "Network 'pettwin-network' already exists"
    else
        docker network create pettwin-network
        log_success "Created network 'pettwin-network'"
    fi
}

# ==========================================
# Datadog Agent Deployment
# ==========================================

deploy_agent() {
    log_info "Deploying Datadog Agent..."

    # Stop existing agent if running
    if docker ps -a | grep -q datadog-agent; then
        log_info "Stopping existing Datadog Agent..."
        docker stop datadog-agent 2>/dev/null || true
        docker rm datadog-agent 2>/dev/null || true
    fi

    # Start Datadog Agent with docker-compose
    log_info "Starting Datadog Agent via docker-compose..."
    docker-compose up -d datadog-agent

    log_success "Datadog Agent deployed"
}

# ==========================================
# Health Check
# ==========================================

health_check() {
    log_info "Running health check..."

    # Wait for agent to start
    sleep 5

    # Check if agent is running
    if docker ps | grep -q datadog-agent; then
        log_success "Datadog Agent is running"
    else
        log_error "Datadog Agent failed to start"
        docker logs datadog-agent
        exit 1
    fi

    # Check agent status
    log_info "Checking agent status..."
    docker exec datadog-agent agent status || {
        log_warning "Could not get full agent status (agent may still be initializing)"
    }

    log_success "Health check passed"
}

# ==========================================
# Verification
# ==========================================

verify_metrics() {
    log_info "Verifying metrics collection..."

    log_info "Checking DogStatsD port (8125/udp)..."
    if netstat -an 2>/dev/null | grep -q ":8125" || ss -an 2>/dev/null | grep -q ":8125"; then
        log_success "DogStatsD is listening on port 8125"
    else
        log_warning "DogStatsD port check inconclusive (may still be working)"
    fi

    log_info "Checking APM port (8126/tcp)..."
    if netstat -an 2>/dev/null | grep -q ":8126" || ss -an 2>/dev/null | grep -q ":8126"; then
        log_success "APM is listening on port 8126"
    else
        log_warning "APM port check inconclusive (may still be working)"
    fi

    log_success "Verification complete"
}

# ==========================================
# Display Instructions
# ==========================================

display_instructions() {
    echo ""
    echo "=========================================="
    log_success "Datadog Agent Setup Complete!"
    echo "=========================================="
    echo ""
    echo "📊 Next Steps:"
    echo ""
    echo "1. Start your backend services:"
    echo "   ${BLUE}docker-compose up -d backend${NC}"
    echo ""
    echo "2. View agent logs:"
    echo "   ${BLUE}docker logs -f datadog-agent${NC}"
    echo ""
    echo "3. Check agent status:"
    echo "   ${BLUE}docker exec datadog-agent agent status${NC}"
    echo ""
    echo "4. View metrics in Datadog:"
    echo "   ${BLUE}https://app.${DD_SITE:-datadoghq.eu}/metric/explorer${NC}"
    echo ""
    echo "5. View your dashboard:"
    echo "   ${BLUE}https://app.${DD_SITE:-datadoghq.eu}/dashboard/t7g-ubd-aet${NC}"
    echo ""
    echo "📝 Documentation:"
    echo "   - Agent Config: backend/datadog-agent.yaml"
    echo "   - Docker Setup: docker-compose.yml"
    echo "   - Metrics Guide: docs/DATADOG_IMPLEMENTATION.md"
    echo ""
    echo "🔍 Troubleshooting:"
    echo "   - Check logs: docker logs datadog-agent"
    echo "   - Restart agent: docker-compose restart datadog-agent"
    echo "   - Re-run setup: bash scripts/setup-datadog-agent.sh"
    echo ""
    log_success "Happy monitoring! 🚀"
    echo ""
}

# ==========================================
# Main Execution
# ==========================================

main() {
    echo ""
    echo "=========================================="
    echo "🐕 PetTwin Care - Datadog Agent Setup"
    echo "=========================================="
    echo ""

    check_prerequisites
    check_datadog_credentials
    setup_network
    deploy_agent
    health_check
    verify_metrics
    display_instructions
}

# Run main function
main "$@"
