// ============================================
// SLIDESHOW MODULE
// ============================================

class BackgroundSlideshow {
    constructor(images, interval = 8000) {
        this.images = images || CONFIG.DEFAULT_IMAGES;
        this.interval = Math.max(CONFIG.SLIDESHOW.MIN_INTERVAL, Math.min(interval, CONFIG.SLIDESHOW.MAX_INTERVAL));
        this.currentIndex = 0;
        this.container = null;
        this.isPlaying = false;
        this.intervalId = null;
        this.callbacks = {
            onImageChange: null,
            onPlay: null,
            onPause: null,
            onError: null
        };
    }

    /**
     * Initialize slideshow
     * @param {string} containerId - Container element ID
     */
    init(containerId = 'background-slideshow') {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`Container with ID "${containerId}" not found`);
            return false;
        }

        this.container.innerHTML = '';
        this._createSlides();
        return true;
    }

    /**
     * Create slide elements
     * @private
     */
    _createSlides() {
        this.images.forEach((imageSrc, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'slideshow-image';
            // Sanitize URL to prevent CSS injection
            const sanitizedUrl = imageSrc.replace(/'/g, "\\'").replace(/"/g, '\\"');
            slideDiv.style.backgroundImage = `url('${sanitizedUrl}')`;
            
            if (index === 0) {
                slideDiv.classList.add('active');
            }

            slideDiv.addEventListener('error', () => {
                console.warn(`Failed to load image: ${imageSrc}`);
            });

            this.container.appendChild(slideDiv);
        });
    }

    /**
     * Register callback
     * @param {string} event - Event name
     * @param {Function} callback - Callback function
     */
    on(event, callback) {
        if (event in this.callbacks) {
            this.callbacks[event] = callback;
        }
    }

    /**
     * Start slideshow
     */
    start() {
        if (this.isPlaying) return;
        
        this.isPlaying = true;
        this.intervalId = setInterval(() => this.next(), this.interval);
        
        if (this.callbacks.onPlay) {
            this.callbacks.onPlay();
        }
    }

    /**
     * Stop slideshow
     */
    stop() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        if (this.callbacks.onPause) {
            this.callbacks.onPause();
        }
    }

    /**
     * Pause slideshow
     */
    pause() {
        this.stop();
    }

    /**
     * Resume slideshow
     */
    resume() {
        this.start();
    }

    /**
     * Go to next slide
     */
    next() {
        if (!this.container) return;

        const currentSlide = this.container.children[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.images.length;
        const nextSlide = this.container.children[this.currentIndex];

        if (currentSlide) currentSlide.classList.remove('active');
        if (nextSlide) nextSlide.classList.add('active');

        if (this.callbacks.onImageChange) {
            this.callbacks.onImageChange({
                index: this.currentIndex,
                total: this.images.length,
                imageUrl: this.images[this.currentIndex]
            });
        }
    }

    /**
     * Go to previous slide
     */
    previous() {
        if (!this.container) return;

        const currentSlide = this.container.children[this.currentIndex];
        this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
        const prevSlide = this.container.children[this.currentIndex];

        if (currentSlide) currentSlide.classList.remove('active');
        if (prevSlide) prevSlide.classList.add('active');

        if (this.callbacks.onImageChange) {
            this.callbacks.onImageChange({
                index: this.currentIndex,
                total: this.images.length,
                imageUrl: this.images[this.currentIndex]
            });
        }
    }

    /**
     * Go to specific slide
     * @param {number} index - Slide index
     */
    goTo(index) {
        if (!this.container || index < 0 || index >= this.images.length) return;

        const currentSlide = this.container.children[this.currentIndex];
        this.currentIndex = index;
        const targetSlide = this.container.children[this.currentIndex];

        if (currentSlide) currentSlide.classList.remove('active');
        if (targetSlide) targetSlide.classList.add('active');

        if (this.callbacks.onImageChange) {
            this.callbacks.onImageChange({
                index: this.currentIndex,
                total: this.images.length,
                imageUrl: this.images[this.currentIndex]
            });
        }
    }

    /**
     * Set slideshow interval
     * @param {number} interval - Interval in milliseconds
     */
    setInterval(interval) {
        const newInterval = Math.max(CONFIG.SLIDESHOW.MIN_INTERVAL, Math.min(interval, CONFIG.SLIDESHOW.MAX_INTERVAL));
        this.interval = newInterval;

        if (this.isPlaying) {
            this.stop();
            this.start();
        }
    }

    /**
     * Update images
     * @param {Array<string>} images - New image array
     * @param {boolean} autoInit - Auto initialize slideshow
     */
    updateImages(images, autoInit = true) {
        if (!Array.isArray(images) || images.length === 0) {
            console.error('Invalid images array');
            return false;
        }

        this.stop();
        this.images = images;
        this.currentIndex = 0;

        if (autoInit && this.container) {
            this.init('background-slideshow');
            this.start();
            return true;
        }

        return true;
    }

    /**
     * Get current image
     * @returns {string} - Current image URL
     */
    getCurrentImage() {
        return this.images[this.currentIndex];
    }

    /**
     * Get current index
     * @returns {number} - Current slide index
     */
    getCurrentIndex() {
        return this.currentIndex;
    }

    /**
     * Get total slides count
     * @returns {number} - Total slides
     */
    getCount() {
        return this.images.length;
    }

    /**
     * Preload all images
     * @returns {Promise} - Promise that resolves when all images are preloaded
     */
    async preload() {
        try {
            await preloadImages(this.images);
            return true;
        } catch (error) {
            console.error('Error preloading images:', error);
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
            return false;
        }
    }

    /**
     * Destroy slideshow
     */
    destroy() {
        this.stop();
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.images = [];
        this.currentIndex = 0;
    }
}