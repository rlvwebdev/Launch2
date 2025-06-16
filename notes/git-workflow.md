# Git Workflow for TMOps Project

## Current Repository State
- **Repository**: https://github.com/rlvwebdev/Launch2
- **Default Branch**: `master` (production-ready code)
- **Development Branch**: `develop` (integration branch for ongoing work)

## Branching Strategy

### Main Branches
- **`master`** - Production-ready code, always deployable (default branch)
- **`develop`** - Integration branch for features, ongoing development work

### Feature Branches
- **`feature/<ticket-number>-<short-description>`** - New features
- **`bugfix/<ticket-number>-<short-description>`** - Bug fixes
- **`hotfix/<ticket-number>-<short-description>`** - Critical production fixes
- **`enhancement/<ticket-number>-<short-description>`** - Improvements to existing features

## Working with New Features

### 1. Starting New Feature Work
```bash
# Always start from the latest master branch for new features
git checkout master
git pull origin master

# Create feature branch with descriptive name
git checkout -b feature/TMOPS-124-load-filtering
# or
git checkout -b enhancement/TMOPS-125-driver-search-improvements
```

### 2. Daily Development Workflow
```bash
# Make regular commits with meaningful messages
git add .
git commit -m "feat(loads): add date range filter component"

# Push to remote regularly to backup your work
git push origin feature/TMOPS-124-load-filtering

# If working for multiple days, sync with master occasionally
git checkout master
git pull origin master
git checkout feature/TMOPS-124-load-filtering
git rebase master  # This keeps your feature branch up to date
```

### 3. Completing a Feature
```bash
# Before merging, ensure your feature is up to date
git checkout master
git pull origin master
git checkout feature/TMOPS-124-load-filtering
git rebase master

# Test everything works correctly
npm run build
npm run dev  # Test manually

# Merge feature into master
git checkout master
git merge feature/TMOPS-124-load-filtering

# Push updated master
git push origin master

# Clean up: delete the feature branch
git branch -d feature/TMOPS-124-load-filtering
git push origin --delete feature/TMOPS-124-load-filtering
```

### 4. Quick Updates (Small Changes)
```bash
# For small changes, work directly on master
git checkout master
git pull origin master

# Make your changes
git add .
git commit -m "fix(drivers): correct phone number formatting"
git push origin master
```
## Using GitHub CLI for Efficiency

### Quick Repository Tasks
```bash
# Check repository status
gh repo view

# Create a new feature branch and push it
git checkout -b feature/new-awesome-feature
git push -u origin feature/new-awesome-feature

# View recent commits
gh repo view --web  # Opens repository in browser
```

## Commit Message Convention

Use clear, descriptive commit messages that follow this pattern:

### Format
```
<type>(<scope>): <description>

[optional body explaining the change]
```

### Types
- **feat**: New feature or functionality
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code formatting, no logic changes
- **refactor**: Code refactoring without changing functionality
- **test**: Adding or updating tests
- **chore**: Maintenance tasks, dependency updates

### Examples
```bash
git commit -m "feat(drivers): add search functionality to driver list"
git commit -m "fix(loads): resolve date formatting issue in load cards"
git commit -m "docs(readme): update installation instructions"
git commit -m "style(navigation): improve mobile navigation spacing"
git commit -m "refactor(components): extract common card component logic"
git commit -m "chore(deps): update Next.js to version 15.1"
```

## Best Practices for TMOps Development

### Do's ✅
- **Keep commits focused**: One logical change per commit
- **Test before committing**: Always run `npm run build` to check for errors
- **Write descriptive messages**: Future you will thank present you
- **Sync regularly**: Pull latest changes frequently to avoid conflicts
- **Use meaningful branch names**: `feature/driver-search` not `feature/stuff`
- **Clean up branches**: Delete merged branches to keep repository tidy

### Don'ts ❌
- **Don't commit broken code**: Always test your changes first
- **Don't commit secrets**: Never commit API keys, passwords, or sensitive data
- **Don't create massive commits**: Break large changes into smaller, logical commits
- **Don't ignore warnings**: Fix TypeScript errors and linting warnings
- **Don't leave branches hanging**: Complete or delete abandoned feature branches

## Common Git Commands for TMOps

### Daily Workflow
```bash
# Start your day
git status                          # Check current state
git pull origin master             # Get latest changes
git checkout -b feature/my-feature # Start new feature

# During development
git add .                          # Stage changes
git commit -m "feat: add new feature" # Commit changes
git push origin feature/my-feature # Backup to GitHub

# End of feature
git checkout master               # Switch to master
git merge feature/my-feature     # Merge your feature
git push origin master          # Update GitHub
git branch -d feature/my-feature # Clean up
```

### Troubleshooting
```bash
# If you made changes to wrong branch
git stash                    # Save changes temporarily
git checkout correct-branch  # Switch to right branch
git stash pop               # Apply saved changes

# If you need to undo last commit (but keep changes)
git reset --soft HEAD~1

# If you need to see what changed
git diff                    # See unstaged changes
git diff --staged          # See staged changes
git log --oneline -10      # See recent commits
```

## Project-Specific Notes

### Current Features Completed
- ✅ Mobile-first responsive layout
- ✅ Driver management with 23 drivers (20 active, 2 in training, 1 OOS)
- ✅ Truck management with numbering system (2812-2856A)
- ✅ Load management with tabbed interface
- ✅ Settings page structure
- ✅ Unified UI components with proper icons

### Next Features to Implement
When working on new features, consider these areas:
- **Driver Details**: Individual driver profile pages
- **Load Details**: Detailed load information and tracking
- **Truck Maintenance**: Maintenance scheduling and history
- **Reports**: Analytics and reporting dashboard
- **Real-time Updates**: Live status updates
- **Mobile PWA**: Progressive Web App capabilities

### Branch Naming for Future Features
```bash
# New features
feature/TMOPS-200-driver-profiles
feature/TMOPS-201-load-tracking
feature/TMOPS-202-maintenance-alerts

# Enhancements
enhancement/TMOPS-210-improve-search
enhancement/TMOPS-211-better-mobile-nav

# Bug fixes
bugfix/TMOPS-220-fix-date-display
bugfix/TMOPS-221-resolve-loading-spinner
```
