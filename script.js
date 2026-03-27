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
// FORM VALIDATION & SOUMISSION (page contact)
// ============================================
const contactFormEl = document.getElementById('contactForm');
if (contactFormEl) {
    const submitBtn = contactFormEl.querySelector('.submit-btn');

    contactFormEl.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validation
        const requiredFields = contactFormEl.querySelectorAll('[required]');
        let isValid = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#f5576c';
            } else {
                field.style.borderColor = '#e2e8f0';
            }
        });

        if (!isValid) {
            showFormMessage('Veuillez remplir tous les champs obligatoires.', 'error');
            return;
        }

        // Soumission via Formspree
        submitBtn.textContent = 'Envoi en cours…';
        submitBtn.disabled = true;

        try {
            const formData = new FormData(contactFormEl);
            const action = contactFormEl.getAttribute('action');

            // Formspree — envoi AJAX
            const response = await fetch(action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                showFormMessage('Message envoyé ! Nous vous recontacterons sous 48h ouvrées.', 'success');
                contactFormEl.reset();
            } else {
                throw new Error('Erreur serveur');
            }
        } catch (err) {
            showFormMessage('Une erreur est survenue. Contactez-nous directement au 06 51 50 97 18.', 'error');
        } finally {
            submitBtn.textContent = 'Envoyer le Message';
            submitBtn.disabled = false;
        }
    });

    // Retirer la bordure rouge à la saisie
    contactFormEl.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', () => {
            input.style.borderColor = '#e2e8f0';
        });
    });
}

function showFormMessage(message, type) {
    const existing = document.getElementById('form-message');
    if (existing) existing.remove();

    const msg = document.createElement('div');
    msg.id = 'form-message';
    msg.style.cssText = `
        padding: 16px 20px;
        border-radius: 8px;
        margin-top: 15px;
        font-weight: 600;
        font-size: 15px;
        background: ${type === 'success' ? '#d1fae5' : '#fee2e2'};
        color: ${type === 'success' ? '#065f46' : '#991b1b'};
        border: 1px solid ${type === 'success' ? '#6ee7b7' : '#fca5a5'};
    `;
    msg.textContent = message;

    const form = document.getElementById('contactForm');
    if (form) form.after(msg);
    setTimeout(() => msg.remove(), 6000);
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
