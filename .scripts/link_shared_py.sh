#!/bin/bash

# Get the current directory
current_dir=$(pwd)

# Find the git root directory
git_root=$(git rev-parse --show-toplevel)

# Function to create symbolic links
create_links() {
    local dir=$1
    find "$dir" -type d -name "_shared" | while read -r shared_dir; do
        find "$shared_dir" -type f | while read -r file; do
            relative_path="${file#$shared_dir/}"
            target_dir="$current_dir/$(dirname "$relative_path")"
            mkdir -p "$target_dir"
            ln -sf "$file" "$target_dir/$(basename "$file")"
        done
    done
}

# Start from the current directory and go up to the git root
dir=$current_dir
while [ "$dir" != "$git_root" ]; do
    create_links "$dir"
    dir=$(dirname "$dir")
done

# Also check the git root directory
create_links "$git_root"