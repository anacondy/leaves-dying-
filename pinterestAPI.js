// ============================================
// PINTEREST API MODULE
// ============================================

class PinterestAPI {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.baseUrl = CONFIG.PINTEREST.BASE_URL;
        this.apiVersion = CONFIG.PINTEREST.API_VERSION;
        this.rateLimiter = new RateLimiter(
            CONFIG.PINTEREST.RATE_LIMIT.maxRequests,
            CONFIG.PINTEREST.RATE_LIMIT.timeWindow
        );
        this.callbacks = {
            onSuccess: null,
            onError: null,
            onRateLimit: null
        };
    }

    /**
     * Set access token
     * @param {string} token - Pinterest access token
     */
    setToken(token) {
        this.accessToken = token;
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
     * Make API request with rate limiting
     * @private
     */
    async _makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}/${this.apiVersion}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Authorization': `Bearer ${this.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const mergedOptions = { ...defaultOptions, ...options };

        try {
            return await this.rateLimiter.throttle(async () => {
                const response = await fetch(url, mergedOptions);

                if (response.status === 429) {
                    const retryAfter = response.headers.get('Retry-After') || 60;
                    if (this.callbacks.onRateLimit) {
                        this.callbacks.onRateLimit({
                            retryAfter: parseInt(retryAfter),
                            message: 'Rate limited by Pinterest API'
                        });
                    }
                    throw new Error(`Rate limited. Retry after ${retryAfter}s`);
                }

                if (!response.ok) {
                    throw new Error(`Pinterest API Error: ${response.status} ${response.statusText}`);
                }

                return await response.json();
            });
        } catch (error) {
            console.error('Pinterest API Error:', error);
            if (this.callbacks.onError) {
                this.callbacks.onError(error);
            }
            throw error;
        }
    }

    /**
     * Get user's boards
     * @returns {Promise<Array>} - Array of boards
     */
    async getUserBoards() {
        try {
            const data = await this._makeRequest('/me/boards', {
                method: 'GET'
            });

            if (this.callbacks.onSuccess) {
                this.callbacks.onSuccess({
                    type: 'boards',
                    data: data.items
                });
            }

            return data.items || [];
        } catch (error) {
            return [];
        }
    }

    /**
     * Get pins from board
     * @param {string} boardId - Board ID
     * @param {Object} options - Request options (limit, etc)
     * @returns {Promise<Array>} - Array of pins
     */
    async getBoardPins(boardId, options = {}) {
        try {
            const limit = options.limit || 25;
            const data = await this._makeRequest(`/boards/${boardId}/pins`, {
                method: 'GET'
            });

            const pins = data.items || [];
            const processedPins = pins.slice(0, limit).map(pin => ({
                id: pin.id,
                title: pin.title,
                description: pin.description,
                imageUrl: pin.media?.images?.['736x']?.url || 
                          pin.media?.images?.['1200x']?.url ||
                          pin.media?.images?.original?.url,
                link: pin.link,
                sourceUrl: pin.creative_type
            }));

            if (this.callbacks.onSuccess) {
                this.callbacks.onSuccess({
                    type: 'pins',
                    data: processedPins
                });
            }

            return processedPins;
        } catch (error) {
            return [];
        }
    }

    /**
     * Search pins
     * @param {string} query - Search query
     * @param {Object} options - Search options
     * @returns {Promise<Array>} - Array of pins
     */
    async searchPins(query, options = {}) {
        try {
            const limit = options.limit || 25;
            const data = await this._makeRequest('/search/pins', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            });

            const pins = data.items || [];
            const processedPins = pins.slice(0, limit).map(pin => ({
                id: pin.id,
                title: pin.title,
                description: pin.description,
                imageUrl: pin.media?.images?.['736x']?.url || 
                          pin.media?.images?.['1200x']?.url ||
                          pin.media?.images?.original?.url,
                link: pin.link
            }));

            return processedPins;
        } catch (error) {
            return [];
        }
    }

    /**
     * Get specific board info
     * @param {string} boardId - Board ID
     * @returns {Promise<Object>} - Board info
     */
    async getBoard(boardId) {
        try {
            const data = await this._makeRequest(`/boards/${boardId}`, {
                method: 'GET'
            });

            return data;
        } catch (error) {
            return null;
        }
    }
}

/**
 * Rate Limiter Helper Class
 */
class RateLimiter {
    constructor(maxRequests, timeWindow) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = [];
    }

    async throttle(fn) {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.timeWindow);

        if (this.requests.length >= this.maxRequests) {
            const waitTime = this.timeWindow - (now - this.requests[0]);
            await sleep(waitTime);
        }

        this.requests.push(now);
        return fn();
    }
}