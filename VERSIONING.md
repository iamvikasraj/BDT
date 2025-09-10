# Versioning Guide for BDT (Blood Diagnosis Tool)

## Overview
This project uses semantic versioning (SemVer) with Git tags for tracking releases and maintaining different versions of the application.

## Version Format
We follow [Semantic Versioning](https://semver.org/) format: `MAJOR.MINOR.PATCH`

- **MAJOR**: Breaking changes that are not backward compatible
- **MINOR**: New features that are backward compatible
- **PATCH**: Bug fixes that are backward compatible

## Current Version
The current version is stored in the `VERSION` file and displayed in the application sidebar.

## Version Management Tools

### 1. Version Manager Script
Use the `version_manager.py` script for automated version management:

```bash
# Check current version
python version_manager.py current

# Bump version (patch, minor, or major)
python version_manager.py bump patch    # 1.0.0 → 1.0.1
python version_manager.py bump minor    # 1.0.0 → 1.1.0
python version_manager.py bump major    # 1.0.0 → 2.0.0

# Create Git tag for current version
python version_manager.py tag "Release v1.0.0"

# Bump version and create tag in one command
python version_manager.py release patch

# Push changes and tags to remote
python version_manager.py push
```

### 2. Manual Git Commands
For manual version management:

```bash
# Create a new version tag
git tag -a v1.0.0 -m "Release version 1.0.0"

# Push tags to remote
git push origin --tags

# List all tags
git tag -l

# Checkout a specific version
git checkout v1.0.0
```

## Workflow for New Versions

### 1. Development Workflow
```bash
# Make your changes
git add .
git commit -m "Add new feature: user authentication"

# When ready for a new version
python version_manager.py release minor
python version_manager.py push
```

### 2. Hotfix Workflow
```bash
# Fix critical bug
git add .
git commit -m "Fix critical bug in data processing"

# Create patch version
python version_manager.py release patch
python version_manager.py push
```

### 3. Major Release Workflow
```bash
# Make breaking changes
git add .
git commit -m "BREAKING: Redesign API interface"

# Create major version
python version_manager.py release major
python version_manager.py push
```

## Branching Strategy

### Main Branches
- **main**: Production-ready code
- **develop**: Integration branch for features

### Feature Branches
- **feature/feature-name**: New features
- **hotfix/bug-description**: Critical bug fixes

### Example Workflow
```bash
# Create feature branch
git checkout -b feature/user-dashboard
# ... make changes ...
git add .
git commit -m "Add user dashboard feature"
git push origin feature/user-dashboard

# Merge to develop
git checkout develop
git merge feature/user-dashboard

# When ready for release
git checkout main
git merge develop
python version_manager.py release minor
```

## Version History Tracking

### View Version History
```bash
# See all commits with tags
git log --oneline --decorate

# See specific version
git show v1.0.0

# Compare versions
git diff v1.0.0..v1.1.0
```

### Rollback to Previous Version
```bash
# Rollback to specific version
git checkout v1.0.0

# Create new branch from old version
git checkout -b hotfix/rollback v1.0.0
```

## Best Practices

### 1. Version Naming
- Always use `v` prefix for Git tags (e.g., `v1.0.0`)
- Update `VERSION` file before creating tags
- Use descriptive commit messages

### 2. Release Notes
Create release notes for each version:
```bash
# Create release notes
echo "## Version 1.1.0
- Added user authentication
- Improved mobile responsiveness
- Fixed data processing bug" > RELEASE_NOTES.md
```

### 3. Testing Before Release
```bash
# Test the application
streamlit run app.py

# Run any tests
python -m pytest tests/

# Check for linting issues
python -m flake8 app.py
```

## File Structure
```
BDT/
├── VERSION              # Current version number
├── version_manager.py   # Version management script
├── .gitignore          # Git ignore rules
├── VERSIONING.md       # This documentation
└── app.py              # Main application (includes version display)
```

## Integration with CI/CD
For automated deployments, you can use Git tags to trigger builds:

```yaml
# Example GitHub Actions workflow
on:
  push:
    tags:
      - 'v*'
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: |
          echo "Deploying version ${{ github.ref_name }}"
```

## Troubleshooting

### Common Issues
1. **Tag already exists**: Delete the tag and recreate
   ```bash
   git tag -d v1.0.0
   git push origin :refs/tags/v1.0.0
   ```

2. **Version file not updated**: Manually edit `VERSION` file
   ```bash
   echo "1.0.1" > VERSION
   ```

3. **Merge conflicts**: Resolve conflicts and recommit
   ```bash
   git add .
   git commit -m "Resolve merge conflicts"
   ```

## Next Steps
1. Create your first version tag: `python version_manager.py release patch`
2. Set up automated testing
3. Configure CI/CD pipeline
4. Document your release process
