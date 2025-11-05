// ============================================
// NOTIFICATION SYSTEM MODULE
// ============================================

class NotificationSystem {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.maxToasts = CONFIG.TOAST.MAX_TOASTS;
        this.duration = CONFIG.TOAST.DURATION;
    }

    /**
     * Initialize notification system
     */
    init() {
        this.container = document.getElementById('toast-container');
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.id = 'toast-container';
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    }

    /**
     * Show success notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    success(message, duration = this.duration) {
        this.show(message, 'success', duration);
    }

    /**
     * Show error notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    error(message, duration = this.duration) {
        this.show(message, 'error', duration);
    }

    /**
     * Show info notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    info(message, duration = this.duration) {
        this.show(message, 'info', duration);
    }

    /**
     * Show warning notification
     * @param {string} message - Message to display
     * @param {number} duration - Duration in milliseconds (optional)
     */
    warning(message, duration = this.duration) {
        this.show(message, 'warning', duration);
    }

    /**
     * Show notification
     * @param {string} message - Message to display
     * @param {string} type - Type (success, error, info, warning)
     * @param {number} duration - Duration in milliseconds
     */
    show(message, type = 'info', duration = this.duration) {
        if (!this.container) {
            this.init();
        }

        // Remove old toasts if max reached
        if (this.toasts.length >= this.maxToasts) {
            const oldestToast = this.toasts.shift();
            oldestToast.remove();
        }

        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <span>${sanitizeHTML(message)}</span>
            <button class="toast-close" aria-label="Close">×</button>
        `;

        // Add close button listener
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this._removeToast(toast);
        });

        // Add to container
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Auto remove after duration
        setTimeout(() => {
            this._removeToast(toast);
        }, duration);
    }

    /**
     * Remove toast
     * @private
     */
    _removeToast(toast) {
        toast.classList.add('animate-slide-out');
        setTimeout(() => {
            toast.remove();
            this.toasts = this.toasts.filter(t => t !== toast);
        }, 300);
    }

    /**
     * Clear all notifications
     */
    clear() {
        this.toasts.forEach(toast => toast.remove());
        this.toasts = [];
    }
}