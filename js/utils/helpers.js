/**
 * HELPER UTILITIES - A i' centrale
 * Reusable utility functions
 */

/**
 * Debounce function
 * Delays execution until after wait time has elapsed since last call
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait = 300) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function
 * Ensures function is called at most once per specified time period
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit = 300) {
    let inThrottle;
    
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Get element offset from top of page
 * @param {HTMLElement} element - Element to get offset for
 * @returns {number} Offset in pixels
 */
export function getElementOffset(element) {
    if (!element) return 0;
    
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    return rect.top + scrollTop;
}

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} offset - Offset in pixels (default: 0)
 * @returns {boolean} True if element is in viewport
 */
export function isInViewport(element, offset = 0) {
    if (!element) return false;
    
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= -offset &&
        rect.left >= -offset &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
    );
}

/**
 * Smooth scroll to element
 * @param {HTMLElement|string} target - Element or selector to scroll to
 * @param {number} offset - Offset in pixels (default: 0)
 * @param {number} duration - Duration in milliseconds (default: 500)
 */
export function smoothScrollTo(target, offset = 0, duration = 500) {
    const element = typeof target === 'string' ? document.querySelector(target) : target;
    
    if (!element) return;
    
    const targetPosition = getElementOffset(element) - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }
    
    requestAnimationFrame(animation);
}

/**
 * Format date to locale string
 * @param {Date|string} date - Date to format
 * @param {string} locale - Locale (default: 'it-IT')
 * @returns {string} Formatted date string
 */
export function formatDate(date, locale = 'it-IT') {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    return dateObj.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format time to locale string
 * @param {Date|string} time - Time to format
 * @param {string} locale - Locale (default: 'it-IT')
 * @returns {string} Formatted time string
 */
export function formatTime(time, locale = 'it-IT') {
    const timeObj = typeof time === 'string' ? new Date(time) : time;
    
    return timeObj.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Wait for specified time
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise} Promise that resolves after wait time
 */
export function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate unique ID
 * @param {string} prefix - Prefix for ID (default: 'id')
 * @returns {string} Unique ID
 */
export function generateId(prefix = 'id') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * Get query parameter from URL
 * @param {string} param - Parameter name
 * @returns {string|null} Parameter value or null
 */
export function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

/**
 * Set query parameter in URL
 * @param {string} param - Parameter name
 * @param {string} value - Parameter value
 */
export function setQueryParam(param, value) {
    const url = new URL(window.location);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url);
}

/**
 * Remove query parameter from URL
 * @param {string} param - Parameter name
 */
export function removeQueryParam(param) {
    const url = new URL(window.location);
    url.searchParams.delete(param);
    window.history.pushState({}, '', url);
}

/**
 * Check if device is mobile
 * @returns {boolean} True if mobile device
 */
export function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Check if device is touch-enabled
 * @returns {boolean} True if touch-enabled
 */
export function isTouchDevice() {
    return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
}

/**
 * Get device orientation
 * @returns {string} 'portrait' or 'landscape'
 */
export function getOrientation() {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
}

/**
 * Lock body scroll
 */
export function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = getScrollbarWidth() + 'px';
}

/**
 * Unlock body scroll
 */
export function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

/**
 * Get scrollbar width
 * @returns {number} Scrollbar width in pixels
 */
export function getScrollbarWidth() {
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    document.body.appendChild(outer);
    
    const inner = document.createElement('div');
    outer.appendChild(inner);
    
    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    
    return scrollbarWidth;
}

/**
 * Copy text to clipboard
 * @param {string} text - Text to copy
 * @returns {Promise<boolean>} True if successful
 */
export async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy:', err);
        return false;
    }
}

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

/**
 * Validate phone number (Italian format)
 * @param {string} phone - Phone to validate
 * @returns {boolean} True if valid
 */
export function isValidPhone(phone) {
    const regex = /^(\+39)?[\s]?([0-9]{2,4})[\s]?([0-9]{6,8})$/;
    return regex.test(phone);
}

/**
 * Truncate text
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export function truncate(text, length, suffix = '...') {
    if (text.length <= length) return text;
    return text.substring(0, length).trim() + suffix;
}

/**
 * Capitalize first letter
 * @param {string} text - Text to capitalize
 * @returns {string} Capitalized text
 */
export function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format currency (Euro)
 * @param {number} amount - Amount to format
 * @param {string} locale - Locale (default: 'it-IT')
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount, locale = 'it-IT') {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'EUR'
    }).format(amount);
}

/**
 * Log to console (development only)
 * @param {string} message - Message to log
 * @param {string} type - Log type (default: 'log')
 */
export function devLog(message, type = 'log') {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console[type](message);
    }
}