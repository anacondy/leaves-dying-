# 🎵 Music & Visual Experience Website

🌐 **Live Demo:** [https://anacondy.github.io/leaves-dying-/](https://anacondy.github.io/leaves-dying-/)

👥 **Authors:** Puppy Pilot & anacondy | *Inspired by the movie Munich (Eric Bana)*

---

A modern, interactive web application that combines YouTube music streaming, image slideshows, and animation. Perfect for creating immersive audio-visual experiences.

## 📸 Screenshots

### Main Interface - YouTube Music Tab
![Homepage Screenshot](https://github.com/user-attachments/assets/2fb0af56-9cdf-48d4-82b4-4ce54bbcb60a)

### Pinterest Integration Tab
![Pinterest Tab Screenshot](https://github.com/user-attachments/assets/0f5bdf85-381e-4617-864c-ce9fd94df6ae)

### Local Upload Tab
![Upload Tab Screenshot](https://github.com/user-attachments/assets/6a1c017d-b756-47d9-b646-3c663ba0a57d)

## Features

✨ **Core Features**
- 🎧 YouTube Music Integration - Play playlists and videos as audio
- 🖼️ Background Image Slideshow - Beautiful fade transitions with music sync
- 📝 Vertical Text Animation - Auto-scrolling menu text
- 🎨 Pinterest Integration - Load images directly from Pinterest boards
- 📤 Local File Upload - Use your own images with drag-and-drop support
- 🎛️ Custom Controls - Volume, speed, play/pause, next/previous
- 🔔 Toast Notifications - Real-time feedback system
- 📱 Fully Responsive - Works on desktop, tablet, and mobile

## Project Structure

```
project/
├── index.html                  # Main HTML file
├── css/
│   ├── main.css               # Primary styles
│   └── animations.css         # Animation keyframes
├── js/
│   ├── main.js                # Application bootstrap
│   ├── utils/
│   │   ├── constants.js       # Configuration & constants
│   │   └── helpers.js         # Utility functions
│   └── modules/
│       ├── audioPlayer.js     # YouTube player wrapper
│       ├── slideshow.js       # Background slideshow manager
│       ├── textScroller.js    # Vertical text animation
│       ├── fileUploader.js    # Local file upload handler
│       ├── pinterestAPI.js    # Pinterest API integration
│       ├── uiController.js    # UI event management
│       └── notificationSystem.js  # Toast notifications
├── README.md                   # This file
└── package.json (optional)     # Node.js dependencies
```

## Quick Start

### 1. Basic Setup

1. Create a folder structure as shown above
2. Copy all files to their respective directories
3. Open `index.html` in a web browser

That's it! The app will load with default nature images.

### 2. Configure Default Settings

Edit `js/utils/constants.js`:

```javascript
const CONFIG = {
    DEFAULT_IMAGES: [
        'your-image-url-1.jpg',
        'your-image-url-2.jpg',
        // Add more image URLs
    ],
    SLIDESHOW: {
        DEFAULT_INTERVAL: 8000,  // 8 seconds
    }
};
```

### 3. Add YouTube Playlist

1. Find a YouTube playlist ID (last parameter in playlist URL)
2. Paste it in the "YouTube Music" tab
3. Click "Load Playlist"

Example: For URL `youtube.com/playlist?list=PLxxxxx`, the ID is `PLxxxxx`

### 4. Add Pinterest Integration (Optional)

1. Go to https://developers.pinterest.com
2. Create an app and get your access token
3. Get a board ID from Pinterest
4. Paste both in the "Pinterest" tab
5. Click "My Boards" to find boards, then select one
6. Click "Load Images"

### 5. Upload Local Images

- Use the "Local Upload" tab
- Click the upload area or drag & drop images
- Supports: JPG, PNG, GIF, WebP

## Configuration Guide

### Colors & Styling

In `css/main.css`, modify the `:root` CSS variables:

```css
:root {
    --primary-bg: #8b9d5c;           /* Background color */
    --primary-light: #a8b570;        /* Lighter variant */
    --text-light: rgba(255, 255, 255, 0.9);  /* Text color */
    --accent-color: #ffffff;         /* Accent color */
}
```

### Slideshow Timing

In `js/utils/constants.js`:

```javascript
SLIDESHOW: {
    DEFAULT_INTERVAL: 8000,   // 8 seconds between images
    MIN_INTERVAL: 3000,       // Minimum 3 seconds
    MAX_INTERVAL: 20000,      // Maximum 20 seconds
    FADE_DURATION: 2000       // Fade transition time
}
```

### Volume & Speed Controls

- **Volume**: Range from 0-100%
- **Image Speed**: Range from 3-20 seconds
- Both sync automatically with the player

## API Integration Details

### YouTube IFrame API

The app uses YouTube's free IFrame API. No authentication required for public videos/playlists.

```javascript
// Load a playlist
player.loadPlaylist('PLxxxxx');

// Control playback
player.play();
player.pause();
player.setVolume(70);
```

### Pinterest API v5

**Requirements:**
- Developer account at https://developers.pinterest.com
- OAuth access token
- Scopes: `boards:read`, `pins:read`

**Rate Limits:**
- ~1000 requests per hour per user
- Built-in rate limiting to prevent exceeding quota

### File Upload

Supports drag-and-drop and file input. Max 50 files, 5MB each.

Allowed formats: JPEG, PNG, GIF, WebP

## Security Features

✅ **Implemented Security Measures**
- Content Security Policy (CSP) headers
- XSS protection via HTML sanitization
- CORS configuration
- API key protection (server-side storage)
- Input validation for all forms
- Rate limiting for API calls
- File type & size validation

⚠️ **Important Security Notes**
- Never store API keys in frontend code
- For production, use a backend proxy for Pinterest API
- Always validate user inputs
- Keep dependencies updated

## Troubleshooting

### Images Not Loading
- Check image URLs are public and accessible
- Verify CORS headers are correct
- Check browser console for errors

### YouTube Playlist Not Playing
- Verify playlist ID is correct
- Ensure playlist is public
- Check playlist has videos

### Pinterest Not Working
- Confirm access token is valid
- Check board ID is correct
- Verify you have permission to access the board
- Check rate limit hasn't been exceeded

### Performance Issues
- Reduce number of images
- Optimize image file sizes
- Close other browser tabs
- Use Chrome DevTools Performance tab for profiling

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
⚠️ Internet Explorer - Not supported

## Performance Optimization

The site is optimized for performance:
- Image lazy loading
- CSS animations (GPU accelerated)
- Debounced event handlers
- Efficient DOM manipulation
- Minimal external dependencies

## Customization Examples

### Change Colors to Dark Theme

```css
:root {
    --primary-bg: #1a1a1a;
    --text-light: rgba(255, 255, 255, 0.95);
    --accent-color: #00d4ff;
}
```

### Auto-Load Images on Startup

In `main.js`:

```javascript
async init() {
    // ... existing code ...
    
    // Auto-load images
    const customImages = [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg'
    ];
    this.components.slideshow.updateImages(customImages);
}
```

### Change Slideshow Interval

In HTML, the interval slider ranges from 3-20 seconds. To change default:

```html
<input type="range" id="interval-slider" class="control-slider" 
       min="3" max="20" value="12" title="Slideshow Speed">
```

## Development

### Local Testing

Use a local server (Python, Node.js, or Live Server):

```bash
# Python 3
python -m http.server 8000

# Node.js (if installed)
npx http-server

# Or use VS Code Live Server extension
```

### Browser DevTools

Open DevTools (F12) to:
- Monitor API calls (Network tab)
- Check for errors (Console tab)
- Debug JavaScript (Sources tab)
- Profile performance (Performance tab)

### Console Commands

The app exposes a global variable for debugging:

```javascript
// In browser console:
app.components.slideshow.next();
app.components.player.setVolume(50);
app.getComponent('notifications').info('Test message');
```

## File Size & Load Times

Expected performance:
- Initial load: < 2 seconds
- Images: Loaded on-demand
- CSS: ~50KB minified
- JavaScript: ~80KB minified
- Total: ~200KB+ (plus images)

## License

This project is free to use and modify for personal and commercial purposes.

## Credits

- YouTube IFrame API by Google
- Pinterest API v5
- Icons from system fonts
- Fonts from Google Fonts (Poppins)
- Background images from Unsplash

## Support

For issues or feature requests:
1. Check the Troubleshooting section
2. Review the Configuration Guide
3. Check browser console for errors
4. Verify all API credentials are correct

---

**Made with ❤️ for immersive audio-visual experiences**

Version: 1.0.0
Last Updated: November 2025