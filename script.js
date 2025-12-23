// ============================================
// MOBILE MENU
// ============================================
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const dropdowns = document.querySelectorAll('.dropdown');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// Dropdown sur mobile
dropdowns.forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
            e.preventDefault();
            dropdown.classList.toggle('active');
        }
    });
});

// Fermer le menu mobile quand on clique sur un lien
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// ============================================
// HERO SLIDER
// ============================================
const slides = document.querySelectorAll('.hero-slide');
const indicators = document.querySelectorAll('.indicator');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    // Retirer la classe active de tous les slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Ajouter la classe active au slide et indicateur courant
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

function startSlider() {
    slideInterval = setInterval(nextSlide, 5000); // Change toutes les 5 secondes
}

function stopSlider() {
    clearInterval(slideInterval);
}

// Démarrer le slider automatiquement
if (slides.length > 0) {
    startSlider();
    
    // Clic sur les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentSlide = index;
            showSlide(currentSlide);
            stopSlider();
            startSlider(); // Redémarrer le timer
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observer les cartes de service
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observer les logos clients
const clientLogos = document.querySelectorAll('.client-logo');
clientLogos.forEach((logo, index) => {
    logo.style.opacity = '0';
    logo.style.transform = 'scale(0.9)';
    logo.style.transition = `all 0.5s ease ${index * 0.05}s`;
    observer.observe(logo);
});

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#services') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
let lastScroll = 0;
const header = document.querySelector('.main-header');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// COUNTER ANIMATION (Stats)
// ============================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    const isDecimal = target.toString().includes('.');
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = isDecimal ? target.toFixed(1) : target;
            clearInterval(timer);
        } else {
            element.textContent = isDecimal ? start.toFixed(1) : Math.floor(start);
        }
    }, 16);
}

// Observer pour les stats
const statNumbers = document.querySelectorAll('.stat-number');
let statsAnimated = false;

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
            statsAnimated = true;
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const value = parseFloat(text.replace(/[^0-9.]/g, ''));
                animateCounter(stat, value);
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ============================================
// FORM VALIDATION (pour la page contact)
// ============================================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        let isValid = true;
        
        // Validation simple
        formData.forEach((value, key) => {
            if (!value.trim()) {
                isValid = false;
                const input = contactForm.querySelector(`[name="${key}"]`);
                input.style.borderColor = 'red';
            }
        });
        
        if (isValid) {
            // Afficher un message de succès
            alert('Message envoyé avec succès ! Nous vous recontacterons rapidement.');
            contactForm.reset();
        } else {
            alert('Veuillez remplir tous les champs obligatoires.');
        }
    });
    
    // Retirer la bordure rouge lors de la saisie
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = '#e2e8f0';
        });
    });
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
const images = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ============================================
// YEAR AUTO UPDATE (Footer)
// ============================================
const yearElement = document.querySelector('.current-year');
if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

// ============================================
// CONSOLE MESSAGE
// ============================================
console.log('%c🚀 Site CCFA - Développé avec attention', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%cPour toute question : samir@chikhi.fr', 'color: #718096; font-size: 12px;');
