// ============================================
// KEYBOARD HANDLER - Handle keyboard shortcuts
// ============================================

class KeyboardHandler {
    constructor() {
        this.keysPressed = new Set();
        this.settingsTimer = null;
        this.settingsHoldTime = 2000; // 2 seconds
        this.progressInterval = null;
        this.textScroller = null;
        this.slideshow = null;
    }

    /**
     * Initialize keyboard handler
     * @param {VerticalTextScroller} textScroller - Text scroller instance
     * @param {BackgroundSlideshow} slideshow - Slideshow instance
     */
    init(textScroller, slideshow) {
        this.textScroller = textScroller;
        this.slideshow = slideshow;
        
        this.setupKeyboardListeners();
        this.setupSettingsHint();
    }

    /**
     * Setup keyboard event listeners
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    /**
     * Handle key down event
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyDown(e) {
        const key = e.key.toLowerCase();
        this.keysPressed.add(key);

        // Check for F+S combination (use lowercase since we converted)
        if (this.keysPressed.has('f') && this.keysPressed.has('s')) {
            if (!this.settingsTimer) {
                this.startSettingsTimer();
            }
        }

        // Handle arrow keys for text scrolling
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.textScroller) {
                this.textScroller.scrollUp();
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.textScroller) {
                this.textScroller.scrollDown();
            }
        }

        // Handle space for play/pause
        if (e.key === ' ' || e.key === 'Spacebar') {
            const target = e.target;
            // Don't prevent space in input fields or contenteditable
            if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && !target.isContentEditable) {
                e.preventDefault();
                const playPauseBtn = document.getElementById('play-pause-btn');
                if (playPauseBtn) {
                    playPauseBtn.click();
                }
            }
        }
    }

    /**
     * Handle key up event
     * @param {KeyboardEvent} e - Keyboard event
     */
    handleKeyUp(e) {
        const key = e.key.toLowerCase();
        this.keysPressed.delete(key);

        // Stop settings timer if F or S is released
        if ((key === 'f' || key === 's') && this.settingsTimer) {
            this.stopSettingsTimer();
        }
    }

    /**
     * Start settings access timer
     */
    startSettingsTimer() {
        const hintElement = document.getElementById('settings-hint');
        const progressElement = document.getElementById('settings-progress');
        
        if (hintElement) {
            hintElement.classList.add('visible');
        }

        let progress = 0;
        const steps = 50;
        const interval = this.settingsHoldTime / steps;

        this.progressInterval = setInterval(() => {
            progress += (100 / steps);
            if (progressElement) {
                progressElement.style.width = progress + '%';
            }
        }, interval);

        this.settingsTimer = setTimeout(() => {
            this.accessSettings();
        }, this.settingsHoldTime);
    }

    /**
     * Stop settings access timer
     */
    stopSettingsTimer() {
        if (this.settingsTimer) {
            clearTimeout(this.settingsTimer);
            this.settingsTimer = null;
        }

        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }

        const hintElement = document.getElementById('settings-hint');
        const progressElement = document.getElementById('settings-progress');
        
        if (hintElement) {
            hintElement.classList.remove('visible');
        }

        if (progressElement) {
            progressElement.style.width = '0%';
        }
    }

    /**
     * Access settings page
     */
    accessSettings() {
        this.stopSettingsTimer();
        window.location.href = 'login.html';
    }

    /**
     * Setup settings hint UI
     */
    setupSettingsHint() {
        const style = document.createElement('style');
        style.textContent = `
            .settings-hint {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background: rgba(0, 0, 0, 0.85);
                backdrop-filter: blur(15px);
                padding: 16px 24px;
                border-radius: 12px;
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: rgba(255, 255, 255, 0.9);
                font-size: 14px;
                font-weight: 600;
                z-index: 10000;
                opacity: 0;
                transition: all 0.3s ease;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
            }
            
            .settings-hint.visible {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
            
            .settings-hint .progress-bar {
                width: 200px;
                height: 4px;
                background: rgba(255, 255, 255, 0.2);
                border-radius: 2px;
                margin-top: 8px;
                overflow: hidden;
            }
            
            .settings-hint .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #00d4ff, #0099ff);
                border-radius: 2px;
                width: 0%;
                transition: width 0.1s linear;
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KeyboardHandler;
}
