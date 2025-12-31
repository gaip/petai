# GitHub Actions Workflows for PetTwin Care

This directory contains CI/CD workflows for automated Datadog infrastructure deployment and validation.

## 📋 Workflows

### 1. `datadog-deploy.yml` - Deployment Workflow

**Triggers:**
- Push to `main` branch (auto-deploys)
- Push to `claude/**` branches (plans only)
- Pull requests (validation + plan)
- Manual dispatch with action selection

**Jobs:**
- `terraform-validate` - Format, init, and validate configuration
- `terraform-plan` - Generate execution plan
- `terraform-apply` - Deploy to production (main branch only)

**Secrets Required:**
- `DATADOG_API_KEY` - Datadog API key
- `DATADOG_APP_KEY` - Datadog application key
- `DATADOG_API_URL` - (Optional) API URL (defaults to EU)
- `ALERT_EMAIL` - (Optional) Email for alerts

**Outputs:**
- Dashboard URLs posted to deployment summary
- Plan details commented on PR
- Deployment status notifications

### 2. `datadog-validate.yml` - Validation Workflow

**Triggers:**
- Pull requests modifying Datadog infrastructure
- Pull requests modifying backend metrics code
- Manual dispatch

**Jobs:**
- `terraform-security` - Security scan with tfsec
- `terraform-cost-estimate` - Cost analysis (optional)
- `metrics-validation` - Verify metric consistency
- `documentation-check` - Ensure docs are complete
- `integration-test` - Dry-run validation
- `pr-summary` - Generate comprehensive PR summary

**Optional Secrets:**
- `INFRACOST_API_KEY` - For cost estimation

## 🚀 Usage

### Automatic Deployment

```bash
# 1. Make changes to Datadog infrastructure
vim terraform/datadog/main.tf

# 2. Commit and push to feature branch
git add terraform/datadog/
git commit -m "feat: update dashboard"
git push origin feature/my-changes

# 3. Create PR - validation runs automatically
# 4. Merge to main - deployment runs automatically
```

### Manual Deployment

```bash
# Trigger manual deployment
gh workflow run datadog-deploy.yml \
  --ref main \
  --field action=apply
```

### Validation Only

```bash
# Run validation workflow manually
gh workflow run datadog-validate.yml
```

## 🔧 Local Development

### Run Deployment Script

```bash
# Full deployment
bash scripts/deploy-datadog.sh deploy

# Plan only
bash scripts/deploy-datadog.sh plan

# Validation only
bash scripts/deploy-datadog.sh validate

# Rollback
bash scripts/deploy-datadog.sh rollback
```

### Prerequisites

Export required environment variables:

```bash
export TF_VAR_datadog_api_key="your-api-key"
export TF_VAR_datadog_app_key="your-app-key"
export TF_VAR_alert_email="your-email@example.com"
```

Or use `.env` file (not committed):

```bash
# In project root
source .env
bash scripts/deploy-datadog.sh deploy
```

## 📊 Workflow Diagram

```
┌─────────────────┐
│  Code Change    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Create PR      │
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
         ▼                              ▼
┌─────────────────┐          ┌──────────────────┐
│  Validation     │          │  Terraform Plan  │
│  - Security     │          │  - Preview       │
│  - Metrics      │          │  - Cost          │
│  - Docs         │          │  - Comment PR    │
└────────┬────────┘          └─────────┬────────┘
         │                              │
         └──────────────┬───────────────┘
                        │
                        ▼
                ┌───────────────┐
                │  PR Review    │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │  Merge to main│
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Terraform     │
                │ Apply         │
                │ (Production)  │
                └───────┬───────┘
                        │
                        ▼
                ┌───────────────┐
                │ Post Summary  │
                │ - URLs        │
                │ - Status      │
                └───────────────┘
```

## 🔐 Security Best Practices

### Secrets Management

1. **Store secrets in GitHub Secrets**
   - Settings → Secrets and variables → Actions
   - Add: `DATADOG_API_KEY`, `DATADOG_APP_KEY`

2. **Never commit sensitive values**
   - ❌ Don't: `terraform.tfvars` with real credentials
   - ✅ Do: Use `terraform.tfvars.example` as template

3. **Use environment-specific secrets**
   - Production: `DATADOG_API_KEY_PROD`
   - Staging: `DATADOG_API_KEY_STAGING`

### State Management

1. **Enable state locking** (recommended)
   ```hcl
   terraform {
     backend "s3" {
       bucket         = "pettwin-terraform-state"
       key            = "datadog/terraform.tfstate"
       region         = "us-east-1"
       encrypt        = true
       dynamodb_table = "terraform-state-lock"
     }
   }
   ```

2. **Backup state files**
   - Automated backups in `scripts/deploy-datadog.sh`
   - Manual backups before major changes

## 📈 Monitoring Workflows

### View Workflow Runs

```bash
# List recent runs
gh run list --workflow=datadog-deploy.yml

# View specific run
gh run view <run-id>

# Watch live run
gh run watch
```

### Debug Failed Runs

```bash
# View logs
gh run view <run-id> --log

# Re-run failed jobs
gh run rerun <run-id> --failed
```

## 🎯 Best Practices

### Pull Request Workflow

1. **Small, focused changes**
   - One feature/fix per PR
   - Clear description of changes

2. **Review validation results**
   - Check security scan results
   - Verify metric consistency
   - Review Terraform plan

3. **Wait for approvals**
   - Require at least 1 reviewer
   - Address feedback before merge

### Deployment Strategy

1. **Test in staging first** (if available)
   - Use separate Datadog account
   - Validate changes work as expected

2. **Deploy during low-traffic periods**
   - Schedule maintenance windows
   - Monitor dashboards after deployment

3. **Have rollback plan**
   - Use `scripts/deploy-datadog.sh rollback`
   - Keep previous state backups

## 🆘 Troubleshooting

### Workflow fails with "Invalid credentials"

**Solution:**
1. Check GitHub Secrets are set correctly
2. Verify API keys in Datadog settings
3. Ensure keys have proper permissions

### Plan shows unexpected changes

**Solution:**
1. Check for manual changes in Datadog UI
2. Import existing resources: `terraform import`
3. Review recent commits

### Apply fails mid-deployment

**Solution:**
1. Check Terraform state: `terraform show`
2. Review error message in workflow logs
3. Fix issue and re-run: `terraform apply`
4. If critical, rollback: `bash scripts/deploy-datadog.sh rollback`

### Cost estimate not showing

**Solution:**
1. Add `INFRACOST_API_KEY` to GitHub Secrets
2. Sign up at https://www.infracost.io/
3. Re-run workflow

## 📚 Additional Resources

- **Terraform Docs**: https://registry.terraform.io/providers/DataDog/datadog/latest/docs
- **GitHub Actions**: https://docs.github.com/en/actions
- **Datadog API**: https://docs.datadoghq.com/api/
- **Project Docs**: `../docs/DATADOG_IMPLEMENTATION.md`

## 🔄 Workflow Maintenance

### Update Terraform Version

Edit `.github/workflows/datadog-deploy.yml`:

```yaml
env:
  TF_VERSION: '1.7.0'  # Update this
```

### Add New Validation Checks

Edit `.github/workflows/datadog-validate.yml`:

```yaml
# Add new job
new-check:
  name: My New Check
  runs-on: ubuntu-latest
  steps:
    - name: Run check
      run: echo "Custom validation"
```

---

**Questions?** Check the main documentation: `docs/DATADOG_IMPLEMENTATION.md`
