/**
 * MOBILE MENU MODULE - A i' centrale
 * Handles mobile hamburger menu functionality
 */

let isMenuOpen = false;

/**
 * Initialize mobile menu
 */
export function initMobileMenu() {
    console.log('📱 Mobile menu module initialized');
    
    const burger = document.querySelector('.header__burger');
    const mobileNav = document.querySelector('.header__nav--mobile');
    const overlay = createOverlay();
    
    if (!burger || !mobileNav) {
        console.warn('Mobile menu elements not found');
        return;
    }
    
    // Toggle menu on burger click
    burger.addEventListener('click', () => {
        toggleMenu(burger, mobileNav, overlay);
    });
    
    // Close menu on overlay click
    overlay.addEventListener('click', () => {
        closeMenu(burger, mobileNav, overlay);
    });
    
    // Close menu on link click
    const mobileLinks = mobileNav.querySelectorAll('.nav__link');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu(burger, mobileNav, overlay);
        });
    });
    
    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu(burger, mobileNav, overlay);
        }
    });
    
    // Handle resize - close menu if window becomes desktop size
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth >= 1024 && isMenuOpen) {
                closeMenu(burger, mobileNav, overlay);
            }
        }, 250);
    });
}

/**
 * Create overlay element
 * @returns {HTMLElement} The overlay element
 */
function createOverlay() {
    let overlay = document.querySelector('.header__overlay');
    
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'header__overlay';
        document.body.appendChild(overlay);
    }
    
    return overlay;
}

/**
 * Toggle menu open/close
 * @param {HTMLElement} burger - Burger button element
 * @param {HTMLElement} mobileNav - Mobile navigation element
 * @param {HTMLElement} overlay - Overlay element
 */
function toggleMenu(burger, mobileNav, overlay) {
    if (isMenuOpen) {
        closeMenu(burger, mobileNav, overlay);
    } else {
        openMenu(burger, mobileNav, overlay);
    }
}

/**
 * Open mobile menu
 * @param {HTMLElement} burger - Burger button element
 * @param {HTMLElement} mobileNav - Mobile navigation element
 * @param {HTMLElement} overlay - Overlay element
 */
function openMenu(burger, mobileNav, overlay) {
    isMenuOpen = true;
    
    // Add classes
    burger.classList.add('header__burger--active');
    mobileNav.classList.add('nav--open');
    overlay.classList.add('header__overlay--visible');
    document.body.classList.add('menu-open');
    
    // Update ARIA attributes
    burger.setAttribute('aria-expanded', 'true');
    mobileNav.setAttribute('aria-hidden', 'false');
    
    // Focus first link for accessibility
    const firstLink = mobileNav.querySelector('.nav__link');
    if (firstLink) {
        setTimeout(() => {
            firstLink.focus();
        }, 300); // Wait for animation
    }
    
    console.log('Mobile menu opened');
}

/**
 * Close mobile menu
 * @param {HTMLElement} burger - Burger button element
 * @param {HTMLElement} mobileNav - Mobile navigation element
 * @param {HTMLElement} overlay - Overlay element
 */
function closeMenu(burger, mobileNav, overlay) {
    isMenuOpen = false;
    
    // Remove classes
    burger.classList.remove('header__burger--active');
    mobileNav.classList.remove('nav--open');
    overlay.classList.remove('header__overlay--visible');
    document.body.classList.remove('menu-open');
    
    // Update ARIA attributes
    burger.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    
    console.log('Mobile menu closed');
}

/**
 * Check if menu is open
 * @returns {boolean} Menu state
 */
export function isMenuOpen() {
    return isMenuOpen;
}

/**
 * Export functions
 */
export { toggleMenu, openMenu, closeMenu };