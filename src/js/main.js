// Main JavaScript File
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.initializeComponents();
        this.setupEventListeners();
        this.initializeAnimations();
        this.hideLoadingScreen();
    }

    initializeComponents() {
        this.navbar = new Navbar();
        this.hero = new Hero();
        this.skills = new Skills();
        this.projects = new Projects();
        this.testimonials = new Testimonials();
        this.contact = new Contact();
        this.theme = new ThemeManager();
        this.notifications = new NotificationManager();
        this.modal = new ModalManager();
        this.backToTop = new BackToTop();
    }

    setupEventListeners() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Update active navigation link on scroll
        window.addEventListener('scroll', () => {
            this.updateActiveNavLink();
            this.navbar.handleScroll();
            this.backToTop.handleScroll();
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    initializeAnimations() {
        // Initialize AOS (Animate On Scroll)
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });

        // Initialize counter animations
        this.initCounterAnimations();

        // Initialize skill progress bars
        this.skills.initProgressBars();
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
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

    handleResize() {
        // Handle responsive behavior
        if (window.innerWidth > 992) {
            this.navbar.closeMenu();
        }
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hide');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }
        }, 1000);
    }
}

// Navbar Component
class Navbar {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navClose = document.getElementById('nav-close');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.navToggle?.addEventListener('click', () => this.openMenu());
        this.navClose?.addEventListener('click', () => this.closeMenu());
        
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                this.closeMenu();
            }
        });
    }

    openMenu() {
        this.navMenu?.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.navMenu?.classList.remove('show');
        document.body.style.overflow = '';
    }

    handleScroll() {
        if (window.scrollY > 100) {
            this.navbar?.classList.add('scrolled');
        } else {
            this.navbar?.classList.remove('scrolled');
        }
    }
}

// Hero Component
class Hero {
    constructor() {
        this.initTypewriter();
    }

    initTypewriter() {
        const typed = new Typed('.typed-text', {
            strings: [
                'Full-stack Developer',
                'UI/UX Designer',
                'Web Developer',
                'Mobile Developer',
                'Tech Enthusiast'
            ],
            typeSpeed: 100,
            backSpeed: 60,
            backDelay: 1000,
            loop: true,
            showCursor: false
        });
    }
}

// Skills Component
class Skills {
    constructor() {
        this.skillCards = document.querySelectorAll('.skill-card');
        this.progressBars = document.querySelectorAll('.progress-bar');
    }

    initProgressBars() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressBar = entry.target.querySelector('.progress-bar');
                    if (progressBar) {
                        const width = progressBar.getAttribute('data-width');
                        setTimeout(() => {
                            progressBar.style.width = width;
                        }, 200);
                    }
                    observer.unobserve(entry.target);
                }
            });
        });

        this.skillCards.forEach(card => observer.observe(card));
    }
}

// Projects Component
class Projects {
    constructor() {
        this.projectCards = document.querySelectorAll('.project-card');
        this.setupProjectInteractions();
    }

    setupProjectInteractions() {
        this.projectCards.forEach(card => {
            const overlay = card.querySelector('.project-overlay');
            const image = card.querySelector('.project-image img');
            
            card.addEventListener('mouseenter', () => {
                image?.classList.add('scale');
            });
            
            card.addEventListener('mouseleave', () => {
                image?.classList.remove('scale');
            });
        });
    }
}

// Testimonials Component
class Testimonials {
    constructor() {
        this.testimonials = document.querySelectorAll('.testimonial-card');
        this.navDots = document.querySelectorAll('.nav-dot');
        this.currentSlide = 0;
        
        this.setupEventListeners();
        this.startAutoSlide();
    }

    setupEventListeners() {
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
    }

    goToSlide(index) {
        this.testimonials[this.currentSlide]?.classList.remove('active');
        this.navDots[this.currentSlide]?.classList.remove('active');
        
        this.currentSlide = index;
        
        this.testimonials[this.currentSlide]?.classList.add('active');
        this.navDots[this.currentSlide]?.classList.add('active');
    }

    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.testimonials.length;
        this.goToSlide(nextIndex);
    }

    startAutoSlide() {
        setInterval(() => {
            this.nextSlide();
        }, 5000);
    }
}

// Contact Component
class Contact {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.setupFormValidation();
    }

    setupFormValidation() {
        this.form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleFormSubmit();
        });

        // Real-time validation
        const inputs = this.form?.querySelectorAll('input, textarea');
        inputs?.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        let isValid = true;
        let message = '';

        switch (fieldName) {
            case 'name':
                if (!value) {
                    isValid = false;
                    message = 'Name is required';
                } else if (value.length < 2) {
                    isValid = false;
                    message = 'Name must be at least 2 characters';
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    isValid = false;
                    message = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    isValid = false;
                    message = 'Please enter a valid email';
                }
                break;
            case 'subject':
                if (!value) {
                    isValid = false;
                    message = 'Subject is required';
                }
                break;
            case 'message':
                if (!value) {
                    isValid = false;
                    message = 'Message is required';
                } else if (value.length < 10) {
                    isValid = false;
                    message = 'Message must be at least 10 characters';
                }
                break;
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    showFieldValidation(field, isValid, message) {
        const formGroup = field.closest('.form-group');
        const existingMessage = formGroup.querySelector('.form-message');
        
        // Remove existing message
        if (existingMessage) {
            existingMessage.remove();
        }

        // Remove existing classes
        formGroup.classList.remove('error', 'success');

        if (!isValid) {
            formGroup.classList.add('error');
            const messageEl = document.createElement('div');
            messageEl.className = 'form-message error';
            messageEl.textContent = message;
            formGroup.appendChild(messageEl);
        } else if (field.value.trim()) {
            formGroup.classList.add('success');
        }
    }

    clearFieldError(field) {
        const formGroup = field.closest('.form-group');
        const existingMessage = formGroup.querySelector('.form-message');
        
        if (existingMessage) {
            existingMessage.remove();
        }
        
        formGroup.classList.remove('error');
    }

    async handleFormSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Validate all fields
        const inputs = this.form.querySelectorAll('input, textarea');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        if (!isFormValid) {
            app.notifications.show('Please fix the errors in the form', 'error');
            return;
        }

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            app.notifications.show('Message sent successfully! I\'ll get back to you soon.', 'success');
            this.form.reset();
            
            // Clear all validation states
            inputs.forEach(input => {
                const formGroup = input.closest('.form-group');
                formGroup.classList.remove('error', 'success');
                const message = formGroup.querySelector('.form-message');
                if (message) message.remove();
            });
            
        } catch (error) {
            app.notifications.show('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
}

// Theme Manager
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('theme-toggle');
        this.currentTheme = localStorage.getItem('theme') || 'light';
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        this.updateThemeIcon();
    }

    setupEventListeners() {
        this.themeToggle?.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        localStorage.setItem('theme', this.currentTheme);
        this.updateThemeIcon();
    }

    updateThemeIcon() {
        const icon = this.themeToggle?.querySelector('i');
        if (icon) {
            icon.className = this.currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// Notification Manager
class NotificationManager {
    constructor() {
        this.container = document.getElementById('notification-container');
        this.notifications = [];
    }

    show(message, type = 'info', duration = 5000) {
        const notification = this.createNotification(message, type);
        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Trigger animation
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    createNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        notification.innerHTML = `
            <div class="notification-icon"></div>
            <div class="notification-content">
                <div class="notification-message">${message}</div>
            </div>
            <div class="notification-close"></div>
            <div class="notification-progress"></div>
        `;

        // Add close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => this.remove(notification));

        return notification;
    }

    remove(notification) {
        notification.classList.add('hide');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            this.notifications = this.notifications.filter(n => n !== notification);
        }, 300);
    }

    clear() {
        this.notifications.forEach(notification => this.remove(notification));
    }
}

// Modal Manager
class ModalManager {
    constructor() {
        this.modals = document.querySelectorAll('.modal');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Certificate modal
        window.showCertificate = () => {
            this.show('certificate-modal');
        };

        this.modals.forEach(modal => {
            const closeBtn = modal.querySelector('.modal-close');
            closeBtn?.addEventListener('click', () => this.hide(modal.id));

            // Close on backdrop click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hide(modal.id);
                }
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideAll();
            }
        });
    }

    show(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    hide(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    }

    hideAll() {
        this.modals.forEach(modal => {
            modal.classList.remove('show');
        });
        document.body.style.overflow = '';
    }
}

// Back to Top Button
class BackToTop {
    constructor() {
        this.button = document.getElementById('back-to-top');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.button?.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    handleScroll() {
        if (window.scrollY > 300) {
            this.button?.classList.add('show');
        } else {
            this.button?.classList.remove('show');
        }
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new PortfolioApp();
});

// Export for global access
window.PortfolioApp = PortfolioApp;