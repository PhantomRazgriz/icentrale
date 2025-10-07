/**
 * SCROLL ANIMATIONS MODULE - A i' centrale
 * Handles reveal animations on scroll using Intersection Observer
 */

let observer = null;

/**
 * Initialize scroll animations
 */
export function initScrollAnimations() {
    console.log('🎬 Scroll animations module initialized');
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        console.log('Reduced motion preference detected - skipping animations');
        makeAllVisible();
        return;
    }
    
    // Initialize Intersection Observer
    createObserver();
    
    // Observe all elements with animation classes
    observeElements();
}

/**
 * Create Intersection Observer
 */
function createObserver() {
    const options = {
        root: null, // viewport
        rootMargin: '0px 0px -100px 0px', // Trigger 100px before element enters viewport
        threshold: 0.1 // Trigger when 10% of element is visible
    };
    
    const callback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class
                entry.target.classList.add('is-visible');
                
                // Unobserve after animation (optional - remove if you want re-animation on scroll up)
                observer.unobserve(entry.target);
            }
        });
    };
    
    observer = new IntersectionObserver(callback, options);
    
    // Store observer globally for cleanup
    window.scrollAnimationObserver = observer;
}

/**
 * Observe elements with animation classes
 */
function observeElements() {
    // Default scroll reveal elements
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    
    // Fade in elements
    const fadeInElements = document.querySelectorAll('.fade-in');
    
    // Slide animations
    const slideLeftElements = document.querySelectorAll('.slide-left');
    const slideRightElements = document.querySelectorAll('.slide-right');
    
    // Scale animations
    const scaleInElements = document.querySelectorAll('.scale-in');
    
    // Component-specific elements
    const aboutContent = document.querySelectorAll('.about__content, .about__image');
    const features = document.querySelectorAll('.feature');
    const menuCards = document.querySelectorAll('.menu__card');
    const galleryItems = document.querySelectorAll('.gallery__item');
    const ctaContent = document.querySelectorAll('.cta__content');
    
    // Combine all elements
    const allElements = [
        ...scrollRevealElements,
        ...fadeInElements,
        ...slideLeftElements,
        ...slideRightElements,
        ...scaleInElements,
        ...aboutContent,
        ...features,
        ...menuCards,
        ...galleryItems,
        ...ctaContent
    ];
    
    // Observe each element
    allElements.forEach(element => {
        if (observer) {
            observer.observe(element);
        }
    });
    
    console.log(`Observing ${allElements.length} elements for scroll animations`);
}

/**
 * Make all animated elements visible immediately
 * Used when user prefers reduced motion
 */
function makeAllVisible() {
    const animatedElements = document.querySelectorAll(`
        .scroll-reveal,
        .fade-in,
        .slide-left,
        .slide-right,
        .scale-in,
        .about__content,
        .about__image,
        .feature,
        .menu__card,
        .gallery__item,
        .cta__content
    `);
    
    animatedElements.forEach(element => {
        element.classList.add('is-visible');
        element.style.opacity = '1';
        element.style.transform = 'none';
    });
}

/**
 * Disconnect observer
 * Useful for cleanup or re-initialization
 */
export function disconnectObserver() {
    if (observer) {
        observer.disconnect();
        console.log('Scroll animations observer disconnected');
    }
}

/**
 * Reconnect observer
 * Re-observe all elements
 */
export function reconnectObserver() {
    if (observer) {
        observer.disconnect();
    }
    createObserver();
    observeElements();
    console.log('Scroll animations observer reconnected');
}

/**
 * Check if element is in viewport
 * Utility function for manual checks
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} - True if element is in viewport
 */
export function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Manually trigger animation on element
 * @param {HTMLElement} element - Element to animate
 */
export function triggerAnimation(element) {
    if (element) {
        element.classList.add('is-visible');
    }
}

/**
 * Reset animation on element
 * @param {HTMLElement} element - Element to reset
 */
export function resetAnimation(element) {
    if (element) {
        element.classList.remove('is-visible');
    }
}

/**
 * Add stagger delay to elements
 * @param {NodeList} elements - Elements to stagger
 * @param {number} delay - Base delay in ms
 */
export function addStaggerDelay(elements, delay = 100) {
    elements.forEach((element, index) => {
        element.style.transitionDelay = `${index * delay}ms`;
    });
}

/**
 * Listen for reduced motion preference changes
 */
const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
mediaQuery.addEventListener('change', (e) => {
    if (e.matches) {
        console.log('Reduced motion enabled - disabling animations');
        disconnectObserver();
        makeAllVisible();
    } else {
        console.log('Reduced motion disabled - enabling animations');
        initScrollAnimations();
    }
});

/**
 * Export functions
 */
export {
    createObserver,
    observeElements,
    makeAllVisible
};