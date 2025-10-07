/**
 * MAIN JS - A i' centrale
 * Main JavaScript entry point
 * Imports and initializes all modules
 */

// Import modules
import { initNavigation } from './modules/navigation.js';
import { initScrollAnimations } from './modules/scroll-animations.js';
import { initGallery } from './modules/gallery.js';
import { initMobileMenu } from './modules/mobile-menu.js';

// Import utilities
import { debounce } from './utils/helpers.js';

/**
 * Initialize all modules when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    console.log('🍊 A i\' centrale - Website initialized');
    
    // Initialize modules
    initNavigation();
    initScrollAnimations();
    initGallery();
    initMobileMenu();
    
    // Initialize other features
    initPageLoader();
    initScrollToTop();
    initSmoothScroll();
    initHeaderScroll();
});

/**
 * Page loader - Hide after page is fully loaded
 */
function initPageLoader() {
    const loader = document.querySelector('.page-loader');
    
    if (loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.classList.add('page-loader--hidden');
                // Remove from DOM after transition
                setTimeout(() => {
                    loader.remove();
                }, 500);
            }, 300);
        });
    }
}

/**
 * Scroll to top button
 */
function initScrollToTop() {
    const scrollBtn = document.querySelector('.footer__scroll-top');
    
    if (!scrollBtn) return;
    
    // Show/hide button based on scroll position
    const toggleButton = () => {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('footer__scroll-top--visible');
        } else {
            scrollBtn.classList.remove('footer__scroll-top--visible');
        }
    };
    
    // Initial check
    toggleButton();
    
    // Listen to scroll with debounce for performance
    window.addEventListener('scroll', debounce(toggleButton, 100));
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if href is just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                // Get header height for offset
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                
                // Calculate position
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                // Scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, '', href);
                
                // Close mobile menu if open
                const mobileMenu = document.querySelector('.header__nav--mobile');
                if (mobileMenu && mobileMenu.classList.contains('nav--open')) {
                    document.body.classList.remove('menu-open');
                    mobileMenu.classList.remove('nav--open');
                    document.querySelector('.header__burger')?.classList.remove('header__burger--active');
                }
            }
        });
    });
}

/**
 * Header scroll effect
 * Add class to header when scrolled
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    
    if (!header) return;
    
    const toggleHeaderClass = () => {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    };
    
    // Initial check
    toggleHeaderClass();
    
    // Listen to scroll with debounce
    window.addEventListener('scroll', debounce(toggleHeaderClass, 50));
}

/**
 * Handle window resize
 * Update various components on resize
 */
let resizeTimer;
window.addEventListener('resize', () => {
    // Clear existing timer
    clearTimeout(resizeTimer);
    
    // Set new timer
    resizeTimer = setTimeout(() => {
        console.log('Window resized');
        
        // Close mobile menu on resize to desktop
        if (window.innerWidth >= 1024) {
            const mobileMenu = document.querySelector('.header__nav--mobile');
            if (mobileMenu && mobileMenu.classList.contains('nav--open')) {
                document.body.classList.remove('menu-open');
                mobileMenu.classList.remove('nav--open');
                document.querySelector('.header__burger')?.classList.remove('header__burger--active');
            }
        }
        
        // Recalculate scroll animations
        if (window.scrollAnimationObserver) {
            window.scrollAnimationObserver.disconnect();
            initScrollAnimations();
        }
    }, 250);
});

/**
 * Handle visibility change
 * Pause animations when tab is not visible
 */
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden - pausing animations');
        // Pause any ongoing animations or timers here
    } else {
        console.log('Page visible - resuming animations');
        // Resume animations or timers here
    }
});

/**
 * Detect touch device
 * Add class to html for touch-specific styles
 */
function detectTouchDevice() {
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.documentElement.classList.add('touch-device');
    } else {
        document.documentElement.classList.add('no-touch');
    }
}

detectTouchDevice();

/**
 * Log performance metrics (development only)
 */
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.addEventListener('load', () => {
        if (window.performance && window.performance.timing) {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            const connectTime = perfData.responseEnd - perfData.requestStart;
            const renderTime = perfData.domComplete - perfData.domLoading;
            
            console.log('📊 Performance Metrics:');
            console.log(`Page Load Time: ${pageLoadTime}ms`);
            console.log(`Server Connect Time: ${connectTime}ms`);
            console.log(`DOM Render Time: ${renderTime}ms`);
        }
    });
}

/**
 * Handle errors globally (development)
 */
window.addEventListener('error', (e) => {
    console.error('❌ JavaScript Error:', e.error);
});

/**
 * Export for external use if needed
 */
export {
    initPageLoader,
    initScrollToTop,
    initSmoothScroll,
    initHeaderScroll
};