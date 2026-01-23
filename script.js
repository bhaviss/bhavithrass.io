// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header scroll effect
const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const nav = document.getElementById('nav');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (nav.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Intersection Observer for animations
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

// Observe all animated elements
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.project-card, .skill-category, .education-card, .timeline-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Add active state to navigation based on scroll position
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.pageYOffset >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add typing effect to hero title (optional)
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    const text = heroTitle.innerHTML;
    heroTitle.innerHTML = '';
    heroTitle.style.opacity = '1';
    
    let index = 0;
    function typeWriter() {
        if (index < text.length) {
            heroTitle.innerHTML += text.charAt(index);
            index++;
            setTimeout(typeWriter, 50);
        }
    }
    
    // Start typing effect after a short delay
    setTimeout(typeWriter, 500);
}

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Interactive Project Cards with Subtle Click Effect
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    // Add subtle ripple effect on click
    card.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(59, 130, 246, 0.2) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.7s ease-out;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 700);
        
        // Subtle particle effect
        createParticles(e.clientX, e.clientY);
    });
});

// Subtle particle effect function
function createParticles(x, y) {
    for (let i = 0; i < 3; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 3px;
            height: 3px;
            background: rgba(59, 130, 246, 0.8);
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
        `;
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / 3;
        const velocity = 1.5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = 0;
        let posY = 0;
        const animate = () => {
            posX += vx;
            posY += vy;
            particle.style.transform = `translate(${posX}px, ${posY}px)`;
            particle.style.opacity = 1 - Math.abs(posX) / 40;
            
            if (Math.abs(posX) < 40) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        animate();
    }
}

// Add ripple animation to CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Copy email to clipboard
const emailLink = document.querySelector('a[href^="mailto:"]');
if (emailLink) {
    emailLink.addEventListener('click', (e) => {
        const email = emailLink.getAttribute('href').replace('mailto:', '');
        navigator.clipboard.writeText(email).then(() => {
            // Show a temporary tooltip or notification
            const originalText = emailLink.querySelector('span').textContent;
            emailLink.querySelector('span').textContent = 'Email copied!';
            setTimeout(() => {
                emailLink.querySelector('span').textContent = originalText;
            }, 2000);
        });
    });
}

// Enhanced scroll-to-top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%);
    color: #fff;
    border: 1px solid rgba(59, 130, 246, 0.5);
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
    transition: all 0.3s ease;
    z-index: 999;
    font-weight: 600;
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.style.display = 'flex';
    } else {
        scrollTopBtn.style.display = 'none';
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

scrollTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1) rotate(360deg)';
    this.style.boxShadow = '0 10px 30px rgba(59, 130, 246, 0.5)';
});

scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1) rotate(0deg)';
    this.style.boxShadow = '0 8px 20px rgba(59, 130, 246, 0.3)';
});

// Subtle animated cursor trail effect
let cursorTrail = [];
let lastTrailTime = 0;
document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastTrailTime < 50) return; // Throttle to reduce particles
    lastTrailTime = now;
    
    if (cursorTrail.length > 8) {
        const old = cursorTrail.shift();
        old.remove();
    }
    
    const trail = document.createElement('div');
    trail.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: rgba(59, 130, 246, 0.6);
        border-radius: 50%;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        pointer-events: none;
        z-index: 9998;
        opacity: 0.4;
        box-shadow: 0 0 6px rgba(59, 130, 246, 0.4);
        animation: fadeOut 0.6s ease-out forwards;
    `;
    
    document.body.appendChild(trail);
    cursorTrail.push(trail);
});

const fadeOutStyle = document.createElement('style');
fadeOutStyle.textContent = `
    @keyframes fadeOut {
        to {
            opacity: 0;
            transform: scale(0);
        }
    }
`;
document.head.appendChild(fadeOutStyle);

// Preload images
const images = document.querySelectorAll('img');
images.forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
        const newImg = new Image();
        newImg.src = src;
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    createFloatingParticles();
});

document.body.style.opacity = '0';
document.body.style.transition = 'opacity 0.5s ease';

// Create floating background particles
function createFloatingParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'floating-particles';
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        particleContainer.appendChild(particle);
    }
}

// Interactive hover effect for timeline items
document.querySelectorAll('.timeline-item').forEach((item, index) => {
    item.style.animationDelay = `${index * 0.1}s`;
    
    item.addEventListener('mouseenter', function() {
        this.querySelector('.timeline-dot').style.transform = 'scale(1.3)';
        this.querySelector('.timeline-dot').style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.6)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.querySelector('.timeline-dot').style.transform = 'scale(1)';
        this.querySelector('.timeline-dot').style.boxShadow = 'none';
    });
});

// Skill category animation on scroll
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.skill-category').forEach(skill => {
    skill.style.opacity = '0';
    skill.style.transform = 'translateY(30px)';
    skillObserver.observe(skill);
});

// Add glitch effect to hero title on hover
const heroTitle = document.querySelector('.hero-title');
if (heroTitle) {
    heroTitle.addEventListener('mouseenter', function() {
        this.style.animation = 'glitch 0.3s ease';
    });
}

const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
    @keyframes glitch {
        0%, 100% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
    }
`;
document.head.appendChild(glitchStyle);

// Project card click sound effect (visual feedback)
document.querySelectorAll('.project-card, .education-card, .skill-category').forEach(card => {
    card.addEventListener('click', function() {
        this.style.animation = 'pulse 0.3s ease';
        setTimeout(() => {
            this.style.animation = '';
        }, 300);
    });
});

const pulseStyle = document.createElement('style');
pulseStyle.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(pulseStyle);

// Lightbox Modal for Images and Videos
const modal = document.getElementById('mediaModal');
const modalImg = document.getElementById('modalImage');
const modalVideo = document.getElementById('modalVideo');
const modalVideoSource = document.getElementById('modalVideoSource');
const modalClose = document.querySelector('.modal-close');
const modalCaption = document.querySelector('.modal-caption');

// Open lightbox when clicking on project images or videos
document.addEventListener('DOMContentLoaded', function() {
    // Handle images
    document.querySelectorAll('.project-media img').forEach(img => {
        if (!img.closest('.media-placeholder')) {
            img.style.cursor = 'pointer';
            img.addEventListener('click', function() {
                modal.classList.add('active');
                modalImg.src = this.src;
                modalImg.style.display = 'block';
                modalVideo.style.display = 'none';
                modalCaption.innerHTML = this.alt || '';
                document.body.style.overflow = 'hidden';
            });
        }
    });

    // Handle videos - open in modal on click (not when playing controls)
    document.querySelectorAll('.project-media video').forEach(video => {
        const wrapper = video.closest('.project-media');
        wrapper.style.cursor = 'pointer';
        
        wrapper.addEventListener('click', function(e) {
            // Only open modal if clicking on video, not controls
            if (e.target === video || e.target === wrapper) {
                modal.classList.add('active');
                modalVideo.style.display = 'block';
                modalImg.style.display = 'none';
                modalVideoSource.src = video.querySelector('source').src;
                modalVideo.load();
                modalVideo.play();
                modalCaption.innerHTML = video.getAttribute('data-caption') || '';
                document.body.style.overflow = 'hidden';
            }
        });
    });
});

// Close modal
modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Close on Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

function closeModal() {
    modal.classList.remove('active');
    modalVideo.pause();
    modalVideo.currentTime = 0;
    document.body.style.overflow = 'auto';
}

// Add zoom effect to modal content on hover
modalImg.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.02)';
});

modalImg.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// Create play button overlay for videos (optional enhancement)
document.querySelectorAll('.project-media video').forEach(video => {
    const overlay = document.createElement('div');
    overlay.className = 'video-overlay';
    overlay.innerHTML = '<div class="play-button"><i class="fas fa-play"></i></div>';
    video.parentElement.appendChild(overlay);
    
    video.addEventListener('play', () => {
        overlay.style.opacity = '0';
    });
    
    video.addEventListener('pause', () => {
        overlay.style.opacity = '1';
    });
});
