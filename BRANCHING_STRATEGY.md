# Branching Strategy for BDT Project

## 🌿 **Branch Structure**

### Main Branches
- **`main`** - Production-ready code, stable releases
- **`develop`** - Integration branch for features, current development

### Feature Branches
- **`feature/feature-name`** - New features (e.g., `feature/advanced-charts`)
- **`hotfix/bug-description`** - Critical bug fixes (e.g., `hotfix/login-error`)
- **`release/version-number`** - Release preparation (e.g., `release/v0.2.0`)

## 🚀 **Current Branch Status**

**Active Branch:** `develop` ✅
**Purpose:** Development and feature integration
**Base:** `main` (v0.1.0)

## 📋 **Branch Workflow**

### 1. **Starting New Features**
```bash
# Make sure you're on develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Work on your feature...
git add .
git commit -m "Add your feature"

# Push feature branch
git push origin feature/your-feature-name
```

### 2. **Merging Features**
```bash
# Switch to develop
git checkout develop

# Merge feature
git merge feature/your-feature-name

# Delete local feature branch
git branch -d feature/your-feature-name

# Delete remote feature branch
git push origin --delete feature/your-feature-name
```

### 3. **Creating Releases**
```bash
# Create release branch from develop
git checkout -b release/v0.2.0

# Make final adjustments, update version
# ... make changes ...

# Merge to main
git checkout main
git merge release/v0.2.0

# Create version tag
git tag -a v0.2.0 -m "Release version 0.2.0"
git push origin v0.2.0

# Merge back to develop
git checkout develop
git merge main
```

### 4. **Hotfixes**
```bash
# Create hotfix from main
git checkout main
git checkout -b hotfix/critical-bug

# Fix the bug
# ... make changes ...

# Merge to main and develop
git checkout main
git merge hotfix/critical-bug
git checkout develop
git merge hotfix/critical-bug
```

## 🎯 **Branch Naming Conventions**

### Feature Branches
- `feature/user-authentication`
- `feature/advanced-analytics`
- `feature/mobile-optimization`

### Hotfix Branches
- `hotfix/login-error`
- `hotfix/data-export-bug`
- `hotfix/security-patch`

### Release Branches
- `release/v0.2.0`
- `release/v0.3.0`
- `release/v1.0.0`

## 🔄 **Version Management with Branches**

### Development Workflow
1. **Start on `develop`** - Always start new work from develop
2. **Create feature branch** - `git checkout -b feature/your-feature`
3. **Develop feature** - Make commits on feature branch
4. **Test feature** - Ensure everything works
5. **Merge to develop** - `git checkout develop && git merge feature/your-feature`
6. **Create version** - When ready, create release branch and version

### Version Creation Process
```bash
# 1. Ensure develop is stable
git checkout develop
git pull origin develop

# 2. Create release branch
git checkout -b release/v0.2.0

# 3. Update version
echo "0.2.0" > VERSION
git add VERSION
git commit -m "Bump version to 0.2.0"

# 4. Merge to main
git checkout main
git merge release/v0.2.0

# 5. Create tag
git tag -a v0.2.0 -m "Release version 0.2.0"

# 6. Push everything
git push origin main
git push origin v0.2.0

# 7. Merge back to develop
git checkout develop
git merge main
git push origin develop
```

## 🛠️ **Useful Branch Commands**

```bash
# List all branches
git branch -a

# Switch branches
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# See branch relationships
git log --oneline --graph --all

# Compare branches
git diff main..develop

# See what's in a branch
git log develop --oneline -5
```

## 📊 **Current Project Status**

**Main Branch:** `main` (v0.1.0) - Stable release
**Development Branch:** `develop` - Current development
**Next Version:** v0.2.0 (planned)

## 🎯 **Next Steps**

1. **Work on `develop`** for new features
2. **Create feature branches** for specific features
3. **Merge features** back to develop when ready
4. **Create releases** from develop when stable
5. **Keep main stable** for production use

## ⚠️ **Best Practices**

- ✅ Always pull latest changes before starting work
- ✅ Use descriptive commit messages
- ✅ Test features before merging
- ✅ Keep feature branches small and focused
- ✅ Delete merged feature branches
- ✅ Never work directly on main (except hotfixes)
- ✅ Always merge back to develop after releases
