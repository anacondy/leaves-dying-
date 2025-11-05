// ============================================
// AUDIO PLAYER MODULE
// ============================================

class AudioPlayer {
    constructor() {
        this.player = null;
        this.isReady = false;
        this.currentTrack = null;
        this.playlistId = null;
        this.trackList = [];
        this.currentIndex = 0;
        this.callbacks = {
            onReady: null,
            onStateChange: null,
            onTrackChange: null,
            onError: null
        };
    }

    /**
     * Initialize YouTube Player
     * @param {string} containerId - Container element ID
     * @param {Object} options - Player options
     */
    init(containerId, options = {}) {
        const defaultOptions = {
            height: '1',
            width: '1',
            videoId: 'dQw4w9WgXcQ',
            playerVars: {
                autoplay: 0,
                controls: 0,
                disablekb: 1,
                fs: 0,
                modestbranding: 1,
                playsinline: 1,
                rel: 0
            },
            events: {
                onReady: (e) => this._onPlayerReady(e),
                onStateChange: (e) => this._onPlayerStateChange(e),
                onError: (e) => this._onPlayerError(e)
            }
        };

        const mergedOptions = { ...defaultOptions, ...options };

        window.onYouTubeIframeAPIReady = () => {
            if (typeof YT !== 'undefined' && YT.Player) {
                this.player = new YT.Player(containerId, mergedOptions);
            }
        };

        if (typeof YT !== 'undefined' && YT.Player) {
            this.player = new YT.Player(containerId, mergedOptions);
        }
    }

    /**
     * Handle player ready
     * @private
     */
    _onPlayerReady(event) {
        this.isReady = true;
        if (this.callbacks.onReady) {
            this.callbacks.onReady(event);
        }
    }

    /**
     * Handle player state change
     * @private
     */
    _onPlayerStateChange(event) {
        if (this.callbacks.onStateChange) {
            this.callbacks.onStateChange(event);
        }
    }

    /**
     * Handle player error
     * @private
     */
    _onPlayerError(event) {
        console.error('YouTube Player Error:', event.data);
        if (this.callbacks.onError) {
            this.callbacks.onError(event);
        }
    }

    /**
     * Register callback function
     * @param {string} event - Event name (onReady, onStateChange, onTrackChange, onError)
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (event in this.callbacks) {
            this.callbacks[event] = callback;
        }
    }

    /**
     * Load playlist
     * @param {string} playlistId - YouTube playlist ID
     */
    loadPlaylist(playlistId) {
        if (!this.player || !this.isReady) return;

        this.playlistId = playlistId;
        this.player.loadPlaylist({
            list: playlistId,
            listType: 'playlist',
            index: 0
        });
    }

    /**
     * Load single video
     * @param {string} videoId - YouTube video ID
     */
    loadVideo(videoId) {
        if (!this.player || !this.isReady) return;

        this.currentTrack = videoId;
        this.player.loadVideoById({
            videoId: videoId,
            startSeconds: 0,
            endSeconds: undefined
        });
    }

    /**
     * Play video
     */
    play() {
        if (this.player && this.isReady) {
            this.player.playVideo();
        }
    }

    /**
     * Pause video
     */
    pause() {
        if (this.player && this.isReady) {
            this.player.pauseVideo();
        }
    }

    /**
     * Stop video
     */
    stop() {
        if (this.player && this.isReady) {
            this.player.stopVideo();
        }
    }

    /**
     * Get player state
     * @returns {number} - Player state
     */
    getState() {
        if (!this.player || !this.isReady) return -1;
        return this.player.getPlayerState();
    }

    /**
     * Check if playing
     * @returns {boolean} - True if playing
     */
    isPlaying() {
        if (typeof YT === 'undefined') return false;
        return this.getState() === YT.PlayerState.PLAYING;
    }

    /**
     * Set volume
     * @param {number} volume - Volume level (0-100)
     */
    setVolume(volume) {
        if (this.player && this.isReady) {
            const vol = Math.max(0, Math.min(100, volume));
            this.player.setVolume(vol);
        }
    }

    /**
     * Get volume
     * @returns {number} - Current volume level (0-100)
     */
    getVolume() {
        if (!this.player || !this.isReady) return 0;
        return this.player.getVolume();
    }

    /**
     * Mute player
     */
    mute() {
        if (this.player && this.isReady) {
            this.player.mute();
        }
    }

    /**
     * Unmute player
     */
    unmute() {
        if (this.player && this.isReady) {
            this.player.unMute();
        }
    }

    /**
     * Get current time
     * @returns {number} - Current time in seconds
     */
    getCurrentTime() {
        if (!this.player || !this.isReady) return 0;
        return this.player.getCurrentTime();
    }

    /**
     * Get duration
     * @returns {number} - Duration in seconds
     */
    getDuration() {
        if (!this.player || !this.isReady) return 0;
        return this.player.getDuration();
    }

    /**
     * Seek to time
     * @param {number} seconds - Time in seconds
     */
    seekTo(seconds) {
        if (this.player && this.isReady) {
            this.player.seekTo(seconds, true);
        }
    }

    /**
     * Play next track
     */
    nextTrack() {
        if (this.player && this.isReady) {
            this.player.nextVideo();
            this.currentIndex++;
            if (this.callbacks.onTrackChange) {
                this.callbacks.onTrackChange({
                    index: this.currentIndex,
                    total: this.trackList.length
                });
            }
        }
    }

    /**
     * Play previous track
     */
    previousTrack() {
        if (this.player && this.isReady) {
            this.player.previousVideo();
            this.currentIndex--;
            if (this.callbacks.onTrackChange) {
                this.callbacks.onTrackChange({
                    index: this.currentIndex,
                    total: this.trackList.length
                });
            }
        }
    }

    /**
     * Get player quality levels
     * @returns {Array} - Available quality levels
     */
    getAvailableQualityLevels() {
        if (!this.player || !this.isReady) return [];
        return this.player.getAvailableQualityLevels();
    }

    /**
     * Set quality
     * @param {string} quality - Quality level (small, medium, large, hd720, hd1080, highres)
     */
    setQuality(quality) {
        if (this.player && this.isReady) {
            this.player.setPlaybackQuality(quality);
        }
    }

    /**
     * Get current quality
     * @returns {string} - Current quality level
     */
    getCurrentQuality() {
        if (!this.player || !this.isReady) return null;
        return this.player.getPlaybackQuality();
    }
}