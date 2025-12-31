#!/bin/bash
# ==========================================
# PetTwin Care - Datadog Infrastructure Deployment Script
# Automated deployment with validation and rollback
# ==========================================

set -e  # Exit on error
set -u  # Exit on undefined variable

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
TERRAFORM_DIR="terraform/datadog"
BACKUP_DIR=".terraform-backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

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

log_step() {
    echo -e "${PURPLE}▶️  $1${NC}"
}

# ==========================================
# Pre-flight Checks
# ==========================================

preflight_checks() {
    log_step "Running pre-flight checks..."

    # Check if Terraform is installed
    if ! command -v terraform &> /dev/null; then
        log_error "Terraform is not installed"
        log_info "Install from: https://www.terraform.io/downloads"
        exit 1
    fi
    log_success "Terraform found: $(terraform version | head -n1)"

    # Check if we're in the right directory
    if [ ! -d "$TERRAFORM_DIR" ]; then
        log_error "Terraform directory not found: $TERRAFORM_DIR"
        log_info "Please run this script from the project root"
        exit 1
    fi
    log_success "Terraform directory found"

    # Check for credentials
    if [ -z "${DD_API_KEY:-}" ] && [ -z "${TF_VAR_datadog_api_key:-}" ]; then
        log_error "Datadog API key not found"
        log_info "Set DD_API_KEY or TF_VAR_datadog_api_key environment variable"
        exit 1
    fi
    log_success "Datadog credentials configured"

    # Check for required files
    required_files=(
        "$TERRAFORM_DIR/main.tf"
        "$TERRAFORM_DIR/monitors.tf"
        "$TERRAFORM_DIR/variables.tf"
        "$TERRAFORM_DIR/slos.tf"
        "$TERRAFORM_DIR/dashboard_executive.tf"
    )

    for file in "${required_files[@]}"; do
        if [ ! -f "$file" ]; then
            log_error "Required file not found: $file"
            exit 1
        fi
    done
    log_success "All required files present"

    log_success "Pre-flight checks passed ✈️"
    echo ""
}

# ==========================================
# Backup State
# ==========================================

backup_state() {
    log_step "Backing up Terraform state..."

    mkdir -p "$BACKUP_DIR"

    if [ -f "$TERRAFORM_DIR/terraform.tfstate" ]; then
        cp "$TERRAFORM_DIR/terraform.tfstate" "$BACKUP_DIR/terraform.tfstate.$TIMESTAMP"
        log_success "State backed up to $BACKUP_DIR/terraform.tfstate.$TIMESTAMP"
    else
        log_info "No existing state file to backup"
    fi
}

# ==========================================
# Terraform Operations
# ==========================================

terraform_init() {
    log_step "Initializing Terraform..."

    cd "$TERRAFORM_DIR"
    terraform init -upgrade
    cd - > /dev/null

    log_success "Terraform initialized"
}

terraform_validate() {
    log_step "Validating Terraform configuration..."

    cd "$TERRAFORM_DIR"
    terraform fmt -check || {
        log_warning "Terraform files not formatted. Running terraform fmt..."
        terraform fmt -recursive
    }
    terraform validate
    cd - > /dev/null

    log_success "Terraform configuration valid"
}

terraform_plan() {
    log_step "Planning Terraform changes..."

    cd "$TERRAFORM_DIR"
    terraform plan -out=tfplan

    echo ""
    log_info "Review the plan above carefully"
    read -p "Do you want to continue with deployment? (yes/no): " confirm

    if [ "$confirm" != "yes" ]; then
        log_warning "Deployment cancelled by user"
        rm -f tfplan
        cd - > /dev/null
        exit 0
    fi

    cd - > /dev/null
    log_success "Plan approved"
}

terraform_apply() {
    log_step "Applying Terraform changes..."

    cd "$TERRAFORM_DIR"
    terraform apply tfplan
    rm -f tfplan
    cd - > /dev/null

    log_success "Terraform apply completed"
}

# ==========================================
# Post-Deployment
# ==========================================

post_deployment() {
    log_step "Gathering deployment information..."

    cd "$TERRAFORM_DIR"

    # Get outputs
    echo ""
    echo "=========================================="
    log_success "🎉 Datadog Infrastructure Deployed!"
    echo "=========================================="
    echo ""

    # Dashboard URLs
    echo "📊 Dashboards:"
    DASHBOARD_URL=$(terraform output -raw dashboard_url 2>/dev/null || echo "N/A")
    EXEC_DASHBOARD_URL=$(terraform output -raw executive_dashboard_url 2>/dev/null || echo "N/A")
    echo "   - Technical: $DASHBOARD_URL"
    echo "   - Executive: $EXEC_DASHBOARD_URL"
    echo ""

    # Resource counts
    echo "📋 Resources Created:"
    terraform output deployment_summary 2>/dev/null || echo "   (Run 'terraform output' to see details)"
    echo ""

    # Next steps
    echo "🚀 Next Steps:"
    echo "   1. Visit dashboards to verify widgets are displaying"
    echo "   2. Check monitors: terraform output monitor_urls"
    echo "   3. Review SLO status: terraform output slo_status_urls"
    echo "   4. Start backend services to begin sending metrics"
    echo "   5. Wait 2-3 minutes for metrics to appear"
    echo ""

    # Commands
    echo "📝 Useful Commands:"
    echo "   - View all outputs: cd $TERRAFORM_DIR && terraform output"
    echo "   - View state: cd $TERRAFORM_DIR && terraform show"
    echo "   - Update infrastructure: bash scripts/deploy-datadog.sh"
    echo ""

    cd - > /dev/null

    log_success "Deployment complete! 🚀"
}

# ==========================================
# Rollback Function
# ==========================================

rollback() {
    log_warning "Rolling back to previous state..."

    latest_backup=$(ls -t "$BACKUP_DIR"/terraform.tfstate.* 2>/dev/null | head -n1)

    if [ -z "$latest_backup" ]; then
        log_error "No backup found to rollback to"
        exit 1
    fi

    log_info "Restoring state from: $latest_backup"
    cp "$latest_backup" "$TERRAFORM_DIR/terraform.tfstate"

    cd "$TERRAFORM_DIR"
    terraform apply -auto-approve
    cd - > /dev/null

    log_success "Rollback complete"
}

# ==========================================
# Main Execution
# ==========================================

main() {
    echo "=========================================="
    echo "🐕 PetTwin Care - Datadog Deployment"
    echo "=========================================="
    echo ""

    # Parse arguments
    ACTION="${1:-deploy}"

    case "$ACTION" in
        deploy)
            preflight_checks
            backup_state
            terraform_init
            terraform_validate
            terraform_plan
            terraform_apply
            post_deployment
            ;;
        rollback)
            rollback
            ;;
        validate)
            preflight_checks
            terraform_init
            terraform_validate
            log_success "Validation complete"
            ;;
        plan)
            preflight_checks
            terraform_init
            terraform_validate
            cd "$TERRAFORM_DIR"
            terraform plan
            cd - > /dev/null
            ;;
        *)
            echo "Usage: $0 {deploy|rollback|validate|plan}"
            echo ""
            echo "Commands:"
            echo "  deploy   - Full deployment (default)"
            echo "  rollback - Rollback to previous state"
            echo "  validate - Validate configuration only"
            echo "  plan     - Show plan without applying"
            exit 1
            ;;
    esac
}

# Trap errors and offer rollback
trap 'log_error "Deployment failed! Run: $0 rollback"; exit 1' ERR

# Run main function
main "$@"
