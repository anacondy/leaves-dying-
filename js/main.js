// ============================================
// MAIN APPLICATION INITIALIZATION
// ============================================

class MusicVisualApp {
    constructor() {
        this.config = CONFIG;
        this.components = {
            player: null,
            slideshow: null,
            scroller: null,
            uploader: null,
            ui: null,
            notifications: null,
            pinterest: null,
            keyboard: null
        };
        this.state = {
            isReady: false,
            isPlaying: false,
            currentPlaylist: null
        };
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            console.log('🎵 Initializing Music & Visual Experience...');

            // Initialize notification system first
            this.components.notifications = new NotificationSystem();
            this.components.notifications.init();
            this.components.notifications.info('Initializing application...');

            // Initialize audio player
            this.components.player = new AudioPlayer();
            this.components.player.init('youtube-player', {
                videoId: 'dQw4w9WgXcQ'
            });

            // Setup player callbacks
            this.components.player.on('onReady', () => this._onPlayerReady());
            this.components.player.on('onStateChange', () => this._onPlayerStateChange());

            // Initialize slideshow
            this.components.slideshow = new BackgroundSlideshow(
                this.config.DEFAULT_IMAGES,
                this.config.SLIDESHOW.DEFAULT_INTERVAL
            );
            this.components.slideshow.init('background-slideshow');

            // Setup slideshow callbacks
            this.components.slideshow.on('onImageChange', (data) => {
                this._updateImageInfo(data);
            });

            // Initialize text scroller
            this.components.scroller = new VerticalTextScroller(
                this.config.TEXT_ANIMATION.ITEMS,
                this.components.slideshow
            );
            this.components.scroller.init();

            // Initialize keyboard handler
            this.components.keyboard = new KeyboardHandler();
            this.components.keyboard.init(this.components.scroller, this.components.slideshow);

            // Initialize UI controller
            this.components.ui = new UIController(
                this.components.player,
                this.components.slideshow,
                this.components.scroller,
                this.components.uploader
            );
            this.components.ui.init();

            // Setup editable text functionality
            this._setupEditableText();

            // Preload images
            await this.components.slideshow.preload();

            // Start application
            this.components.slideshow.start();
            this.components.scroller.resume();

            this.state.isReady = true;
            this.components.notifications.success('✅ Application ready!');

            console.log('✅ Music & Visual Experience initialized successfully!');
        } catch (error) {
            console.error('❌ Initialization error:', error);
            this.components.notifications.error(`Initialization error: ${error.message}`);
        }
    }

    /**
     * Handle player ready
     * @private
     */
    _onPlayerReady() {
        console.log('✅ YouTube Player Ready');
        // Set initial volume
        this.components.player.setVolume(70);
    }

    /**
     * Handle player state change
     * @private
     */
    _onPlayerStateChange() {
        // Sync slideshow with player
        const isPlaying = this.components.player.isPlaying();
        if (isPlaying) {
            this.components.slideshow.start();
            this.components.scroller.resume();
        }
        
        // Update play/pause button icon
        this._updatePlayPauseButton(isPlaying);
    }

    /**
     * Update play/pause button icon
     * @private
     */
    _updatePlayPauseButton(isPlaying) {
        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');
        
        if (playIcon && pauseIcon) {
            if (isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            } else {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        }
    }

    /**
     * Update image info display
     * @private
     */
    _updateImageInfo(data) {
        const imageCount = document.getElementById('image-count');
        if (imageCount) {
            imageCount.textContent = `${data.index + 1} / ${data.total}`;
        }
    }

    /**
     * Setup editable text functionality
     * @private
     */
    _setupEditableText() {
        // Setup title editing
        const appTitle = document.getElementById('app-title');
        const editTitleBtn = document.getElementById('edit-title-btn');
        
        if (appTitle && editTitleBtn) {
            editTitleBtn.addEventListener('click', () => {
                const isEditing = appTitle.getAttribute('contenteditable') === 'true';
                if (isEditing) {
                    appTitle.setAttribute('contenteditable', 'false');
                    editTitleBtn.style.opacity = '0.7';
                    this.components.notifications.success('Title saved!');
                    // Save to localStorage
                    localStorage.setItem('appTitle', appTitle.textContent);
                } else {
                    appTitle.setAttribute('contenteditable', 'true');
                    appTitle.focus();
                    editTitleBtn.style.opacity = '1';
                }
            });
            
            // Load saved title
            const savedTitle = localStorage.getItem('appTitle');
            if (savedTitle) {
                appTitle.textContent = savedTitle;
            }
        }
        
        // Setup text scroll editing
        const textScroll = document.getElementById('text-scroll');
        const editTextBtn = document.getElementById('edit-text-btn');
        
        if (textScroll && editTextBtn) {
            let textItemsCache = null;
            
            editTextBtn.addEventListener('click', () => {
                const isEditing = textScroll.getAttribute('contenteditable') === 'true';
                if (isEditing) {
                    textScroll.setAttribute('contenteditable', 'false');
                    editTextBtn.style.opacity = '0.7';
                    
                    // Update text items using cached elements
                    textItemsCache = textScroll.querySelectorAll('.text-item');
                    const items = Array.from(textItemsCache)
                        .map(item => item.textContent.trim())
                        .filter(text => text.length > 0);
                    
                    if (items.length > 0) {
                        this.components.scroller.updateItems(items);
                        this.components.notifications.success('Text items saved!');
                        // Save to localStorage
                        localStorage.setItem('textItems', JSON.stringify(items));
                    }
                    textItemsCache = null; // Clear cache after use
                } else {
                    textScroll.setAttribute('contenteditable', 'true');
                    editTextBtn.style.opacity = '1';
                    this.components.notifications.info('Edit mode enabled - modify text items');
                }
            });
            
            // Load saved text items
            const savedItems = localStorage.getItem('textItems');
            if (savedItems) {
                try {
                    const items = JSON.parse(savedItems);
                    if (Array.isArray(items) && items.length > 0) {
                        this.components.scroller.updateItems(items);
                    }
                } catch (e) {
                    console.warn('Failed to load saved text items:', e);
                }
            }
        }
    }

    /**
     * Get component
     * @param {string} name - Component name
     * @returns {*} - Component instance
     */
    getComponent(name) {
        return this.components[name] || null;
    }

    /**
     * Check if ready
     * @returns {boolean} - True if app is ready
     */
    isReady() {
        return this.state.isReady;
    }
}

// ============================================
// APPLICATION STARTUP
// ============================================

// Global app instance
let app = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    app = new MusicVisualApp();
    await app.init();

    // Expose global for debugging
    window.musicVisualApp = app;
});

// Handle errors
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    if (app && app.components.notifications) {
        app.components.notifications.error(`Error: ${event.error.message}`);
    }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    if (app && app.components.notifications) {
        app.components.notifications.error(`Unhandled error: ${event.reason}`);
    }
});