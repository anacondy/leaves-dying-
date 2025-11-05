// ============================================
// UI CONTROLLER MODULE
// ============================================

class UIController {
    constructor(player, slideshow, scroller, uploader) {
        this.player = player;
        this.slideshow = slideshow;
        this.scroller = scroller;
        this.uploader = uploader;
        this.tabManager = new TabManager();
    }

    /**
     * Initialize UI
     */
    init() {
        this._setupPlayControls();
        this._setupVolumeControl();
        this._setupIntervalControl();
        this._setupNavigationControls();
        this._setupTabNavigation();
        this._setupSettingsButton();
    }

    /**
     * Setup play/pause controls
     * @private
     */
    _setupPlayControls() {
        const playPauseBtn = document.getElementById('play-pause-btn');
        if (!playPauseBtn) return;

        playPauseBtn.addEventListener('click', () => {
            const isPlaying = this.player.isPlaying();

            if (isPlaying) {
                this.player.pause();
                this.slideshow.stop();
                this.scroller.pause();
                this._showPauseIcon();
            } else {
                this.player.play();
                this.slideshow.start();
                this.scroller.resume();
                this._showPlayIcon();
            }
        });

        this.player.on('onStateChange', (event) => {
            if (typeof YT !== 'undefined') {
                if (event.data === YT.PlayerState.PLAYING) {
                    this._showPlayIcon();
                    this.slideshow.start();
                    this.scroller.resume();
                } else {
                    this._showPauseIcon();
                    this.slideshow.stop();
                    this.scroller.pause();
                }
            }
        });
    }

    /**
     * Show play icon
     * @private
     */
    _showPlayIcon() {
        const playIcon = document.querySelector('.play-pause .play-icon');
        const pauseIcon = document.querySelector('.play-pause .pause-icon');
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
    }

    /**
     * Show pause icon
     * @private
     */
    _showPauseIcon() {
        const playIcon = document.querySelector('.play-pause .play-icon');
        const pauseIcon = document.querySelector('.play-pause .pause-icon');
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
    }

    /**
     * Setup volume control
     * @private
     */
    _setupVolumeControl() {
        const volumeSlider = document.getElementById('volume-slider');
        if (!volumeSlider) return;

        volumeSlider.addEventListener('input', (e) => {
            const volume = parseInt(e.target.value);
            this.player.setVolume(volume);
        });

        // Set initial volume
        this.player.setVolume(parseInt(volumeSlider.value));
    }

    /**
     * Setup slideshow interval control
     * @private
     */
    _setupIntervalControl() {
        const intervalSlider = document.getElementById('interval-slider');
        const intervalDisplay = document.getElementById('interval-display');

        if (!intervalSlider) return;

        const updateInterval = debounce((value) => {
            const interval = value * 1000;
            this.slideshow.setInterval(interval);
            this.scroller.updateScrollDuration();

            if (intervalDisplay) {
                intervalDisplay.textContent = `${value}s`;
            }
        }, 300);

        intervalSlider.addEventListener('input', (e) => {
            updateInterval(parseInt(e.target.value));
        });

        // Set initial display
        if (intervalDisplay) {
            intervalDisplay.textContent = `${intervalSlider.value}s`;
        }
    }

    /**
     * Setup next/previous navigation
     * @private
     */
    _setupNavigationControls() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                this.slideshow.previous();
                this._updateImageInfo();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                this.slideshow.next();
                this._updateImageInfo();
            });
        }
    }

    /**
     * Setup tab navigation
     * @private
     */
    _setupTabNavigation() {
        const tabBtns = document.querySelectorAll('.tab-btn');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                this.tabManager.switchTab(tabName);
            });
        });
    }

    /**
     * Setup settings button
     * @private
     */
    _setupSettingsButton() {
        const settingsBtn = document.getElementById('settings-btn');
        if (!settingsBtn) return;

        settingsBtn.addEventListener('click', () => {
            this._showSettingsPanel();
        });
    }

    /**
     * Show settings panel
     * @private
     */
    _showSettingsPanel() {
        // Placeholder for settings panel
        console.log('Settings panel - implement as needed');
    }

    /**
     * Update image info display
     * @private
     */
    _updateImageInfo() {
        const imageCount = document.getElementById('image-count');
        if (imageCount) {
            const current = this.slideshow.currentIndex + 1;
            const total = this.slideshow.images.length;
            imageCount.textContent = `${current} / ${total}`;
        }
    }

    /**
     * Update track info display
     * @param {string} trackName - Track name
     */
    updateTrackInfo(trackName) {
        const trackTitle = document.getElementById('track-title');
        if (trackTitle) {
            trackTitle.textContent = trackName || 'Select a track';
        }
    }
}

/**
 * Tab Manager Helper Class
 */
class TabManager {
    /**
     * Switch active tab
     * @param {string} tabName - Tab name
     */
    switchTab(tabName) {
        // Hide all tabs
        const tabPanes = document.querySelectorAll('.tab-pane');
        tabPanes.forEach(pane => pane.classList.remove('active'));

        // Remove active class from all buttons
        const tabBtns = document.querySelectorAll('.tab-btn');
        tabBtns.forEach(btn => btn.classList.remove('active'));

        // Show selected tab
        const selectedPane = document.getElementById(tabName);
        if (selectedPane) {
            selectedPane.classList.add('active');
        }

        // Add active class to clicked button
        const clickedBtn = document.querySelector(`[data-tab="${tabName}"]`);
        if (clickedBtn) {
            clickedBtn.classList.add('active');
        }
    }
}