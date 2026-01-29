// Ensure page and all sections are visible (no blank content)
document.documentElement.style.opacity = '1';
document.body.style.opacity = '1';

// Respect reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Scroll progress bar (hidden when reduced motion)
const scrollProgress = document.getElementById('scrollProgress');
if (scrollProgress && !prefersReducedMotion) {
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    });
} else if (scrollProgress) {
    scrollProgress.style.display = 'none';
}

// Smooth scroll-triggered reveal: add reveal-section and stagger children
const revealSelector = '.exp-card, .skill-category, .project-card, .education-card, .creative-card';
const staggerStep = 100; // ms between each child – more noticeable cascade

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting || prefersReducedMotion) return;
        const section = entry.target;
        section.classList.add('reveal-section');
        section.querySelectorAll(revealSelector).forEach((el, i) => {
            el.style.transitionDelay = (i * staggerStep) + 'ms';
        });
    });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('section[id]:not(#hero)').forEach(section => {
    revealObserver.observe(section);
});

// Subtle hero parallax + scale on scroll (only when reduced motion is off)
if (!prefersReducedMotion) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const hero = document.getElementById('hero');
                const heroImage = document.querySelector('.hero-image .image-wrapper');
                const heroText = document.querySelector('.hero-text');
                if (scrolled < window.innerHeight) {
                    const progress = Math.min(scrolled / window.innerHeight, 1);
                    if (heroImage) heroImage.style.transform = 'translateY(' + scrolled * 0.15 + 'px)';
                    if (heroText) heroText.style.transform = 'scale(' + (1 - progress * 0.04) + ')';
                } else {
                    if (heroText) heroText.style.transform = 'scale(0.96)';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// No card/section hiding - all content stays visible (no blank sections)

// Enhanced Smooth scroll behavior with offset for header
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
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

// Card/category animations are handled by cardObserver (staggered per section) above

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

// Subtle hero parallax only (no opacity fade - keeps content visible)
let ticking = false;
window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const heroImage = document.querySelector('#hero .hero-image .image-wrapper');
            if (heroImage && scrolled < window.innerHeight) {
                heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
            }
            ticking = false;
        });
        ticking = true;
    }
});

// Sections stay visible (no blur/fade)

// Enhanced Interactive Project Cards with Smooth Micro-Interactions
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach((card, index) => {
    // Stagger animation delays
    card.style.animationDelay = `${index * 0.15}s`;
    
    // Subtle hover effect only (removed 3D tilt for new layout)
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
    
    // Keep magnetic effect for project links
    const projectLink = card.querySelector('.project-link');
    if (projectLink) {
        projectLink.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        projectLink.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    }
});

// Enhanced particle effect function
function createEnhancedParticles(x, y) {
    const particleCount = 8;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 4 + 2;
        const colors = [
            'rgba(196, 92, 38, 0.9)',
            'rgba(180, 83, 30, 0.9)',
            'rgba(160, 70, 22, 0.9)'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        particle.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            border-radius: 50%;
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            z-index: 9999;
            box-shadow: 0 0 10px ${color};
        `;
        document.body.appendChild(particle);
        
        const angle = (Math.PI * 2 * i) / particleCount;
        const velocity = 2 + Math.random() * 2;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let posX = 0;
        let posY = 0;
        let frame = 0;
        const maxFrames = 60;
        
        const animate = () => {
            frame++;
            posX += vx;
            posY += vy - frame * 0.05; // gravity effect
            particle.style.transform = `translate(${posX}px, ${posY}px) rotate(${frame * 10}deg)`;
            particle.style.opacity = 1 - (frame / maxFrames);
            
            if (frame < maxFrames) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        animate();
    }
}

// Legacy function for backwards compatibility
function createParticles(x, y) {
    createEnhancedParticles(x, y);
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
    background: #c45c26;
    color: #fff;
    border: 1px solid rgba(196, 92, 38, 0.4);
    border-radius: 50%;
    cursor: pointer;
    display: none;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    transition: transform 0.2s ease, box-shadow 0.2s ease;
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
    this.style.transform = 'scale(1.05)';
});
scrollTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
});

// Subtle cursor trail (skip if reduced motion)
if (!prefersReducedMotion) {
    let cursorTrail = [];
    let lastTrailTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTrailTime < 50) return;
        lastTrailTime = now;
        if (cursorTrail.length > 8) {
            const old = cursorTrail.shift();
            old.remove();
        }
        const trail = document.createElement('div');
        trail.style.cssText = `position:fixed;width:3px;height:3px;background:rgba(196,92,38,0.35);border-radius:50%;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:9998;opacity:0.35;animation:fadeOut 0.6s ease-out forwards;`;
        document.body.appendChild(trail);
        cursorTrail.push(trail);
    });
    const fadeOutStyle = document.createElement('style');
    fadeOutStyle.textContent = '@keyframes fadeOut{to{opacity:0;transform:scale(0)}}';
    document.head.appendChild(fadeOutStyle);
}

// Preload images
const images = document.querySelectorAll('img');
images.forEach(img => {
    const src = img.getAttribute('src');
    if (src) {
        const newImg = new Image();
        newImg.src = src;
    }
});

// Enhanced Creative Section Interactions
const creativeCard = document.querySelector('.creative-card');
if (creativeCard) {
    // Smooth mouse tracking for creative card
    creativeCard.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Subtle 3D tilt
        const rotateX = (y - centerY) / 30;
        const rotateY = (centerX - x) / 30;
        
        this.style.transform = `translateY(-12px) scale(1.02) perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    creativeCard.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
    
    // Animate creative samples on hover
    const creativeSamples = document.querySelectorAll('.creative-samples a');
    creativeSamples.forEach((sample, index) => {
        sample.style.animationDelay = `${0.9 + index * 0.1}s`;
        
        sample.addEventListener('mouseenter', function() {
            creativeSamples.forEach((other, i) => {
                if (other !== this) {
                    other.style.transform = 'scale(0.95)';
                    other.style.opacity = '0.6';
                }
            });
        });
        
        sample.addEventListener('mouseleave', function() {
            creativeSamples.forEach(other => {
                other.style.transform = '';
                other.style.opacity = '';
            });
        });
    });
}

// Page load
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    if (!prefersReducedMotion) createFloatingParticles();
});

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

// Experience cards: subtle hover on dot and content
document.querySelectorAll('.exp-card').forEach((card) => {
    const content = card.querySelector('.exp-card__content');
    const dot = card.querySelector('.exp-card__dot');
    if (!content || !dot) return;

    card.addEventListener('mouseenter', function() {
        dot.style.transform = 'scale(1.25)';
        dot.style.boxShadow = '0 0 0 6px rgba(196, 92, 38, 0.25)';
    });

    card.addEventListener('mouseleave', function() {
        dot.style.transform = '';
        dot.style.boxShadow = '';
    });
});

// Enhanced skill category animation on scroll with stagger
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('skill-visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.skill-category').forEach((skill, index) => {
    skill.style.animationDelay = `${index * 0.1}s`;
    skillObserver.observe(skill);
    
    // Add hover tracking effect
    skill.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;
        
        this.style.transform = `
            translateY(-8px) 
            scale(1.02) 
            perspective(1000px) 
            rotateY(${deltaX * 5}deg) 
            rotateX(${-deltaY * 5}deg)
        `;
    });
    
    skill.addEventListener('mouseleave', function() {
        this.style.transform = '';
    });
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

// Simple video player with native controls
document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('spaceVideo');
    
    if (video) {
        console.log('Video element found and ready');
        
        // Ensure controls are visible
        video.setAttribute('controls', 'controls');
        
        // Add error handling
        video.addEventListener('error', function(e) {
            console.error('Video loading error:', e);
        });
        
        // Log when video plays
        video.addEventListener('play', function() {
            console.log('Video is now playing');
        });
    } else {
        console.error('Video element not found');
    }
});

// Create play button overlay for other videos (optional enhancement)
document.querySelectorAll('.project-media video:not(#spaceVideo)').forEach(video => {
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
