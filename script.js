// ============================================
// NAVIGATION
// ============================================

const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');

    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    if (navMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translateY(12px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translateY(-12px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // Height of fixed navbar
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// FLOATING CTA BUTTON
// ============================================

const floatingCta = document.getElementById('floatingCta');
const heroSection = document.querySelector('.hero');
const formSection = document.getElementById('apply');

window.addEventListener('scroll', () => {
    const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const formTop = formSection.offsetTop;
    const scrollPosition = window.scrollY + window.innerHeight;

    // Show floating CTA after hero section and hide before form section
    if (window.scrollY > heroBottom && scrollPosition < formTop + 200) {
        floatingCta.classList.add('visible');
    } else {
        floatingCta.classList.remove('visible');
    }
});

// ============================================
// AOS ANIMATION INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        offset: 50,
        delay: 50
    });

    // Initialize Feather Icons after DOM is ready
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
});

// Clean up manual styles since AOS handles this now
const animatedElements = document.querySelectorAll('.about-card, .benefit-card, .timeline-item, .profile-item');
animatedElements.forEach(el => {
    el.style.opacity = '';
    el.style.transform = '';
    el.style.transition = '';
});

// ============================================
// FORM HANDLING
// ============================================

const applicationForm = document.getElementById('applicationForm');
const successModal = document.getElementById('successModal');
const fileInput = document.getElementById('pitchDeck');
const fileUploadLabel = document.querySelector('.file-upload-label .upload-text');

// File upload display
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        const fileName = e.target.files[0].name;
        fileUploadLabel.textContent = fileName;
        fileUploadLabel.style.color = 'var(--accent-color)';
    } else {
        fileUploadLabel.textContent = 'Click to upload or drag and drop';
        fileUploadLabel.style.color = '';
    }
});

// Form validation and submission
applicationForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validate checkboxes
    const checkboxes = document.querySelectorAll('input[name="seeking"]:checked');
    if (checkboxes.length === 0) {
        alert('Please select at least one option for what you are seeking.');
        return;
    }

    // Get form data
    const formData = new FormData(applicationForm);

    // Submit to Formspree
    try {
        const response = await fetch('https://formspree.io/f/mzddozby', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Show success modal
            successModal.classList.add('active');

            // Reset form
            applicationForm.reset();
            fileUploadLabel.textContent = 'Click to upload or drag and drop';
            fileUploadLabel.style.color = '';
            
            console.log('Form submitted successfully to Formspree');
        } else {
            const data = await response.json();
            if (data.errors) {
                alert('Oops! There was a problem submitting your form: ' + data.errors.map(error => error.message).join(', '));
            } else {
                alert('Oops! There was a problem submitting your form. Please try again.');
            }
        }
    } catch (error) {
        alert('There was an error submitting your application. Please check your internet connection and try again.');
        console.error('Error:', error);
    }
});

// Close modal
function closeModal() {
    successModal.classList.remove('active');
}

// Close modal when clicking outside
successModal.addEventListener('click', (e) => {
    if (e.target === successModal) {
        closeModal();
    }
});

// ============================================
// FORM INPUT EFFECTS
// ============================================

const formInputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');

formInputs.forEach(input => {
    // Add focus effect
    input.addEventListener('focus', () => {
        input.parentElement.style.transform = 'translateY(-2px)';
    });

    input.addEventListener('blur', () => {
        input.parentElement.style.transform = 'translateY(0)';
    });
});

// ============================================
// COUNTER ANIMATION FOR STATS
// ============================================

function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const isNumber = !isNaN(target);

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            if (isNumber) {
                element.textContent = Math.floor(current);
            }
        }
    }, 16);
}

// Observe stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
            entry.target.dataset.animated = 'true';
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                // Only animate if it's a number
                if (!isNaN(text)) {
                    animateCounter(stat, parseInt(text));
                }
            });
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// PARALLAX EFFECT FOR HERO SHAPES
// ============================================

window.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        shape.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================

const sections = document.querySelectorAll('section[id]');

function highlightNavLink() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavLink);

// ============================================
// LOADING ANIMATION
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// PREVENT FORM RESUBMISSION
// ============================================

if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ============================================
// KEYBOARD ACCESSIBILITY
// ============================================

document.addEventListener('keydown', (e) => {
    // Close modal with Escape key
    if (e.key === 'Escape' && successModal.classList.contains('active')) {
        closeModal();
    }

    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        const spans = hamburger.querySelectorAll('span');
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%c🚀 Monthly Live Webinar Pitch', 'font-size: 20px; font-weight: bold; color: #2563eb;');
console.log('%cWelcome to the platform! Ready to pitch your business?', 'font-size: 14px; color: #64748b;');
console.log('%c💡 Form submissions are logged to console in development mode', 'font-size: 12px; color: #f59e0b; font-style: italic;');
