/**
 * NAVIGATION MODULE - A i' centrale
 * Handles navigation active states and scroll spy
 */

/**
 * Initialize navigation
 */
export function initNavigation() {
    console.log('🧭 Navigation module initialized');
    
    initScrollSpy();
    initActiveLinks();
}

/**
 * Scroll Spy
 * Highlights navigation links based on current section in viewport
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');
    
    if (sections.length === 0 || navLinks.length === 0) {
        return;
    }
    
    // Options for Intersection Observer
    const options = {
        root: null,
        rootMargin: '-80px 0px -80% 0px', // Adjust based on header height
        threshold: 0
    };
    
    // Callback for intersection
    const callback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                updateActiveLink(sectionId);
            }
        });
    };
    
    // Create observer
    const observer = new IntersectionObserver(callback, options);
    
    // Observe all sections
    sections.forEach(section => {
        observer.observe(section);
    });
}

/**
 * Update active link in navigation
 * @param {string} sectionId - ID of the current section
 */
function updateActiveLink(sectionId) {
    const navLinks = document.querySelectorAll('.nav__link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        
        if (href === `#${sectionId}`) {
            link.classList.add('nav__link--active');
        } else {
            link.classList.remove('nav__link--active');
        }
    });
}

/**
 * Initialize active links on page load
 * Checks URL hash and highlights corresponding link
 */
function initActiveLinks() {
    const hash = window.location.hash;
    
    if (hash) {
        const sectionId = hash.substring(1); // Remove #
        updateActiveLink(sectionId);
    } else {
        // Default to first section (hero)
        const firstSection = document.querySelector('section[id]');
        if (firstSection) {
            updateActiveLink(firstSection.getAttribute('id'));
        }
    }
}

/**
 * Handle hash change
 * Update active link when URL hash changes
 */
window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash) {
        const sectionId = hash.substring(1);
        updateActiveLink(sectionId);
    }
});

/**
 * Export functions for external use
 */
export { updateActiveLink };