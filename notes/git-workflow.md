# Git Workflow for TMOps Team (3 Developers)

## Branching Strategy

### Main Branches
- **`main`** - Production-ready code, always deployable
- **`develop`** - Integration branch for features, staging environment
- **`staging`** - Pre-production testing branch

### Feature Branches
- **`feature/<ticket-number>-<short-description>`**
- **`bugfix/<ticket-number>-<short-description>`** 
- **`hotfix/<ticket-number>-<short-description>`**

## Workflow Process

### 1. Starting New Work
```bash
# Always start from the latest develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/TMOPS-123-driver-management
```

### 2. Daily Development
```bash
# Regular commits with meaningful messages
git add .
git commit -m "feat: add driver creation form with validation"

# Push to remote regularly
git push origin feature/TMOPS-123-driver-management
```

### 3. Code Review Process
```bash
# Before creating PR, sync with develop
git checkout develop
git pull origin develop
git checkout feature/TMOPS-123-driver-management
git rebase develop

# Create Pull Request to develop branch
# Require at least 1 approval from team member
```

### 4. Release Process
```bash
# Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Final testing and bug fixes only
# Merge to main when ready
git checkout main
git merge release/v1.2.0
git tag v1.2.0
git push origin main --tags

# Merge back to develop
git checkout develop
git merge main
```

## Team Roles & Responsibilities

### Developer 1 - Frontend Lead
- UI Components and mobile responsiveness
- Bottom navigation and layout
- Driver/Truck management interfaces

### Developer 2 - Backend/Data Lead  
- Data models and state management
- Load management and reporting
- API integrations (future)

### Developer 3 - QA/DevOps Lead
- Testing and code quality
- Settings and configuration
- Deployment and CI/CD setup

## Branch Protection Rules

### Main Branch
- Require pull request reviews
- Require status checks to pass
- Require branches to be up to date
- No direct pushes allowed

### Develop Branch
- Require at least 1 approval
- Require status checks to pass
- Allow squash merging

## Commit Message Convention

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

### Examples
```
feat(drivers): add driver creation form with validation
fix(loads): resolve status update bug in load management
docs(readme): update installation instructions
style(components): format navigation component
refactor(hooks): optimize data fetching logic
test(drivers): add unit tests for driver service
chore(deps): update Next.js to latest version
```

## Daily Workflow

### Morning Standup Prep
```bash
# Check what you worked on yesterday
git log --oneline --since="yesterday" --author="$(git config user.name)"

# Update local branches
git fetch --all
git checkout develop
git pull origin develop
```

### End of Day
```bash
# Commit current work
git add .
git commit -m "wip: progress on driver form validation"
git push origin feature/your-branch

# Clean up merged branches
git branch --merged develop | grep -v develop | xargs -n 1 git branch -d
```

## Emergency Hotfix Process
```bash
# For critical production bugs
git checkout main
git pull origin main
git checkout -b hotfix/TMOPS-456-critical-login-fix

# Make minimal fix
git commit -m "hotfix: resolve critical login validation issue"

# Merge to main immediately
git checkout main
git merge hotfix/TMOPS-456-critical-login-fix
git push origin main

# Merge to develop
git checkout develop
git merge main
git push origin develop
```

## Best Practices

### Do's
- ✅ Keep feature branches small and focused
- ✅ Write descriptive commit messages
- ✅ Test locally before pushing
- ✅ Rebase instead of merge for feature branches
- ✅ Use draft PRs for work in progress
- ✅ Review code thoroughly

### Don'ts
- ❌ Don't commit directly to main or develop
- ❌ Don't push broken code
- ❌ Don't create massive commits
- ❌ Don't ignore merge conflicts
- ❌ Don't skip code reviews
- ❌ Don't leave stale branches
