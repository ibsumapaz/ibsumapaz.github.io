/**
 * IGLESIA BAUTISTA SUMAPAZ - MODERN APP LOGIC
 * Dynamic interactive features: Theme Toggle, Dynamic Spotify/YouTube loaders,
 * Bible Reading Plan daily widget, Declaración de Fe Modal, Curated Moments Lightbox,
 * Navigation Scrollspy, and Web3Forms Validator.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. NAVIGATION & SCROLL EFFECTS
       ========================================== */
    const header = document.querySelector('.main-header');
    const navToggle = document.getElementById('mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    const navLinks = document.querySelectorAll('.nav-pill-wrapper a');
    const sections = document.querySelectorAll('section[id]');
    const hasHero = document.querySelector('.hero-section');

    // Solid header on inner pages without hero
    if (!hasHero && header) {
        header.classList.add('scrolled', 'header-solid');
    }

    // Scroll Header Style & Scrollspy
    window.addEventListener('scroll', () => {
        if (hasHero && header) {
            if (window.scrollY > 40) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
        highlightActiveSection();
    });

    // Mobile Navigation Drawer Toggle
    const openMobileMenu = () => {
        if (!navToggle || !primaryNav) return;
        navToggle.setAttribute('aria-expanded', 'true');
        primaryNav.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeMobileMenu = () => {
        if (!navToggle || !primaryNav) return;
        navToggle.setAttribute('aria-expanded', 'false');
        primaryNav.classList.remove('active');
        document.body.style.overflow = '';
    };

    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close on navigation link click
        primaryNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMobileMenu();
            });
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (primaryNav.classList.contains('active') && !primaryNav.contains(e.target) && !navToggle.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close on window resize to desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024 && primaryNav.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    // Scrollspy Highlight Navigation Links
    function highlightActiveSection() {
        if (!sections.length || !navLinks.length) return;
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    } else if (link.getAttribute('href').startsWith('#')) {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }

    /* ==========================================
       2. DARK / LIGHT THEME TOGGLE
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            showToast(`Modo ${newTheme === 'dark' ? 'Oscuro' : 'Claro'} activado`, 'success');
        });
    }

    /* ==========================================
       3. SPOTIFY & YOUTUBE DYNAMIC EMBEDS (LAZY LOADED)
       ========================================== */
    const spotifyTitleEl = document.getElementById('spotify-episode-title');
    const spotifyDescEl = document.getElementById('spotify-episode-desc');
    const spotifyPlayer = document.getElementById('spotify-dynamic-player');
    const ytPlayer = document.getElementById('youtube-dynamic-player');

    let dynamicYtUrl = null;

    // Lazy load media iframes when entering viewport to prevent blocking main thread
    const mediaIframes = [spotifyPlayer, ytPlayer].filter(Boolean);
    if ('IntersectionObserver' in window) {
        const mediaObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const iframe = entry.target;
                    if (iframe.id === 'youtube-dynamic-player' && dynamicYtUrl) {
                        iframe.src = dynamicYtUrl;
                    } else if (iframe.dataset.src && (!iframe.src || iframe.src === 'about:blank')) {
                        iframe.src = iframe.dataset.src;
                    }
                    observer.unobserve(iframe);
                }
            });
        }, { rootMargin: '300px 0px' });

        mediaIframes.forEach(iframe => mediaObserver.observe(iframe));
    } else {
        mediaIframes.forEach(iframe => {
            if (iframe.dataset.src) iframe.src = iframe.dataset.src;
        });
    }

    if (spotifyTitleEl && spotifyDescEl) {
        const spotifyRssUrl = 'https://anchor.fm/s/1bc6e8f8/podcast/rss';
        const spotifyApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(spotifyRssUrl)}`;

        fetch(spotifyApiUrl)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    const latestEpisode = data.items[0];
                    if (latestEpisode) {
                        const cleanDesc = latestEpisode.description.replace(/<\/?[^>]+(>|$)/g, "").trim();
                        spotifyTitleEl.textContent = latestEpisode.title;
                        if (cleanDesc) {
                            spotifyDescEl.textContent = cleanDesc.length > 160 ? `${cleanDesc.substring(0, 160)}...` : cleanDesc;
                        }
                    }
                }
            })
            .catch(err => {
                console.warn("Spotify RSS fetch skipped:", err);
            });
    }

    if (ytPlayer) {
        const channelId = 'UC2-QFBw8CtEGVhx6Yg2jIlw';
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    const latestSermon = data.items.find(item => item.link.includes('watch?v='));
                    if (latestSermon) {
                        const videoId = latestSermon.guid.replace('yt:video:', '');
                        const newUrl = `https://www.youtube.com/embed/${videoId}?rel=0`;
                        dynamicYtUrl = newUrl;
                        if (ytPlayer.src && ytPlayer.src !== 'about:blank') {
                            ytPlayer.src = newUrl;
                        } else {
                            ytPlayer.dataset.src = newUrl;
                        }
                    }
                }
            })
            .catch(err => {
                console.warn("YouTube dynamic embed fetch skipped:", err);
            });
    }

    /* ==========================================
       4. BIBLE PLAN INTERACTIVE WIDGET
       ========================================== */
    const dateTitle = document.getElementById('widget-today-date');
    const passageText = document.getElementById('widget-today-passage');
    const markReadCheckbox = document.getElementById('mark-read-checkbox');
    const progressBar = document.getElementById('reading-progress-bar');
    const progressPercent = document.getElementById('reading-progress-percent');
    let bibleReadings = {};

    const monthsSpanish = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    function loadBibleReading() {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const day = today.getDate();

        if (dateTitle) {
            dateTitle.textContent = `Lectura para hoy, ${day} de ${monthsSpanish[month]}:`;
        }

        if (window.BIBLE_PLAN) {
            bibleReadings = window.BIBLE_PLAN;
            displayReading(year, month, day);
        } else if (Object.keys(bibleReadings).length === 0) {
            fetch('assets/bible_plan.json')
                .then(res => res.json())
                .then(data => {
                    bibleReadings = data;
                    displayReading(year, month, day);
                })
                .catch(err => {
                    console.warn('Cargando lectura por defecto:', err);
                    displayReading(year, month, day);
                });
        } else {
            displayReading(year, month, day);
        }
    }

    function displayReading(year, month, day) {
        let reading = "Juan 3 & Salmo 121";

        if (bibleReadings[year] && bibleReadings[year][month] && bibleReadings[year][month][day - 1]) {
            reading = bibleReadings[year][month][day - 1];
        } else {
            const dayOffset = (day + (month * 30)) % 150;
            reading = `Lectura Día ${dayOffset}: Lucas ${Math.floor(dayOffset / 5) + 1} & Salmo ${dayOffset + 10}`;
        }

        if (passageText) {
            passageText.textContent = reading;
        }

        const storageKey = `bible_read_${year}_${month}_${day}`;
        const isRead = localStorage.getItem(storageKey) === 'true';

        if (markReadCheckbox) {
            markReadCheckbox.checked = isRead;
        }

        updateProgressBar(month);
    }

    function updateProgressBar(month) {
        if (!progressBar || !progressPercent) return;

        const today = new Date();
        const year = today.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let completedCount = 0;

        for (let d = 1; d <= daysInMonth; d++) {
            const key = `bible_read_${year}_${month}_${d}`;
            const isCompleted = localStorage.getItem(key) === 'true';

            const readingsForMonth = bibleReadings[year] ? bibleReadings[year][month] : null;
            const readingText = readingsForMonth ? readingsForMonth[d - 1] : "";
            const isSundayFree = readingText === 'DOMINGO LIBRE';

            const dateToCheck = new Date(year, month, d);
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const hasPassed = dateToCheck <= todayStart;

            if (isCompleted || (isSundayFree && hasPassed)) {
                completedCount++;
            }
        }

        const percent = Math.min(100, Math.round((completedCount / daysInMonth) * 100));

        progressBar.style.width = `${percent}%`;
        progressPercent.textContent = `${percent}%`;
    }

    if (markReadCheckbox) {
        markReadCheckbox.addEventListener('change', () => {
            const today = new Date();
            const month = today.getMonth();
            const day = today.getDate();
            const storageKey = `bible_read_${today.getFullYear()}_${month}_${day}`;

            if (markReadCheckbox.checked) {
                localStorage.setItem(storageKey, 'true');
                showToast('¡Lectura de hoy completada! Gloria a Dios.', 'success');
            } else {
                localStorage.removeItem(storageKey);
            }

            updateProgressBar(month);
        });
    }

    loadBibleReading();

    /* ==========================================
       5. DECLARATION OF FAITH MODAL
       ========================================== */
    const declaracionModal = document.getElementById('declaracion-modal');
    const openDeclaracionBtns = document.querySelectorAll('#open-declaracion-modal, .open-declaracion-modal');
    const closeDeclaracionBtn = document.getElementById('declaracion-modal-close');

    function openDeclaracion() {
        if (declaracionModal) {
            declaracionModal.classList.add('active');
            declaracionModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeDeclaracion() {
        if (declaracionModal) {
            declaracionModal.classList.remove('active');
            declaracionModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (openDeclaracionBtns.length) {
        openDeclaracionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openDeclaracion();
            });
        });
    }

    if (closeDeclaracionBtn) {
        closeDeclaracionBtn.addEventListener('click', closeDeclaracion);
    }

    if (declaracionModal) {
        declaracionModal.addEventListener('click', (e) => {
            if (e.target === declaracionModal) {
                closeDeclaracion();
            }
        });
    }

    /* ==========================================
       6. CURATED MOMENTS GALLERY & LAZY LOADING
       ========================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const momentCards = document.querySelectorAll('.moment-card');

    let currentMomentIndex = 0;

    // Lazy load gallery backgrounds as user scrolls near them
    if ('IntersectionObserver' in window) {
        const bgObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const card = entry.target;
                    const bgUrl = card.getAttribute('data-bg');
                    if (bgUrl) {
                        card.style.backgroundImage = `url('${bgUrl}')`;
                    }
                    observer.unobserve(card);
                }
            });
        }, { rootMargin: '250px 0px' });

        momentCards.forEach(card => {
            if (card.hasAttribute('data-bg')) {
                bgObserver.observe(card);
            }
        });
    } else {
        momentCards.forEach(card => {
            const bgUrl = card.getAttribute('data-bg');
            if (bgUrl) card.style.backgroundImage = `url('${bgUrl}')`;
        });
    }

    function showLightbox(index) {
        if (!momentCards.length) return;
        if (index < 0) index = momentCards.length - 1;
        if (index >= momentCards.length) index = 0;

        currentMomentIndex = index;
        const card = momentCards[currentMomentIndex];
        const imgSrc = card.getAttribute('data-img') || card.getAttribute('data-bg') || '';
        const caption = card.getAttribute('data-caption') || '';

        if (lightboxImg) lightboxImg.src = imgSrc;
        if (lightboxCaption) lightboxCaption.textContent = caption;

        if (lightbox) {
            lightbox.classList.add('active');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        }
    }

    function closeLightbox() {
        if (lightbox) {
            lightbox.classList.remove('active');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    momentCards.forEach((card, idx) => {
        card.addEventListener('click', () => {
            showLightbox(idx);
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightbox(currentMomentIndex - 1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => showLightbox(currentMomentIndex + 1));

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Global Keydown (Escape, Arrows)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeDeclaracion();
            closeLightbox();
            closeMobileMenu();
        }
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') showLightbox(currentMomentIndex - 1);
            if (e.key === 'ArrowRight') showLightbox(currentMomentIndex + 1);
        }
    });

    /* ==========================================
       7. CONTACT FORM VALIDATION & ON-DEMAND SCRIPT
       ========================================== */
    let toastContainer = document.getElementById('toast-container');
    const contactForm = document.getElementById('contact-form');
    const contactSection = document.getElementById('contacto');

    // On-demand loader for Web3Forms/hCaptcha script
    let isWeb3FormsLoaded = false;
    function loadWeb3FormsScript() {
        if (isWeb3FormsLoaded) return;
        isWeb3FormsLoaded = true;
        const script = document.createElement('script');
        script.src = 'https://web3forms.com/client/script.js';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
    }

    if (contactForm) {
        // Load captcha script when user focuses any input
        contactForm.addEventListener('focusin', loadWeb3FormsScript, { once: true });

        // Or load when user scrolls near the contact section
        if (contactSection && 'IntersectionObserver' in window) {
            const contactObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    loadWeb3FormsScript();
                    contactObserver.disconnect();
                }
            }, { rootMargin: '300px 0px' });
            contactObserver.observe(contactSection);
        }
    }

    function showToast(message, type = 'success') {
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = '✓';
        if (type === 'error') icon = '⚠';

        toast.innerHTML = `<span>${icon}</span><p>${message}</p>`;
        toastContainer.appendChild(toast);

        toast.offsetHeight;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 4000);
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;
            const inputs = contactForm.querySelectorAll('input[required], textarea[required]');

            inputs.forEach(input => {
                const formGroup = input.parentElement;
                formGroup.classList.remove('invalid');

                if (!input.value.trim()) {
                    formGroup.classList.add('invalid');
                    isValid = false;
                }

                if (input.type === 'email' && input.value.trim()) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(input.value.trim())) {
                        formGroup.classList.add('invalid');
                        const errorMsg = formGroup.querySelector('.error-msg');
                        if (errorMsg) errorMsg.textContent = "Ingresa un correo con formato válido";
                        isValid = false;
                    }
                }
            });

            if (isValid) {
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const origText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';

                const formData = new FormData(contactForm);
                const object = Object.fromEntries(formData);
                const json = JSON.stringify(object);

                fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: json
                })
                    .then(async (response) => {
                        const res = await response.json();
                        if (response.status === 200) {
                            showToast('¡Mensaje enviado con éxito! Nos comunicaremos pronto.', 'success');
                            contactForm.reset();
                            if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
                        } else {
                            showToast(res.message || 'Hubo un error al enviar el mensaje.', 'error');
                            if (typeof hcaptcha !== 'undefined') hcaptcha.reset();
                        }
                    })
                    .catch(error => {
                        showToast('Error de conexión. Por favor verifica tu internet.', 'error');
                        console.error(error);
                    })
                    .finally(() => {
                        submitBtn.disabled = false;
                        submitBtn.textContent = origText;
                    });
            } else {
                showToast('Por favor completa los campos requeridos.', 'error');
            }
        });

        contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
            input.addEventListener('input', () => {
                const formGroup = input.parentElement;
                if (input.value.trim()) {
                    formGroup.classList.remove('invalid');
                }
            });
        });
    }
});
