// ============================================
// CONSTANTS.JS - Configuration & Constants
// ============================================

const CONFIG = {
    // Default slideshow images
    DEFAULT_IMAGES: [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80',
        'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=1920&q=80',
        'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1920&q=80',
        'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1920&q=80',
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80'
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