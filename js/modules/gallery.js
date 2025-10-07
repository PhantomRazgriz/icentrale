/**
 * GALLERY MODULE - A i' centrale
 * Handles gallery lightbox functionality
 */

let currentImageIndex = 0;
let galleryImages = [];
let lightbox = null;

/**
 * Initialize gallery
 */
export function initGallery() {
    console.log('🖼️ Gallery module initialized');
    
    const galleryItems = document.querySelectorAll('.gallery__item');
    
    if (galleryItems.length === 0) {
        console.warn('No gallery items found');
        return;
    }
    
    // Create lightbox
    lightbox = createLightbox();
    
    // Store gallery images data
    galleryImages = Array.from(galleryItems).map((item, index) => {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery__caption');
        
        return {
            src: img ? img.src : '',
            alt: img ? img.alt : '',
            caption: caption ? caption.textContent : '',
            index: index
        };
    });
    
    // Add click handlers to gallery items
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            openLightbox(index);
        });
        
        // Add keyboard support
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `View image ${index + 1}`);
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });
}

/**
 * Create lightbox element
 * @returns {HTMLElement} The lightbox element
 */
function createLightbox() {
    let lightbox = document.querySelector('.gallery__lightbox');
    
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.className = 'gallery__lightbox';
        lightbox.setAttribute('role', 'dialog');
        lightbox.setAttribute('aria-modal', 'true');
        lightbox.setAttribute('aria-label', 'Image lightbox');
        
        lightbox.innerHTML = `
            <button class="gallery__lightbox-close" aria-label="Close lightbox">×</button>
            <button class="gallery__lightbox-prev" aria-label="Previous image">‹</button>
            <button class="gallery__lightbox-next" aria-label="Next image">›</button>
            <div class="gallery__lightbox-content">
                <img class="gallery__lightbox-image" src="" alt="">
                <p class="gallery__lightbox-caption"></p>
            </div>
        `;
        
        document.body.appendChild(lightbox);
        
        // Add event listeners
        const closeBtn = lightbox.querySelector('.gallery__lightbox-close');
        const prevBtn = lightbox.querySelector('.gallery__lightbox-prev');
        const nextBtn = lightbox.querySelector('.gallery__lightbox-next');
        
        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', showPrevImage);
        nextBtn.addEventListener('click', showNextImage);
        
        // Close on overlay click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', handleLightboxKeyboard);
    }
    
    return lightbox;
}

/**
 * Open lightbox with specific image
 * @param {number} index - Index of image to display
 */
function openLightbox(index) {
    if (!lightbox || !galleryImages[index]) return;
    
    currentImageIndex = index;
    
    // Update lightbox content
    updateLightboxImage();
    
    // Show lightbox
    lightbox.classList.add('gallery__lightbox--active');
    document.body.classList.add('no-scroll');
    
    // Focus close button for accessibility
    const closeBtn = lightbox.querySelector('.gallery__lightbox-close');
    if (closeBtn) {
        setTimeout(() => closeBtn.focus(), 100);
    }
    
    console.log(`Lightbox opened - Image ${index + 1}/${galleryImages.length}`);
}

/**
 * Close lightbox
 */
function closeLightbox() {
    if (!lightbox) return;
    
    lightbox.classList.remove('gallery__lightbox--active');
    document.body.classList.remove('no-scroll');
    
    console.log('Lightbox closed');
}

/**
 * Show previous image
 */
function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    updateLightboxImage();
}

/**
 * Show next image
 */
function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    updateLightboxImage();
}

/**
 * Update lightbox image
 */
function updateLightboxImage() {
    if (!lightbox) return;
    
    const currentImage = galleryImages[currentImageIndex];
    const img = lightbox.querySelector('.gallery__lightbox-image');
    const caption = lightbox.querySelector('.gallery__lightbox-caption');
    
    if (img && currentImage) {
        // Add loading state
        img.style.opacity = '0';
        
        // Update image
        img.src = currentImage.src;
        img.alt = currentImage.alt;
        
        // Update caption
        if (caption) {
            caption.textContent = currentImage.caption;
        }
        
        // Show image when loaded
        img.onload = () => {
            img.style.opacity = '1';
        };
    }
    
    // Update prev/next button states
    updateNavigationButtons();
}

/**
 * Update navigation button states
 */
function updateNavigationButtons() {
    if (!lightbox) return;
    
    const prevBtn = lightbox.querySelector('.gallery__lightbox-prev');
    const nextBtn = lightbox.querySelector('.gallery__lightbox-next');
    
    // For infinite loop, always enable both buttons
    // If you want to disable at ends, uncomment below:
    /*
    if (prevBtn) {
        prevBtn.disabled = currentImageIndex === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentImageIndex === galleryImages.length - 1;
    }
    */
}

/**
 * Handle keyboard navigation in lightbox
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleLightboxKeyboard(e) {
    if (!lightbox || !lightbox.classList.contains('gallery__lightbox--active')) {
        return;
    }
    
    switch(e.key) {
        case 'Escape':
            closeLightbox();
            break;
        case 'ArrowLeft':
            showPrevImage();
            break;
        case 'ArrowRight':
            showNextImage();
            break;
    }
}

/**
 * Add swipe support for touch devices
 */
function initSwipeSupport() {
    if (!lightbox) return;
    
    let touchStartX = 0;
    let touchEndX = 0;
    
    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe left - next image
            showNextImage();
        }
        
        if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe right - previous image
            showPrevImage();
        }
    }
}

// Initialize swipe support after lightbox is created
setTimeout(() => {
    if (lightbox) {
        initSwipeSupport();
    }
}, 100);

/**
 * Preload adjacent images for better UX
 */
function preloadAdjacentImages() {
    const prevIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    const nextIndex = (currentImageIndex + 1) % galleryImages.length;
    
    [prevIndex, nextIndex].forEach(index => {
        const img = new Image();
        img.src = galleryImages[index].src;
    });
}

/**
 * Get current image index
 * @returns {number} Current image index
 */
export function getCurrentImageIndex() {
    return currentImageIndex;
}

/**
 * Get total images count
 * @returns {number} Total images
 */
export function getTotalImages() {
    return galleryImages.length;
}

/**
 * Export functions
 */
export {
    openLightbox,
    closeLightbox,
    showPrevImage,
    showNextImage
};