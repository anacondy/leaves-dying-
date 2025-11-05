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
            pinterest: null
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

            // Initialize file uploader
            this.components.uploader = new LocalImageUploader((images) => {
                this._handleUploadedImages(images);
            });
            this.components.uploader.init();

            // Setup uploader callbacks
            this.components.uploader.on('onSuccess', (data) => {
                this.components.notifications.success(
                    `✅ Loaded ${data.count} images successfully!`
                );
            });

            this.components.uploader.on('onError', (error) => {
                this.components.notifications.error(`❌ Upload error: ${error.message}`);
            });

            // Initialize Pinterest API
            this.components.pinterest = new PinterestAPI('');
            this.components.pinterest.on('onError', (error) => {
                this.components.notifications.error(`Pinterest API Error: ${error.message}`);
            });

            // Initialize UI controller
            this.components.ui = new UIController(
                this.components.player,
                this.components.slideshow,
                this.components.scroller,
                this.components.uploader
            );
            this.components.ui.init();

            // Setup YouTube and Pinterest tab events
            this._setupYouTubeTab();
            this._setupPinterestTab();

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
     * Handle uploaded images
     * @private
     */
    _handleUploadedImages(images) {
        try {
            this.components.slideshow.updateImages(images, true);
            this.components.notifications.success('✅ Slideshow updated with your images!');
        } catch (error) {
            this.components.notifications.error(`Error updating slideshow: ${error.message}`);
        }
    }

    /**
     * Setup YouTube tab
     * @private
     */
    _setupYouTubeTab() {
        const playlistInput = document.getElementById('playlist-input');
        const loadPlaylistBtn = document.getElementById('load-playlist-btn');

        if (loadPlaylistBtn) {
            loadPlaylistBtn.addEventListener('click', async () => {
                const playlistId = playlistInput.value.trim();
                if (!playlistId) {
                    this.components.notifications.warning('Please enter a playlist ID');
                    return;
                }

                try {
                    this.components.notifications.info('Loading playlist...');
                    this.components.player.loadPlaylist(playlistId);
                    this.state.currentPlaylist = playlistId;
                    this.components.notifications.success('✅ Playlist loaded!');
                } catch (error) {
                    this.components.notifications.error(`Error loading playlist: ${error.message}`);
                }
            });
        }

        // Set default playlist
        if (playlistInput && this.config.YOUTUBE.DEFAULT_PLAYLIST) {
            playlistInput.value = this.config.YOUTUBE.DEFAULT_PLAYLIST;
        }
    }

    /**
     * Setup Pinterest tab
     * @private
     */
    _setupPinterestTab() {
        const pinterestTokenInput = document.getElementById('pinterest-token');
        const boardIdInput = document.getElementById('board-input');
        const loadPinterestBtn = document.getElementById('load-pinterest-btn');
        const searchBoardsBtn = document.getElementById('search-boards-btn');
        const boardsList = document.getElementById('boards-list');

        if (loadPinterestBtn) {
            loadPinterestBtn.addEventListener('click', async () => {
                const token = pinterestTokenInput.value.trim();
                const boardId = boardIdInput.value.trim();

                if (!token) {
                    this.components.notifications.warning('Please enter Pinterest access token');
                    return;
                }

                if (!boardId) {
                    this.components.notifications.warning('Please enter a board ID');
                    return;
                }

                try {
                    this.components.notifications.info('Loading Pinterest images...');
                    this.components.pinterest.setToken(token);
                    const pins = await this.components.pinterest.getBoardPins(boardId);

                    if (pins.length === 0) {
                        this.components.notifications.warning('No images found in this board');
                        return;
                    }

                    const imageUrls = pins.map(pin => pin.imageUrl).filter(url => url);
                    this.components.slideshow.updateImages(imageUrls, true);
                    this.components.notifications.success(`✅ Loaded ${imageUrls.length} images from Pinterest!`);
                } catch (error) {
                    this.components.notifications.error(`Pinterest error: ${error.message}`);
                }
            });
        }

        if (searchBoardsBtn) {
            searchBoardsBtn.addEventListener('click', async () => {
                const token = pinterestTokenInput.value.trim();

                if (!token) {
                    this.components.notifications.warning('Please enter Pinterest access token first');
                    return;
                }

                try {
                    this.components.notifications.info('Fetching your boards...');
                    this.components.pinterest.setToken(token);
                    const boards = await this.components.pinterest.getUserBoards();

                    if (!boardsList) return;
                    boardsList.innerHTML = '';

                    if (boards.length === 0) {
                        boardsList.innerHTML = '<p class="help-text">No boards found</p>';
                        return;
                    }

                    boards.forEach(board => {
                        const boardItem = document.createElement('div');
                        boardItem.className = 'board-item';
                        boardItem.innerHTML = `
                            <strong>${sanitizeHTML(board.name)}</strong>
                            <small>${sanitizeHTML(board.id)}</small>
                        `;
                        boardItem.addEventListener('click', () => {
                            boardIdInput.value = board.id;
                            this.components.notifications.success(`✅ Selected board: ${board.name}`);
                        });
                        boardsList.appendChild(boardItem);
                    });

                    this.components.notifications.success(`✅ Found ${boards.length} boards!`);
                } catch (error) {
                    this.components.notifications.error(`Error fetching boards: ${error.message}`);
                }
            });
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