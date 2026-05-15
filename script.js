(function () {
    'use strict';

    document.documentElement.style.opacity = '1';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lenis = null;

    var scrollProgress = document.getElementById('scrollProgress');
    var scrollProgressBar = scrollProgress ? scrollProgress.querySelector('.scroll-progress__bar') : null;
    var useCssScrollProgress =
        !prefersReducedMotion &&
        typeof CSS !== 'undefined' &&
        typeof CSS.supports === 'function' &&
        (CSS.supports('animation-timeline', 'scroll()') ||
            CSS.supports('animation-timeline', 'scroll(root)'));
    if (useCssScrollProgress && scrollProgress) {
        scrollProgress.classList.add('scroll-progress--sd');
    }

    var header = document.getElementById('header');
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('#siteMenuOverlay .site-menu__links a[href^="#"]');
    var nav = document.getElementById('nav');
    var siteMenuToggle = document.getElementById('siteMenuToggle');
    var siteMenu = document.getElementById('siteMenuOverlay');
    var siteMenuClose = document.getElementById('siteMenuClose');

    function onScrollUpdate(y) {
        if (!prefersReducedMotion) {
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var scrollUnit = docHeight > 0 ? Math.min(1, Math.max(0, y / docHeight)) : 0;
            document.documentElement.style.setProperty('--scroll', String(scrollUnit));
            if (scrollProgress) {
                if (useCssScrollProgress && scrollProgressBar) {
                    scrollProgress.style.width = '100%';
                    scrollProgress.style.transition = 'none';
                } else {
                    scrollProgress.style.width = scrollUnit * 100 + '%';
                }
            }
        } else if (scrollProgress) {
            var dh = document.documentElement.scrollHeight - window.innerHeight;
            var p = dh > 0 ? (y / dh) * 100 : 0;
            scrollProgress.style.width = p + '%';
        }
        if (header) {
            header.classList.toggle('scrolled', y > 80);
        }
        var current = '';
        sections.forEach(function (section) {
            if (y >= section.offsetTop - 120) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + current);
        });
        if (!prefersReducedMotion) {
            var heroImage = document.querySelector('.hero-image .image-wrapper');
            var heroText = document.querySelector('.hero-text');
            if (y < window.innerHeight) {
                var progress = Math.min(y / window.innerHeight, 1);
                if (heroImage) heroImage.style.transform = 'translateY(' + y * 0.12 + 'px)';
                if (heroText) heroText.style.transform = 'scale(' + (1 - progress * 0.02) + ')';
            } else if (heroText) {
                heroText.style.transform = 'scale(0.98)';
            }
        }
        if (scrollTopBtn) {
            scrollTopBtn.style.display = y > 400 ? 'flex' : 'none';
        }
    }

    function bindScrollUpdates() {
        if (prefersReducedMotion) {
            if (scrollProgress) scrollProgress.style.display = 'none';
            window.addEventListener('scroll', function () {
                onScrollUpdate(window.pageYOffset);
            }, { passive: true });
            onScrollUpdate(window.pageYOffset);
            return;
        }
        if (lenis) {
            lenis.on('scroll', function (l) {
                onScrollUpdate(l.scroll);
            });
            onScrollUpdate(lenis.scroll);
        } else {
            window.addEventListener('scroll', function () {
                onScrollUpdate(window.pageYOffset);
            }, { passive: true });
            onScrollUpdate(window.pageYOffset);
        }
    }

    var scrollTopBtn = document.createElement('button');
    scrollTopBtn.type = 'button';
    scrollTopBtn.setAttribute('aria-label', 'Back to top');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);

    scrollTopBtn.addEventListener('click', function () {
        if (lenis) {
            lenis.scrollTo(0, {
                duration: 1.1,
                easing: function (t) {
                    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                }
            });
        } else {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
        }
    });

    function initLenis() {
        if (prefersReducedMotion || typeof window.Lenis === 'undefined') {
            bindScrollUpdates();
            return;
        }
        lenis = new window.Lenis({
            lerp: 0.035,
            wheelMultiplier: 0.55,
            touchMultiplier: 1.15,
            smoothWheel: true,
            syncTouch: false,
            autoRaf: true
        });
        bindScrollUpdates();
    }

    initLenis();

    function setSiteMenuOpen(open) {
        if (!siteMenu || !siteMenuToggle) return;
        siteMenu.classList.toggle('is-open', open);
        siteMenu.setAttribute('aria-hidden', open ? 'false' : 'true');
        siteMenuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        var label = siteMenuToggle.querySelector('.site-menu-toggle__label');
        if (label) {
            label.textContent = open ? label.getAttribute('data-close') : label.getAttribute('data-open');
        }
        document.body.style.overflow = open ? 'hidden' : '';
        if (open && siteMenuClose) {
            window.setTimeout(function () {
                siteMenuClose.focus();
            }, 60);
        }
    }

    if (siteMenuToggle && siteMenu) {
        siteMenuToggle.addEventListener('click', function () {
            setSiteMenuOpen(!siteMenu.classList.contains('is-open'));
        });
        if (siteMenuClose) {
            siteMenuClose.addEventListener('click', function () {
                setSiteMenuOpen(false);
            });
        }
        var backdrop = siteMenu.querySelector('.site-menu__backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', function () {
                setSiteMenuOpen(false);
            });
        }
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        if (siteMenu && siteMenu.classList.contains('is-open')) {
            setSiteMenuOpen(false);
        }
    });

    (function () {
        var projectsGrid = document.getElementById('projectsContainer');
        if (!projectsGrid || prefersReducedMotion) return;
        function syncProjectsHScroll() {
            var max = projectsGrid.scrollWidth - projectsGrid.clientWidth;
            var t = max > 0 ? projectsGrid.scrollLeft / max : 0;
            projectsGrid.style.setProperty('--projects-hscroll', String(t));
        }
        projectsGrid.addEventListener('scroll', syncProjectsHScroll, { passive: true });
        window.addEventListener('resize', syncProjectsHScroll, { passive: true });
        syncProjectsHScroll();
    })();

    /* Section reveal — stagger children; unobserve after first trigger */
    var revealSelector = [
        '.section-title',
        '.section-sub',
        '.about-lead',
        '.about-text',
        '.story-eyebrow',
        '.exp-item',
        '.skill-category',
        '.project-card',
        '.education-card',
        '.contact-intro',
        '.projects-github-wrap',
        '.certifications',
        '.story-step'
    ].join(',');
    var staggerStep = 85;
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting || prefersReducedMotion) return;
            var section = entry.target;
            section.classList.add('reveal-section');
            var animated = section.querySelectorAll(revealSelector);
            var maxDelay = 0;
            animated.forEach(function (el, i) {
                if (
                    (section.id === 'projects' && el.classList.contains('project-card')) ||
                    (section.id === 'experience' && el.classList.contains('exp-item')) ||
                    (section.id === 'skills' && el.classList.contains('skill-category')) ||
                    (section.id === 'story' && el.classList.contains('story-step'))
                ) {
                    return;
                }
                var d = i * staggerStep;
                el.style.transitionDelay = d + 'ms';
                if (d > maxDelay) maxDelay = d;
            });
            window.setTimeout(function () {
                animated.forEach(function (el) {
                    el.style.transitionDelay = '';
                });
            }, Math.max(maxDelay + 1200, (section.id === 'projects' || section.id === 'experience' || section.id === 'skills' || section.id === 'story') ? 1900 : 0));
            revealObserver.unobserve(section);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('section[id]:not(#hero)').forEach(function (section) {
        revealObserver.observe(section);
    });

    /* In-page navigation — smooth scroll + optional View Transition (studio-style polish) */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            var headerOffset = 80;

            function runScroll() {
                if (nav && siteMenu) {
                    setSiteMenuOpen(false);
                }
                if (lenis) {
                    lenis.scrollTo(target, {
                        offset: -headerOffset,
                        duration: 1.55,
                        easing: function (t) {
                            return 1 - Math.pow(1 - t, 3);
                        }
                    });
                } else {
                    var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                }
            }

            if (!prefersReducedMotion && typeof document.startViewTransition === 'function') {
                document.startViewTransition(runScroll);
            } else {
                runScroll();
            }
        });
    });

    /* Experience read more */
    function initExperienceReadMore() {
        var experienceSection = document.getElementById('experience');
        if (!experienceSection) return;
        experienceSection.addEventListener('click', function (e) {
            var btn = e.target.closest ? e.target.closest('.exp-more') : null;
            if (!btn) return;
            e.preventDefault();
            e.stopPropagation();
            var item = btn.closest('.exp-item');
            if (!item) return;
            var points = item.querySelector('.exp-points');
            var isOpen = item.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            var textEl = btn.querySelector('.exp-more-text');
            if (textEl) textEl.textContent = isOpen ? 'Read less' : 'Read more';
            if (points) {
                points.style.maxHeight = isOpen ? (points.scrollHeight + 40) + 'px' : '0';
            }
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initExperienceReadMore);
    } else {
        initExperienceReadMore();
    }

    function lenisPause() {
        if (lenis) lenis.stop();
    }

    function lenisResume() {
        if (lenis) lenis.start();
    }

    /* Experience summary modal */
    (function () {
        var expOpenBtn = document.getElementById('expOpenTxtBtn');
        var expModal = document.getElementById('experienceModal');
        var expModalClose = document.getElementById('experienceModalClose');
        var expModalBackdrop = expModal && expModal.querySelector('.experience-modal-backdrop');
        var expTxtContent = document.getElementById('experienceTxtContent');

        function buildExperienceTxt() {
            var items = document.querySelectorAll('#experience .exp-item');
            if (!items.length || !expTxtContent) return '';
            var lines = [];
            items.forEach(function (item) {
                var date = item.querySelector('.exp-date');
                var badge = item.querySelector('.exp-badge');
                var role = item.querySelector('.exp-role');
                var company = item.querySelector('.exp-company');
                var tags = item.querySelector('.exp-tags');
                var points = item.querySelectorAll('.exp-points li');
                if (date) lines.push(date.textContent.trim());
                if (badge) lines.push('  ' + badge.textContent.trim());
                if (role) lines.push(role.textContent.trim());
                if (company) lines.push(company.textContent.trim());
                if (tags) lines.push(tags.textContent.trim());
                points.forEach(function (li) {
                    lines.push('  • ' + li.textContent.trim());
                });
                lines.push('');
            });
            return lines.join('\n');
        }

        function openExperienceModal() {
            if (!expModal || !expTxtContent) return;
            expTxtContent.textContent = buildExperienceTxt();
            expModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            lenisPause();
        }

        function closeExperienceModal() {
            if (!expModal) return;
            expModal.classList.remove('active');
            document.body.style.overflow = '';
            lenisResume();
        }

        if (expOpenBtn) expOpenBtn.addEventListener('click', openExperienceModal);
        if (expModalClose) expModalClose.addEventListener('click', closeExperienceModal);
        if (expModalBackdrop) expModalBackdrop.addEventListener('click', closeExperienceModal);
    })();

    /* Contact form — Formspree */
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        var formAction = contactForm.getAttribute('action') || 'https://formspree.io/f/meekznkg';
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var feedback = document.getElementById('formFeedback');
            var btn = document.getElementById('formSubmitBtn');
            var replyToEl = document.getElementById('contact-replyto');
            if (!feedback || !btn) return;
            feedback.textContent = '';
            feedback.className = 'form-feedback';
            btn.disabled = true;
            btn.textContent = 'Sending…';

            var emailInput = contactForm.querySelector('[name="email"]');
            if (replyToEl && emailInput) replyToEl.value = emailInput.value || '';

            fetch(formAction, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { Accept: 'application/json' }
            })
                .then(function (res) {
                    if (res.ok) {
                        feedback.textContent = 'Message sent! I’ll get back to you soon.';
                        feedback.className = 'form-feedback form-feedback-success';
                        contactForm.reset();
                        return;
                    }
                    return res.json().then(function (data) {
                        feedback.textContent = (data && data.error) ? data.error : 'Something went wrong. Please email bhavithrass@gmail.com';
                        feedback.className = 'form-feedback form-feedback-error';
                    }).catch(function () {
                        feedback.textContent = 'Something went wrong. Please email bhavithrass@gmail.com';
                        feedback.className = 'form-feedback form-feedback-error';
                    });
                })
                .catch(function () {
                    feedback.textContent = 'Network error. Please email bhavithrass@gmail.com';
                    feedback.className = 'form-feedback form-feedback-error';
                })
                .finally(function () {
                    btn.disabled = false;
                    btn.textContent = 'Send message';
                });
        });
    }

    /* Media lightbox */
    var modal = document.getElementById('mediaModal');
    var modalImg = document.getElementById('modalImage');
    var modalVideo = document.getElementById('modalVideo');
    var modalVideoSource = document.getElementById('modalVideoSource');
    var modalClose = document.querySelector('.modal-close');
    var modalCaption = document.querySelector('.modal-caption');

    function closeModal() {
        if (!modal) return;
        modal.classList.remove('active');
        if (modalVideo) {
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
        document.body.style.overflow = '';
        lenisResume();
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', function (e) {
            if (e.target === modal) closeModal();
        });
    }

    document.addEventListener('keydown', function (e) {
        if (e.key !== 'Escape') return;
        var expModal = document.getElementById('experienceModal');
        if (expModal && expModal.classList.contains('active')) {
            expModal.classList.remove('active');
            document.body.style.overflow = '';
            lenisResume();
            return;
        }
        if (modal && modal.classList.contains('active')) closeModal();
    });

    document.addEventListener('DOMContentLoaded', function () {
        if (!modal || !modalImg || !modalVideo || !modalVideoSource) return;

        document.querySelectorAll('.project-media img').forEach(function (img) {
            if (img.closest('.media-placeholder')) return;
            img.addEventListener('click', function () {
                modal.classList.add('active');
                modalImg.src = this.src;
                modalImg.style.display = 'block';
                modalVideo.style.display = 'none';
                if (modalCaption) modalCaption.textContent = this.alt || '';
                document.body.style.overflow = 'hidden';
                lenisPause();
            });
        });

        document.querySelectorAll('.project-media video').forEach(function (video) {
            var wrapper = video.closest('.project-media');
            if (!wrapper) return;
            wrapper.addEventListener('click', function (e) {
                if (e.target !== video && e.target !== wrapper) return;
                var source = video.querySelector('source');
                if (!source) return;
                modal.classList.add('active');
                modalVideo.style.display = 'block';
                modalImg.style.display = 'none';
                modalVideoSource.src = source.src;
                modalVideo.load();
                modalVideo.play().catch(function () {});
                if (modalCaption) modalCaption.textContent = video.getAttribute('data-caption') || '';
                document.body.style.overflow = 'hidden';
                lenisPause();
            });
        });
    });

    window.addEventListener('load', function () {
        document.body.style.opacity = '1';
    });
})();
