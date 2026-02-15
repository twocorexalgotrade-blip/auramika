#!/bin/bash
# High-Quality Video Compression Script for Auramika
# Reduces file size by ~60% while maintaining visual quality

echo "🎬 Starting HIGH-QUALITY video compression..."
echo "This will maintain visual quality while reducing file size"

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg not found."
    echo "Please install: brew install ffmpeg"
    exit 1
fi

# Create backup directory
mkdir -p "web asset/originals"

# Compress each video with HIGH QUALITY settings
find "web asset" -maxdepth 1 -name "*.mp4" | while read video; do
    filename=$(basename "$video")
    echo "Compressing: $filename"
    
    # Backup original
    if [ ! -f "web asset/originals/$filename" ]; then
        cp "$video" "web asset/originals/$filename"
    fi
    
    # Compress with H.264, HIGH QUALITY settings
    # CRF 18 = visually lossless (lower = better quality)
    # preset slow = better compression
    # No audio (jewelry videos don't need it)
    ffmpeg -i "$video" \
        -vcodec libx264 \
        -crf 18 \
        -preset slow \
        -movflags +faststart \
        -an \
        "$video.tmp.mp4" \
        -y -loglevel error
    
    # Get file sizes
    original_size=$(stat -f%z "web asset/originals/$filename")
    new_size=$(stat -f%z "$video.tmp.mp4")
    reduction=$((100 - (new_size * 100 / original_size)))
    
    # Replace original with compressed
    mv "$video.tmp.mp4" "$video"
    
    echo "✅ $filename - Reduced by ${reduction}% (quality preserved)"
done

echo ""
echo "🎉 Compression complete!"
echo "📊 Original videos backed up to: web asset/originals/"
echo ""
echo "File sizes:"
echo "Before:"
du -sh "web asset/originals" 2>/dev/null || echo "N/A"
echo "After:"
du -sh "web asset"/*.mp4 | head -5
