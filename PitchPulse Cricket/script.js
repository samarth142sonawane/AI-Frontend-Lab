// ========================================
// SMOOTH SCROLLING AND NAVIGATION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');

    // Mobile menu toggle
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            navMenu.classList.remove('active');
            
            // Update active nav link
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Smooth scroll and update active nav on scroll
    window.addEventListener('scroll', function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // Prevent default behavior for nav links and use smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const savedTheme = localStorage.getItem('pitchpulseTheme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme ? savedTheme : (prefersDark ? 'dark' : 'light');

    const setTheme = (theme) => {
        const isLight = theme === 'light';
        document.body.classList.toggle('light-mode', isLight);
        themeToggle.textContent = isLight ? 'Dark' : 'Light';
        themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} mode`);
    };

    setTheme(initialTheme);

    themeToggle.addEventListener('click', function() {
        const nextTheme = document.body.classList.contains('light-mode') ? 'dark' : 'light';
        setTheme(nextTheme);
        localStorage.setItem('pitchpulseTheme', nextTheme);
    });
});

// ========================================
// SERIES TABS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const activeContent = document.getElementById(tabName + '-tab');
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // Set first tab as active by default
    if (tabButtons.length > 0) {
        tabButtons[0].classList.add('active');
        tabContents[0].classList.add('active');
    }
});

// ========================================
// ANIMATED COUNTERS
// ========================================

class AnimatedCounter {
    constructor(element) {
        this.element = element;
        this.target = parseInt(element.getAttribute('data-target'));
        this.current = 0;
        this.increment = this.target / 100;
        this.speed = 30;
        this.hasAnimated = false;
    }

    animate() {
        if (this.current < this.target) {
            this.current += this.increment;
            this.element.textContent = Math.floor(this.current).toLocaleString();
            setTimeout(() => this.animate(), this.speed);
        } else {
            this.element.textContent = this.target.toLocaleString();
        }
    }

    startIfVisible() {
        if (this.hasAnimated) return;

        const rect = this.element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            this.hasAnimated = true;
            this.animate();
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const counterElements = document.querySelectorAll('.counter-number');
    const counters = Array.from(counterElements).map(el => new AnimatedCounter(el));

    // Check on load
    counters.forEach(counter => counter.startIfVisible());

    // Check on scroll
    window.addEventListener('scroll', function() {
        counters.forEach(counter => counter.startIfVisible());
    });

    // Check on resize
    window.addEventListener('resize', function() {
        counters.forEach(counter => counter.startIfVisible());
    });
});

// ========================================
// SCROLL REVEAL ANIMATIONS
// ========================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.addEventListener('DOMContentLoaded', function() {
    const elementsToObserve = document.querySelectorAll(
        '.match-card, .news-card, .league-card, .series-card, .ranking-card, .counter-card'
    );
    
    elementsToObserve.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        observer.observe(element);
    });
});

// ========================================
// CTA BUTTON INTERACTION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            const analyticsSection = document.getElementById('live-score');
            if (analyticsSection) {
                analyticsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// ========================================
// READ MORE BUTTONS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    
    readMoreButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const newsCard = this.closest('.news-card');
            
            // Simple animation feedback
            this.textContent = 'Opening...';
            setTimeout(() => {
                this.textContent = 'Read More →';
            }, 600);
        });
    });
});

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================

let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > 100) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 188, 212, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ========================================
// MATCH CARD INTERACTION
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const matchCards = document.querySelectorAll('.match-card');
    
    matchCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const scores = this.querySelectorAll('.team-score');
            scores.forEach(score => {
                score.style.animation = 'pulse 0.6s ease';
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const scores = this.querySelectorAll('.team-score');
            scores.forEach(score => {
                score.style.animation = 'none';
            });
        });
    });
});

// ========================================
// KEYBOARD NAVIGATION
// ========================================

document.addEventListener('keydown', function(e) {
    // Press 'h' to scroll to home
    if (e.key === 'h' || e.key === 'H') {
        const homeSection = document.getElementById('home');
        if (homeSection) {
            homeSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    // Press 'f' to scroll to footer
    if (e.key === 'f' || e.key === 'F') {
        const footer = document.querySelector('.footer');
        if (footer) {
            footer.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

// Debounce function for scroll events
function debounce(func, wait) {
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

// ========================================
// INITIALIZE
// ========================================

console.log('PitchPulse Cricket Analytics - Loaded Successfully');
console.log('Keyboard Shortcuts: Press "H" to go home, "F" to go to footer');
