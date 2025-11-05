# 📋 SETUP & DEPLOYMENT GUIDE

## Directory Structure Setup

Create this exact folder structure on your computer:

```
music-visual-experience/
│
├── index.html
├── README.md
├── SETUP.md (this file)
│
├── css/
│   ├── main.css
│   └── animations.css
│
└── js/
    ├── main.js
    ├── utils/
    │   ├── constants.js
    │   └── helpers.js
    └── modules/
        ├── audioPlayer.js
        ├── slideshow.js
        ├── textScroller.js
        ├── fileUploader.js
        ├── pinterestAPI.js
        ├── uiController.js
        └── notificationSystem.js
```

## Step-by-Step Setup Instructions

### Step 1: Create Folders

Create the following directories in your project root:
- `css`
- `js`
- `js/utils`
- `js/modules`

### Step 2: Copy HTML Files

1. **index.html** → Place in project root

### Step 3: Copy CSS Files

1. **main.css** → Place in `css/` folder
2. **animations.css** → Place in `css/` folder

### Step 4: Copy JavaScript Files

**Utility Files** (in `js/utils/`):
- constants.js
- helpers.js

**Module Files** (in `js/modules/`):
- audioPlayer.js
- slideshow.js
- textScroller.js
- fileUploader.js
- pinterestAPI.js
- uiController.js
- notificationSystem.js

**Main Files** (in `js/`):
- main.js

### Step 5: Copy Documentation

1. **README.md** → Place in project root
2. **SETUP.md** → Place in project root

---

## Running Locally

### Option 1: Using Python (Easiest)

**Windows:**
```bash
cd path/to/music-visual-experience
python -m http.server 8000
```

Then open: `http://localhost:8000`

**Mac/Linux:**
```bash
cd path/to/music-visual-experience
python3 -m http.server 8000
```

### Option 2: Using Node.js

```bash
cd path/to/music-visual-experience
npx http-server
```

### Option 3: Using Live Server (VS Code)

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 4: Using PHP

```bash
cd path/to/music-visual-experience
php -S localhost:8000
```

---

## Configuration

### 1. Configure Default Images

Edit `js/utils/constants.js`:

```javascript
DEFAULT_IMAGES: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
    'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=1920&q=80',
    // Add your image URLs here
]
```

**Find free images on:**
- Unsplash (unsplash.com)
- Pexels (pexels.com)
- Pixabay (pixabay.com)
- Pixelsquid (pixelsquid.com)

### 2. Set YouTube Playlist

Edit `js/utils/constants.js`:

```javascript
YOUTUBE: {
    DEFAULT_PLAYLIST: 'PLxxxxx'  // Replace with your playlist ID
}
```

**How to get playlist ID:**
1. Go to YouTube.com
2. Create or find a public playlist
3. Open the playlist
4. Copy the `list=` parameter from the URL

### 3. Configure Colors

Edit `css/main.css`:

```css
:root {
    --primary-bg: #8b9d5c;              /* Main background */
    --primary-light: #a8b570;           /* Light variant */
    --primary-dark: #6b7d3c;            /* Dark variant */
    --text-light: rgba(255, 255, 255, 0.9);  /* Main text */
    --text-muted: rgba(255, 255, 255, 0.6); /* Secondary text */
}
```

---

## Deployment Options

### Option 1: Netlify (Recommended - Free)

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "New site from Git"
4. Connect your GitHub repository
5. Deploy (automatic on each push)

### Option 2: Vercel (Free)

1. Go to https://vercel.com
2. Sign up with GitHub
3. Import your project
4. Deploy with one click

### Option 3: GitHub Pages (Free)

1. Push your code to GitHub
2. Go to repository Settings
3. Navigate to "Pages" section
4. Select main branch
5. Site will be available at `username.github.io/repo-name`

### Option 4: Traditional Hosting

Use any web hosting service:
- Bluehost
- HostGator
- SiteGround
- AWS S3
- Google Cloud Storage

Simply upload all files via FTP.

---

## Testing Checklist

Before deploying, test:

- [ ] Images load correctly
- [ ] YouTube player works
- [ ] Play/Pause buttons function
- [ ] Volume slider works
- [ ] Speed slider adjusts slideshow
- [ ] Next/Previous buttons navigate images
- [ ] Local file upload works
- [ ] Drag & drop upload works
- [ ] Responsive on mobile
- [ ] No console errors
- [ ] All tabs load correctly

---

## Troubleshooting

### Issue: Blank Page

**Solution:**
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for failed requests
4. Verify all file paths are correct

### Issue: Images Not Loading

**Solution:**
1. Check image URLs are publicly accessible
2. Verify image URLs use HTTPS
3. Check CORS headers in network tab
4. Try different image sources

### Issue: YouTube Player Not Working

**Solution:**
1. Verify YouTube API is loaded (Network tab)
2. Check playlist ID is correct
3. Ensure playlist is public
4. Check browser console for errors

### Issue: Local Upload Not Working

**Solution:**
1. Check file is valid image format
2. Verify file size < 5MB
3. Check browser permissions
4. Test in different browser

### Issue: Pinterest Not Loading

**Solution:**
1. Verify access token is valid
2. Check board ID is correct
3. Ensure board is public
4. Check rate limits haven't been exceeded

---

## Security Checklist for Production

- [ ] Enable HTTPS (SSL certificate)
- [ ] Set proper CSP headers
- [ ] Enable CORS only for trusted domains
- [ ] Validate all user inputs
- [ ] Never store API keys in frontend
- [ ] Use environment variables for secrets
- [ ] Update dependencies regularly
- [ ] Monitor for security vulnerabilities
- [ ] Implement rate limiting
- [ ] Add logging and monitoring

---

## Performance Optimization

### Image Optimization

Use tools like:
- ImageOptim
- TinyPNG
- FileOptim
- Squoosh

To reduce file sizes without quality loss.

### Code Minification

For production, minify:
```bash
# Install minifiers
npm install -g uglify-js clean-css-cli

# Minify JS
uglifyjs js/*.js -o js/main.min.js

# Minify CSS
cleancss css/*.css -o css/main.min.css
```

Then update `index.html` to use minified versions:
```html
<link rel="stylesheet" href="css/main.min.css">
<script src="js/main.min.js"></script>
```

### Enable Caching

Add to `.htaccess` (Apache servers):
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpeg "access plus 30 days"
    ExpiresByType image/gif "access plus 30 days"
    ExpiresByType image/png "access plus 30 days"
    ExpiresByType text/css "access plus 7 days"
    ExpiresByType application/javascript "access plus 7 days"
</IfModule>
```

---

## Environment Variables (For Advanced Users)

Create `.env` file (not for frontend):
```
YOUTUBE_PLAYLIST_ID=PLxxxxx
PINTEREST_TOKEN=your_token_here
API_KEY=your_key_here
```

Note: Frontend has no .env support. Use backend for secrets.

---

## Monitoring & Analytics

### Add Google Analytics

Add to `index.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

Replace `GA_ID` with your Google Analytics ID.

---

## Maintenance

### Regular Tasks

- **Weekly:** Check console errors
- **Monthly:** Update dependencies
- **Monthly:** Review analytics
- **Quarterly:** Security audit
- **Yearly:** Full performance review

### Backup

Always maintain backups:
- Git repository (recommended)
- Local copy on computer
- Cloud storage (Google Drive, Dropbox)

---

## Getting Help

### Common Resources

1. **Browser DevTools** - F12 key
2. **Stack Overflow** - For code issues
3. **MDN Web Docs** - For web APIs
4. **YouTube Docs** - For YouTube API
5. **Pinterest Docs** - For Pinterest API

### Debug Mode

Enable logging:

```javascript
// In browser console:
console.log(app);  // View app object
console.log(app.components);  // View all components
window.DEBUG = true;  // Enable debug logging
```

---

## Tips for Success

✅ **Do:**
- Test on multiple browsers
- Use responsive design
- Optimize images
- Monitor performance
- Keep code organized
- Document changes
- Backup regularly

❌ **Don't:**
- Store secrets in code
- Use old versions
- Ignore error messages
- Skip testing
- Mix concerns (HTML/CSS/JS)
- Hardcode values
- Use outdated libraries

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | Nov 2025 | Initial release |

---

## Support Contact

For issues or questions:
- Check README.md first
- Review SETUP.md (this file)
- Check browser console
- Review code comments
- Test in different browser

---

**Last Updated:** November 2025
**Status:** Production Ready ✅