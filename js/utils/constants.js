// ============================================
// CONSTANTS.JS - Configuration & Constants
// ============================================

const CONFIG = {
    // Default slideshow images - Using local images
    DEFAULT_IMAGES: [
        '5dd84a18932fb39a83c4c045dd78268d.jpg',
        '7578c6938688c6b3d2d236650c0ac0e8.jpg',
        'c7cbc9a20c27ec04bb0427e10901a7d2.jpg',
        'e26844ce7a4f9626f64224ef83efdd51.jpg'
    ],

    // YouTube API
    YOUTUBE: {
        API_KEY: 'YOUR_YOUTUBE_API_KEY', // Replace with your API key
        DEFAULT_PLAYLIST: 'PLrAXtmErZgOeiKm4sgNOknGvNjby9efdf' // Spotify Playlist or any public playlist
    },

    // Pinterest API
    PINTEREST: {
        API_VERSION: 'v5',
        BASE_URL: 'https://api.pinterest.com',
        RATE_LIMIT: {
            maxRequests: 10,
            timeWindow: 60000 // 1 minute
        }
    },

    // Slideshow
    SLIDESHOW: {
        DEFAULT_INTERVAL: 8000, // 8 seconds
        MIN_INTERVAL: 3000,     // 3 seconds
        MAX_INTERVAL: 20000,    // 20 seconds
        FADE_DURATION: 2000     // 2 seconds fade
    },

    // Text Animation
    TEXT_ANIMATION: {
        ITEMS: [
            'Internet',
            'Schedule',
            'Restaurants',
            'Decibels',
            'Coffees',
            'Jobs',
            'Cars',
            'Emails',
            'Parties',
            'Nature'
        ]
    },

    // Toast Notifications
    TOAST: {
        DURATION: 3000, // 3 seconds
        POSITION: 'bottom-right',
        MAX_TOASTS: 5
    },

    // File Upload
    FILE_UPLOAD: {
        MAX_FILES: 50,
        MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        PREVIEW_COUNT: 6
    }
};

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}