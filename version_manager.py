#!/usr/bin/env python3
"""
Version Manager for BDT Project
Handles version bumping and Git tagging
"""

import os
import sys
import subprocess
from pathlib import Path

def get_current_version():
    """Get current version from VERSION file"""
    version_file = Path("VERSION")
    if version_file.exists():
        return version_file.read_text().strip()
    return "0.0.0"

def update_version(new_version):
    """Update version in VERSION file"""
    version_file = Path("VERSION")
    version_file.write_text(f"{new_version}\n")
    print(f"Updated version to {new_version}")

def bump_version(version_type="patch"):
    """Bump version based on type (major, minor, patch)"""
    current = get_current_version()
    parts = current.split(".")
    major, minor, patch = int(parts[0]), int(parts[1]), int(parts[2])
    
    if version_type == "major":
        major += 1
        minor = 0
        patch = 0
    elif version_type == "minor":
        minor += 1
        patch = 0
    elif version_type == "patch":
        patch += 1
    else:
        raise ValueError("Version type must be 'major', 'minor', or 'patch'")
    
    new_version = f"{major}.{minor}.{patch}"
    update_version(new_version)
    return new_version

def create_git_tag(version, message=None):
    """Create Git tag for version"""
    if message is None:
        message = f"Version {version}"
    
    try:
        subprocess.run(["git", "add", "VERSION"], check=True)
        subprocess.run(["git", "commit", "-m", f"Bump version to {version}"], check=True)
        subprocess.run(["git", "tag", "-a", f"v{version}", "-m", message], check=True)
        print(f"Created tag v{version}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error creating tag: {e}")
        return False

def push_changes():
    """Push changes and tags to remote"""
    try:
        subprocess.run(["git", "push"], check=True)
        subprocess.run(["git", "push", "--tags"], check=True)
        print("Pushed changes and tags to remote")
        return True
    except subprocess.CalledProcessError as e:
        print(f"Error pushing changes: {e}")
        return False

def main():
    if len(sys.argv) < 2:
        print("Usage: python version_manager.py <command> [options]")
        print("Commands:")
        print("  current          - Show current version")
        print("  bump <type>      - Bump version (major/minor/patch)")
        print("  tag [message]    - Create Git tag for current version")
        print("  release <type>   - Bump version and create tag")
        print("  push             - Push changes and tags to remote")
        return
    
    command = sys.argv[1]
    
    if command == "current":
        print(f"Current version: {get_current_version()}")
    
    elif command == "bump":
        if len(sys.argv) < 3:
            print("Usage: python version_manager.py bump <major|minor|patch>")
            return
        version_type = sys.argv[2]
        new_version = bump_version(version_type)
        print(f"Version bumped to {new_version}")
    
    elif command == "tag":
        version = get_current_version()
        message = sys.argv[2] if len(sys.argv) > 2 else None
        create_git_tag(version, message)
    
    elif command == "release":
        if len(sys.argv) < 3:
            print("Usage: python version_manager.py release <major|minor|patch>")
            return
        version_type = sys.argv[2]
        new_version = bump_version(version_type)
        create_git_tag(new_version)
    
    elif command == "push":
        push_changes()
    
    else:
        print(f"Unknown command: {command}")

if __name__ == "__main__":
    main()
