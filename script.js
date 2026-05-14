(function () {
    'use strict';

    document.documentElement.style.opacity = '1';
    document.body.style.opacity = '1';

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var lenis = null;

    var scrollProgress = document.getElementById('scrollProgress');
    var header = document.getElementById('header');
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('nav a');
    var nav = document.getElementById('nav');
    var mobileMenuBtn = document.getElementById('mobileMenuBtn');

    var STORY_CHAPTERS = [
        { id: 'hero', n: '01', kicker: 'Opening', line: 'What I build in AI, data, and the cloud—and a QR so you can reopen this portfolio after Upper Bound or from LinkedIn.' },
        { id: 'about', n: '02', kicker: 'Who I am', line: 'The bridge between research curiosity and systems that have to work in production.' },
        { id: 'experience', n: '03', kicker: 'The path', line: 'Teaching, data platforms, cloud ops, and research—how the chapters so far shaped the work I do today.' },
        { id: 'projects', n: '04', kicker: 'Proof in the work', line: 'From multimodal space sensing to attendance systems and vision pipelines—things I shipped, not just slides.' },
        { id: 'skills', n: '05', kicker: 'The toolkit', line: 'The languages, clouds, and ML stacks I reach for when it is time to turn ideas into running software.' },
        { id: 'education', n: '06', kicker: 'The foundation', line: 'Coursework, GPA, and certifications that sit underneath the projects you just scrolled.' },
        { id: 'creative', n: '07', kicker: 'Beyond the terminal', line: 'Campaigns and content when storytelling and design matter as much as the algorithm.' },
        { id: 'contact', n: '08', kicker: 'Your turn', line: 'Research collaborations, roles, or a hard problem—here is how we keep the conversation going.' }
    ];

    function injectStoryBeats() {
        STORY_CHAPTERS.forEach(function (ch) {
            var sec = document.getElementById(ch.id);
            if (!sec) return;
            var container = sec.querySelector('.container');
            if (!container || container.querySelector('.story-beat')) return;
            var beat = document.createElement('div');
            beat.className = 'story-beat';
            beat.setAttribute('role', 'note');
            var n = document.createElement('span');
            n.className = 'story-beat__n';
            n.textContent = ch.n;
            var k = document.createElement('span');
            k.className = 'story-beat__kicker';
            k.textContent = ch.kicker;
            var p = document.createElement('p');
            p.className = 'story-beat__line';
            p.textContent = ch.line;
            beat.appendChild(n);
            beat.appendChild(k);
            beat.appendChild(p);
            container.insertBefore(beat, container.firstChild);
        });
    }

    injectStoryBeats();

    var storyRailLinks = document.querySelectorAll('.story-rail__link');
    var storyStageN = document.getElementById('storyStageN');
    var storyStageK = document.getElementById('storyStageK');
    var storyStageLine = document.getElementById('storyStageLine');

    function updateStoryUI(currentId) {
        storyRailLinks.forEach(function (a) {
            a.classList.toggle('is-active', a.getAttribute('data-story-id') === currentId);
        });
        var meta = null;
        for (var si = 0; si < STORY_CHAPTERS.length; si++) {
            if (STORY_CHAPTERS[si].id === currentId) {
                meta = STORY_CHAPTERS[si];
                break;
            }
        }
        if (meta && storyStageN && storyStageK && storyStageLine) {
            storyStageN.textContent = meta.n;
            storyStageK.textContent = meta.kicker;
            while (storyStageK.nextSibling) {
                storyStageLine.removeChild(storyStageK.nextSibling);
            }
            storyStageLine.appendChild(document.createTextNode(' — ' + meta.line));
        }
    }

    function onScrollUpdate(y) {
        if (scrollProgress && !prefersReducedMotion) {
            var docHeight = document.documentElement.scrollHeight - window.innerHeight;
            var p = docHeight > 0 ? (y / docHeight) * 100 : 0;
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
        updateStoryUI(current || 'hero');
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
            lerp: 0.072,
            wheelMultiplier: 0.88,
            touchMultiplier: 1.75,
            smoothWheel: true,
            syncTouch: false
        });
        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        bindScrollUpdates();
    }

    initLenis();

    /* Section reveal — stagger children; unobserve after first trigger */
    var revealSelector = [
        '.story-beat',
        '.hero-qr',
        '.section-title',
        '.section-sub',
        '.about-lead',
        '.about-text',
        '.exp-item',
        '.skill-category',
        '.project-card',
        '.education-card',
        '.creative-card',
        '.creative-intro p',
        '.contact-intro',
        '.projects-github-wrap',
        '.certifications'
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
                var d = i * staggerStep;
                el.style.transitionDelay = d + 'ms';
                if (d > maxDelay) maxDelay = d;
            });
            window.setTimeout(function () {
                animated.forEach(function (el) {
                    el.style.transitionDelay = '';
                });
            }, maxDelay + 1100);
            revealObserver.unobserve(section);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

    document.querySelectorAll('section[id]').forEach(function (section) {
        revealObserver.observe(section);
    });

    /* In-page navigation */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = anchor.getAttribute('href');
            if (!targetId || targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            if (nav && mobileMenuBtn) {
                nav.classList.remove('active');
                var icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            }
            var headerOffset = 80;
            if (lenis) {
                lenis.scrollTo(target, {
                    offset: -headerOffset,
                    duration: 1.25,
                    easing: function (t) {
                        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                    }
                });
            } else {
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
                window.scrollTo({ top: top, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
        });
    });

    /* Mobile menu toggle */
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function () {
            nav.classList.toggle('active');
            var icon = mobileMenuBtn.querySelector('i');
            if (!icon) return;
            icon.classList.toggle('fa-bars', !nav.classList.contains('active'));
            icon.classList.toggle('fa-times', nav.classList.contains('active'));
        });
        document.querySelectorAll('nav a').forEach(function (link) {
            link.addEventListener('click', function () {
                nav.classList.remove('active');
                var icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-times');
                }
            });
        });
    }

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
