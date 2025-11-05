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
        this.currentIndex = 0;
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

        this.renderItems();
        this.highlightCurrentItem();
        return true;
    }

    /**
     * Render text items
     */
    renderItems() {
        if (!this.container) return;
        
        // Clear existing items
        this.container.innerHTML = '';
        
        // Create item elements
        this.items.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'text-item';
            itemElement.textContent = item;
            itemElement.dataset.index = index;
            
            // Make items clickable
            itemElement.addEventListener('click', () => {
                this.scrollToIndex(index);
            });
            
            this.container.appendChild(itemElement);
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
     * Scroll up to previous item
     */
    scrollUp() {
        this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        this.updateView();
    }

    /**
     * Scroll down to next item
     */
    scrollDown() {
        this.currentIndex = (this.currentIndex + 1) % this.items.length;
        this.updateView();
    }

    /**
     * Scroll to specific index
     * @param {number} index - Target index
     */
    scrollToIndex(index) {
        if (index >= 0 && index < this.items.length) {
            this.currentIndex = index;
            this.updateView();
        }
    }

    /**
     * Update view after scroll
     */
    updateView() {
        this.highlightCurrentItem();
        
        // Sync with slideshow
        if (this.slideshow && typeof this.slideshow.goToSlide === 'function') {
            this.slideshow.goToSlide(this.currentIndex);
        }
        
        // Trigger callback
        if (this.callbacks.onItemChange) {
            this.callbacks.onItemChange({
                index: this.currentIndex,
                item: this.items[this.currentIndex]
            });
        }
    }

    /**
     * Highlight current item
     */
    highlightCurrentItem() {
        if (!this.container) return;
        
        const items = this.container.querySelectorAll('.text-item');
        items.forEach((item, index) => {
            if (index === this.currentIndex) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Update scroll duration based on slideshow
     */
    updateScrollDuration() {
        if (!this.container || !this.slideshow) return;

        const duration = (this.items.length * this.slideshow.interval) / 1000;
        this.scrollDuration = duration;
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
        this.isScrolling = false;
    }

    /**
     * Resume scroll
     */
    resume() {
        this.isScrolling = true;
    }

    /**
     * Update items
     * @param {Array<string>} items - New items array
     */
    updateItems(items) {
        if (Array.isArray(items) && items.length > 0) {
            this.items = items;
            this.renderItems();
            this.updateScrollDuration();
        }
    }

    /**
     * Get current item
     * @returns {string} - Current item
     */
    getCurrentItem() {
        return this.items[this.currentIndex];
    }

    /**
     * Set current index (for external sync)
     * @param {number} index - Index to set
     */
    setCurrentIndex(index) {
        if (index >= 0 && index < this.items.length) {
            this.currentIndex = index;
            this.highlightCurrentItem();
        }
    }
}