import os
from PIL import Image

# Configuration
ASSET_DIR = 'mobile/assets'
QUALITY = 80 # Adjust quality (0-100)

def compress_images():
    print(f"🚀 Starting image compression in {ASSET_DIR}...")
    
    if not os.path.exists(ASSET_DIR):
        print(f"❌ Error: Directory '{ASSET_DIR}' not found.")
        return

    # Get all files
    files = [f for f in os.listdir(ASSET_DIR) if os.path.isfile(os.path.join(ASSET_DIR, f))]
    
    total_saved = 0
    count = 0

    for filename in files:
        if filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            filepath = os.path.join(ASSET_DIR, filename)
            filename_no_ext = os.path.splitext(filename)[0]
            output_path = os.path.join(ASSET_DIR, f"{filename_no_ext}.webp")

            try:
                # Open image
                with Image.open(filepath) as img:
                    # Get original size
                    original_size = os.path.getsize(filepath)
                    
                    # Convert to RGB (if RGBA, handle partial transparency correctly later if needed, but for WebP it's fine)
                    # WebP supports alpha, so we keep RGBA if present.
                    # But for JPG conversion we'd need RGB. WebP handles both.
                    
                    # Save as WebP
                    img.save(output_path, 'WEBP', quality=QUALITY)
                    
                    # Get new size
                    new_size = os.path.getsize(output_path)
                    
                    saved = original_size - new_size
                    total_saved += saved
                    count += 1
                    
                    print(f"✅ Converted: {filename} ({original_size/1024:.1f}KB) -> {output_path} ({new_size/1024:.1f}KB) | Saved: {saved/1024:.1f}KB")
            
            except Exception as e:
                print(f"❌ Failed to convert {filename}: {e}")

    print(f"\n✨ Compression Complete!")
    print(f"Converted {count} images.")
    print(f"Total Disk Space Saved: {total_saved / (1024*1024):.2f} MB")

if __name__ == "__main__":
    compress_images()
