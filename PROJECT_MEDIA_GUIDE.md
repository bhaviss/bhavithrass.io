# 📸 Project Media Guide

## How to Add Images and Videos to Your Projects

### 🗂️ Folder Structure

Create this folder structure in your portfolio directory:

```
portfolio/
├── images/
│   └── projects/
│       ├── space-debris.jpg
│       ├── geo-qr-demo.mp4
│       ├── geo-qr-thumb.jpg
│       ├── snow-detection.jpg
│       └── ... (other project media)
```

### 📷 Adding Images

**Step 1:** Place your images in `images/projects/` folder

**Step 2:** In `index.html`, replace the placeholder with your image:

```html
<!-- Replace this: -->
<div class="media-placeholder" data-media-type="image">
    <i class="fas fa-image"></i>
    <span>Add Project Screenshot</span>
</div>

<!-- With this: -->
<img src="images/projects/your-image.jpg" alt="Project Name">
```

**Recommended Image Specs:**
- Format: JPG or PNG
- Resolution: 1920x1080 or 1280x720
- Aspect Ratio: 16:9
- File Size: Under 2MB for faster loading
- Optimize images using tools like TinyPNG or ImageOptim

### 🎥 Adding Videos

**Step 1:** Place your videos in `images/projects/` folder

**Step 2:** In `index.html`, replace the placeholder with your video:

```html
<!-- Replace this: -->
<div class="media-placeholder" data-media-type="video">
    <i class="fas fa-video"></i>
    <span>Add Project Demo Video</span>
</div>

<!-- With this: -->
<video controls poster="images/projects/video-thumbnail.jpg">
    <source src="images/projects/your-video.mp4" type="video/mp4">
</video>
```

**Recommended Video Specs:**
- Format: MP4 (H.264 codec)
- Resolution: 1920x1080 or 1280x720
- Duration: 30 seconds - 2 minutes (shorter is better)
- File Size: Under 10MB
- Frame Rate: 30fps
- Add a thumbnail poster image for better UX

### 🎨 Multiple Images (Gallery View)

To add multiple images for a project:

```html
<div class="project-media gallery">
    <img src="images/projects/screenshot1.jpg" alt="Feature 1">
    <img src="images/projects/screenshot2.jpg" alt="Feature 2">
    <img src="images/projects/screenshot3.jpg" alt="Feature 3">
</div>
```

### ⚡ Features You Get

1. **Lightbox Modal** - Click any image/video to view fullscreen
2. **Video Controls** - Play, pause, volume, fullscreen
3. **Smooth Animations** - Hover effects and transitions
4. **Responsive** - Works perfectly on all devices
5. **Keyboard Support** - Press ESC to close lightbox

### 🎯 Best Practices

**For Images:**
- Show your project in action
- Use screenshots of the UI/dashboard
- Include before/after comparisons
- Show key features or results
- Use high-quality, clear images

**For Videos:**
- Keep it short and focused (30-90 seconds)
- Show the most impressive features
- Add captions if needed
- Ensure good audio quality
- Start with the most engaging part
- Use screen recording tools like OBS Studio, Loom, or QuickTime

### 🛠️ Video Creation Tips

1. **Screen Recording:** Use OBS Studio (free) or Loom
2. **Editing:** Use DaVinci Resolve (free) or Adobe Premiere
3. **Compression:** Use HandBrake to reduce file size
4. **Format:** Export as MP4 with H.264 codec
5. **Thumbnail:** Take a screenshot of the best frame

### 📱 Example Implementation

Here's a complete example for the Geo QR Attendance project:

```html
<div class="project-card">
    <div class="project-header">
        <i class="fas fa-qrcode project-icon"></i>
    </div>
    
    <!-- Video with thumbnail -->
    <div class="project-media">
        <video controls poster="images/projects/geo-qr-thumb.jpg" data-caption="QR Attendance System Demo">
            <source src="images/projects/geo-qr-demo.mp4" type="video/mp4">
        </video>
    </div>
    
    <h3>Geo QR Attendance System</h3>
    <!-- Rest of the project details -->
</div>
```

### 🎬 Where to Host Large Videos

If your videos are too large:
1. Upload to YouTube (set as unlisted)
2. Use the embed code instead
3. Or use cloud storage (Google Drive, Dropbox) with direct links

### Need Help?

- Optimize images: https://tinypng.com
- Convert video: https://handbrake.fr
- Record screen: https://obsproject.com
- Edit video: https://www.blackmagicdesign.com/products/davinciresolve

Happy showcasing! 🚀
