// ============================================
// TEXT SCROLLER MODULE
// ============================================

class VerticalTextScroller {
    constructor(items, slideshow) {
        this.items = items || CONFIG.TEXT_ANIMATION.ITEMS;
        this.slideshow = slideshow;
        this.container = null;
        this.isScrolling = false;
        this.scrollDuration = 8000; // default
        this.callbacks = {
            onItemChange: null
        };
    }

    /**
     * Initialize text scroller
     * @param {string} containerId - Container element ID
     */
    init(containerId = 'background-slideshow') {
        this.container = document.querySelector('.text-scroll');
        if (!this.container) {
            console.warn('Text scroll container not found');
            return false;
        }

        this.updateScrollDuration();
        return true;
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
     * Update scroll duration based on slideshow
     */
    updateScrollDuration() {
        if (!this.container || !this.slideshow) return;

        const duration = (this.items.length * this.slideshow.interval) / 1000;
        this.scrollDuration = duration;
        this.container.style.animationDuration = `${duration}s`;
    }

    /**
     * Sync with slideshow
     */
    syncWithSlideshow() {
        this.updateScrollDuration();
    }

    /**
     * Pause scroll
     */
    pause() {
        if (this.container) {
            this.container.style.animationPlayState = 'paused';
            this.isScrolling = false;
        }
    }

    /**
     * Resume scroll
     */
    resume() {
        if (this.container) {
            this.container.style.animationPlayState = 'running';
            this.isScrolling = true;
        }
    }

    /**
     * Update items
     * @param {Array<string>} items - New items array
     */
    updateItems(items) {
        if (Array.isArray(items) && items.length > 0) {
            this.items = items;
            this.updateScrollDuration();
        }
    }

    /**
     * Get current item
     * @returns {string} - Current item
     */
    getCurrentItem() {
        if (this.slideshow) {
            const index = this.slideshow.currentIndex % this.items.length;
            return this.items[index];
        }
        return this.items[0];
    }
}