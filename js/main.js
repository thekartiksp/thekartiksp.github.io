// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');
const heroButtons = document.querySelectorAll('.hero-buttons .btn');

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Mobile Navigation Toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Close mobile menu
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Handle smooth scrolling
            handleSmoothScroll(e, link);
        });
    });

    // Handle hero button clicks
    heroButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            handleSmoothScroll(e, button);
        });
    });

    // Initialize animations
    initializeAnimations();
    
    // Setup form handling
    setupContactForm();
    
    // Setup scroll effects
    setupScrollEffects();
    
    // Setup hover effects
    setupHoverEffects();
    
    // Show page
    document.body.classList.add('loaded');
}

// Smooth scrolling function
function handleSmoothScroll(e, element) {
    e.preventDefault();
    
    const targetId = element.getAttribute('href');
    if (!targetId || !targetId.startsWith('#')) return;
    
    const targetSection = document.querySelector(targetId);
    if (!targetSection) return;
    
    const navbarHeight = 80;
    const targetPosition = targetSection.offsetTop - navbarHeight;
    
    // Smooth scroll to target
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
}

// Contact form setup
function setupContactForm() {
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form inputs
        const inputs = contactForm.querySelectorAll('input, textarea');
        const nameInput = contactForm.querySelector('input[placeholder="Your Name"]');
        const emailInput = contactForm.querySelector('input[placeholder="Your Email"]');
        const subjectInput = contactForm.querySelector('input[placeholder="Subject"]');
        const messageInput = contactForm.querySelector('textarea');
        
        // Validate form
        const errors = [];
        
        if (!nameInput.value.trim()) {
            errors.push('Name is required');
            nameInput.style.borderColor = 'var(--color-error)';
        } else {
            nameInput.style.borderColor = '';
        }
        
        if (!emailInput.value.trim()) {
            errors.push('Email is required');
            emailInput.style.borderColor = 'var(--color-error)';
        } else if (!isValidEmail(emailInput.value)) {
            errors.push('Please enter a valid email address');
            emailInput.style.borderColor = 'var(--color-error)';
        } else {
            emailInput.style.borderColor = '';
        }
        
        if (!subjectInput.value.trim()) {
            errors.push('Subject is required');
            subjectInput.style.borderColor = 'var(--color-error)';
        } else {
            subjectInput.style.borderColor = '';
        }
        
        if (!messageInput.value.trim()) {
            errors.push('Message is required');
            messageInput.style.borderColor = 'var(--color-error)';
        } else {
            messageInput.style.borderColor = '';
        }
        
        // Show errors if any
        if (errors.length > 0) {
            showNotification(errors.join('. '), 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('.btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            
            // Show success message
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            
            // Reset form and clear validation styles
            contactForm.reset();
            inputs.forEach(input => {
                input.style.borderColor = '';
            });
        }, 1500);
    });
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✓' : '⚠'}</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Inject styles if needed
    injectNotificationStyles();
    
    // Add to DOM
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide
    const autoHideTimer = setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Close button
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoHideTimer);
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

function injectNotificationStyles() {
    if (document.querySelector('#notification-styles')) return;
    
    const styles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-lg);
            padding: var(--space-16);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s var(--ease-standard);
            max-width: 400px;
        }
        
        .notification--success {
            border-left: 4px solid var(--color-success);
        }
        
        .notification--error {
            border-left: 4px solid var(--color-error);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: var(--space-12);
        }
        
        .notification-icon {
            font-weight: bold;
            font-size: var(--font-size-lg);
        }
        
        .notification--success .notification-icon {
            color: var(--color-success);
        }
        
        .notification--error .notification-icon {
            color: var(--color-error);
        }
        
        .notification-message {
            flex: 1;
            font-size: var(--font-size-base);
            color: var(--color-text);
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: var(--font-size-xl);
            color: var(--color-text-secondary);
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s var(--ease-standard);
        }
        
        .notification-close:hover {
            color: var(--color-text);
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .nav-link.active {
            color: var(--color-primary);
            position: relative;
        }
        
        .nav-link.active::after {
            content: '';
            position: absolute;
            bottom: -2px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--color-primary);
            border-radius: 1px;
        }
        
        body {
            opacity: 0;
            transition: opacity 0.5s var(--ease-standard);
        }
        
        body.loaded {
            opacity: 1;
        }
    `;
    
    const styleEl = document.createElement('style');
    styleEl.id = 'notification-styles';
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
}

// Setup scroll effects
function setupScrollEffects() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        // Navbar background on scroll
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(252, 252, 249, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(252, 252, 249, 0.95)';
            navbar.style.boxShadow = 'none';
        }
        
        // Active nav link highlighting
        updateActiveNavLink();
        
        // Parallax effect for hero
        const hero = document.querySelector('.hero');
        if (hero && window.scrollY < window.innerHeight) {
            const rate = window.scrollY * -0.3;
            hero.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Update active navigation link
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Setup hover effects
function setupHoverEffects() {
    // Portfolio card hover effects
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        const placeholder = card.querySelector('.portfolio-placeholder');
        
        card.addEventListener('mouseenter', () => {
            if (placeholder) {
                placeholder.style.transform = 'scale(1.1) rotate(5deg)';
                placeholder.style.transition = 'transform 0.3s var(--ease-standard)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (placeholder) {
                placeholder.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Skill card hover effects
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        const icon = card.querySelector('.skill-icon');
        
        card.addEventListener('mouseenter', () => {
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                icon.style.transition = 'transform 0.3s var(--ease-standard)';
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// Initialize animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Add animation classes and observe elements
    const sectionHeaders = document.querySelectorAll('.section-header');
    sectionHeaders.forEach(header => {
        header.classList.add('fade-in');
        observer.observe(header);
    });
    
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach((card, index) => {
        card.classList.add('fade-in');
        card.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(card);
    });
    
    const aboutText = document.querySelector('.about-text');
    if (aboutText) {
        aboutText.classList.add('slide-in-left');
        observer.observe(aboutText);
    }
    
    const contactInfo = document.querySelector('.contact-info');
    const contactFormEl = document.querySelector('.contact-form');
    
    if (contactInfo) {
        contactInfo.classList.add('slide-in-left');
        observer.observe(contactInfo);
    }
    
    if (contactFormEl) {
        contactFormEl.classList.add('slide-in-right');
        observer.observe(contactFormEl);
    }
}