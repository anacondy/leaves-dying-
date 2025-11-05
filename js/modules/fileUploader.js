// ============================================
// FILE UPLOADER MODULE
// ============================================

class LocalImageUploader {
    constructor(onImagesLoaded) {
        this.onImagesLoaded = onImagesLoaded;
        this.fileInput = null;
        this.uploadBtn = null;
        this.uploadArea = null;
        this.uploadedFiles = [];
        this.callbacks = {
            onSuccess: null,
            onError: null,
            onProgress: null
        };
    }

    /**
     * Initialize uploader
     */
    init() {
        this.fileInput = document.getElementById('file-input');
        this.uploadBtn = document.getElementById('upload-btn') || this.createUploadBtn();
        this.uploadArea = document.getElementById('upload-area');

        if (!this.fileInput) {
            console.error('File input not found');
            return false;
        }

        this._attachEventListeners();
        return true;
    }

    /**
     * Create upload button if not exists
     * @private
     */
    createUploadBtn() {
        const btn = document.createElement('button');
        btn.id = 'upload-btn';
        btn.className = 'btn btn-primary';
        btn.textContent = 'Choose Images';
        document.body.appendChild(btn);
        return btn;
    }

    /**
     * Attach event listeners
     * @private
     */
    _attachEventListeners() {
        if (this.uploadBtn) {
            this.uploadBtn.addEventListener('click', () => {
                this.fileInput.click();
            });
        }

        this.fileInput.addEventListener('change', (e) => {
            this.handleFiles(e.target.files);
        });

        if (this.uploadArea) {
            this.uploadArea.addEventListener('click', () => {
                this.fileInput.click();
            });

            this.uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                this.uploadArea.classList.add('drag-over');
            });

            this.uploadArea.addEventListener('dragleave', () => {
                this.uploadArea.classList.remove('drag-over');
            });

            this.uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                this.uploadArea.classList.remove('drag-over');
                this.handleFiles(e.dataTransfer.files);
            });
        }
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
     * Handle file upload
     * @param {FileList} files - Files to handle
     */
    async handleFiles(files) {
        if (!files || files.length === 0) return;

        const validFiles = this._validateFiles(files);
        if (validFiles.length === 0) {
            if (this.callbacks.onError) {
                this.callbacks.onError(new Error('No valid image files selected'));
            }
            return;
        }

        const imageUrls = [];
        let loadedCount = 0;

        for (let file of validFiles) {
            try {
                const url = await this._readFile(file);
                imageUrls.push(url);
                loadedCount++;

                if (this.callbacks.onProgress) {
                    this.callbacks.onProgress({
                        loaded: loadedCount,
                        total: validFiles.length
                    });
                }
            } catch (error) {
                console.error('Error reading file:', error);
            }
        }

        this.uploadedFiles = validFiles;

        if (this.callbacks.onSuccess) {
            this.callbacks.onSuccess({
                urls: imageUrls,
                count: imageUrls.length
            });
        }

        if (this.onImagesLoaded) {
            this.onImagesLoaded(imageUrls);
        }

        this._displayPreview(imageUrls.slice(0, CONFIG.FILE_UPLOAD.PREVIEW_COUNT));
    }

    /**
     * Validate files
     * @private
     */
    _validateFiles(files) {
        const validFiles = [];

        for (let file of files) {
            // Check file type
            if (!CONFIG.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
                console.warn(`Invalid file type: ${file.type}`);
                continue;
            }

            // Check file size
            if (file.size > CONFIG.FILE_UPLOAD.MAX_FILE_SIZE) {
                console.warn(`File too large: ${file.name}`);
                continue;
            }

            validFiles.push(file);

            if (validFiles.length >= CONFIG.FILE_UPLOAD.MAX_FILES) {
                break;
            }
        }

        return validFiles;
    }

    /**
     * Read file as data URL
     * @private
     */
    _readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = (e) => {
                resolve(e.target.result);
            };

            reader.onerror = (error) => {
                reject(error);
            };

            reader.readAsDataURL(file);
        });
    }

    /**
     * Display preview
     * @private
     */
    _displayPreview(urls) {
        const previewContainer = document.getElementById('upload-preview');
        if (!previewContainer) return;

        previewContainer.innerHTML = '';

        urls.forEach(url => {
            const thumb = document.createElement('div');
            thumb.className = 'image-thumb';
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Preview';
            img.loading = 'lazy';
            thumb.appendChild(img);
            previewContainer.appendChild(thumb);
        });
    }

    /**
     * Clear uploads
     */
    clear() {
        this.uploadedFiles = [];
        this.fileInput.value = '';
        const previewContainer = document.getElementById('upload-preview');
        if (previewContainer) {
            previewContainer.innerHTML = '';
        }
    }

    /**
     * Get uploaded count
     * @returns {number} - Number of uploaded files
     */
    getCount() {
        return this.uploadedFiles.length;
    }
}