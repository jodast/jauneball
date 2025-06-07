#!/bin/bash

# Create optimized directories
mkdir -p images/optimized

# Function to optimize an image
optimize_image() {
    local src=$1
    local filename=$(basename -- "$src")
    local name="${filename%.*}"
    local ext="${filename##*.}"
    
    # Skip if already optimized
    if [[ $filename == *"-optimized"* ]]; then
        return
    fi
    
    echo "Optimizing: $filename"
    
    # For JPG/JPEG
    if [[ "$ext" =~ ^(jpg|jpeg|JPG|JPEG)$ ]]; then
        # Create optimized JPG (85% quality, progressive)
        convert "$src" -resize "1920x1080>" -sampling-factor 4:2:0 -strip -quality 85 -interlace Plane -gaussian-blur 0.05 -colorspace sRGB "images/optimized/${name}-optimized.jpg"
        
        # Create WebP version (80% quality)
        cwebp -q 80 "$src" -o "images/optimized/${name}.webp"
        
    # For PNG
    elif [[ "$ext" =~ ^(png|PNG)$ ]]; then
        # Create optimized PNG
        pngquant --quality=65-80 --strip --skip-if-larger --output "images/optimized/${name}-optimized.png" -- "$src"
        
        # Create WebP version
        cwebp -q 80 "$src" -o "images/optimized/${name}.webp"
    fi
}

# Process all images
export -f optimize_image
find images/ -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" \) -exec bash -c 'optimize_image "$0"' {} \;

echo "Optimization complete! Check the 'images/optimized' directory for optimized versions."
