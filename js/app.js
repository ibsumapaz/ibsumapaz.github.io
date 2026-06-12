/**
 * IGLESIA BAUTISTA SUMAPAZ - APP LOGIC
 * Dynamic interactive features: Scroll effects, Dark mode, Mock Audio Player,
 * Bible Reading Plan, Ministries Modal, Gallery Filter & Lightbox, Form Validator.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. NAVIGATION & SCROLL EFFECTS
       ========================================== */
    const header = document.querySelector('.main-header');
    const navToggle = document.querySelector('.mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-navigation');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Fixed Header Scroll Class
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        highlightActiveSection();
    });

    // Mobile Hamburger Toggle
    if (navToggle && primaryNav) {
        navToggle.addEventListener('click', () => {
            const isOpened = navToggle.getAttribute('aria-expanded') === 'true';
            navToggle.setAttribute('aria-expanded', !isOpened);
            primaryNav.classList.toggle('active');
        });

        // Close menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle.setAttribute('aria-expanded', 'false');
                primaryNav.classList.remove('active');
            });
        });
    }

    // Scrollspy Highlight Navigation Links
    function highlightActiveSection() {
        let scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelector(`.nav-list a[href*=${sectionId}]`)?.classList.add('active');
            } else {
                document.querySelector(`.nav-list a[href*=${sectionId}]`)?.classList.remove('active');
            }
        });
    }

    /* ==========================================
       2. DARK / LIGHT THEME TOGGLE
       ========================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Check local storage or system preferences
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            let newTheme = 'light';

            if (currentTheme === 'light') {
                newTheme = 'dark';
            }

            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            showToast(`Modo ${newTheme === 'dark' ? 'Oscuro' : 'Claro'} activado`, 'success');
        });
    }

    /* ==========================================
       3. SPOTIFY & YOUTUBE DYNAMIC EMBEDS
       ========================================== */
    // El reproductor de Spotify se carga de forma oficial y directa en index.html.
    // Lógica para obtener dinámicamente la descripción y título del último audio de Spotify:
    const spotifyTitleEl = document.getElementById('spotify-episode-title');
    const spotifyDescEl = document.getElementById('spotify-episode-desc');
    if (spotifyTitleEl && spotifyDescEl) {
        const spotifyRssUrl = 'https://anchor.fm/s/1bc6e8f8/podcast/rss';
        const spotifyApiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(spotifyRssUrl)}`;

        fetch(spotifyApiUrl)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    const latestEpisode = data.items[0];
                    if (latestEpisode) {
                        // Limpiar etiquetas HTML de la descripción
                        const cleanDesc = latestEpisode.description.replace(/<\/?[^>]+(>|$)/g, "").trim();
                        spotifyTitleEl.textContent = `Última Predicación: ${latestEpisode.title}`;
                        spotifyDescEl.textContent = cleanDesc;
                    }
                }
            })
            .catch(err => {
                console.error("Error al obtener el último episodio de Spotify:", err);
            });
    }

    // Lógica para obtener dinámicamente el último video de YouTube (evitando errores de playlist):
    const ytPlayer = document.getElementById('youtube-dynamic-player');
    if (ytPlayer) {
        const channelId = 'UC2-QFBw8CtEGVhx6Yg2jIlw';
        const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;

        fetch(apiUrl)
            .then(res => res.json())
            .then(data => {
                if (data.status === 'ok' && data.items && data.items.length > 0) {
                    // Filtrar para encontrar el último video de larga duración (evitando Shorts)
                    const latestSermon = data.items.find(item => item.link.includes('watch?v='));
                    if (latestSermon) {
                        const videoId = latestSermon.guid.replace('yt:video:', '');
                        ytPlayer.src = `https://www.youtube.com/embed/${videoId}?rel=0`;
                    }
                }
            })
            .catch(err => {
                console.error("Error al obtener la última publicación de YouTube:", err);
            });
    }

    /* ==========================================
       4. FACEBOOK MOCK LIKE BUTTON
       ========================================== */
    const fbLikeBtn = document.getElementById('fb-like-btn');
    const fbLikeCount = document.getElementById('fb-like-count');
    let fbLiked = false;
    let baseLikes = 76;

    if (fbLikeBtn && fbLikeCount) {
        fbLikeBtn.addEventListener('click', () => {
            fbLiked = !fbLiked;
            if (fbLiked) {
                fbLikeBtn.style.color = 'var(--brand-facebook)';
                fbLikeCount.textContent = `Me gusta (${baseLikes + 1})`;
                showToast('Te gusta esta publicación', 'success');
            } else {
                fbLikeBtn.style.color = 'var(--text-muted)';
                fbLikeCount.textContent = `Me gusta (${baseLikes})`;
            }
        });
    }

    /* ==========================================
       5. BIBLE PLAN INTERACTIVE WIDGET
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
            dateTitle.textContent = `Lectura para hoy, ${day} de ${monthsSpanish[month]}`;
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
                    console.error('Error al cargar el plan de lectura:', err);
                    if (passageText) {
                        passageText.textContent = "Error al cargar la lectura de hoy.";
                    }
                });
        } else {
            displayReading(year, month, day);
        }
    }

    function displayReading(year, month, day) {
        let reading = "Juan 3 & Salmo 121"; // Default fallback

        if (bibleReadings[year] && bibleReadings[year][month] && bibleReadings[year][month][day - 1]) {
            reading = bibleReadings[year][month][day - 1];
        } else {
            // Simulated generic plan reading for other years
            const dayOffset = (day + (month * 30)) % 150;
            reading = `Lectura Día ${dayOffset}: Lucas ${Math.floor(dayOffset / 5) + 1} & Salmo ${dayOffset + 10}`;
        }

        if (passageText) {
            passageText.textContent = reading;
        }

        // Load reading plan completed status from localStorage
        const storageKey = `bible_read_${year}_${month}_${day}`;
        const isRead = localStorage.getItem(storageKey) === 'true';

        if (markReadCheckbox) {
            markReadCheckbox.checked = isRead;
        }

        updateProgressBar(month);
    }

    function updateProgressBar(month) {
        if (Object.keys(bibleReadings).length === 0) return;

        const today = new Date();
        const year = today.getFullYear();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        let completedCount = 0;

        for (let d = 1; d <= daysInMonth; d++) {
            const key = `bible_read_${year}_${month}_${d}`;
            const isCompleted = localStorage.getItem(key) === 'true';

            // Obtener el texto de la lectura para verificar si es domingo libre
            const readingsForMonth = bibleReadings[year] ? bibleReadings[year][month] : null;
            const readingText = readingsForMonth ? readingsForMonth[d - 1] : "";
            const isSundayFree = readingText === 'DOMINGO LIBRE';

            // El día se considera completado si el usuario lo marcó,
            // o si es un domingo libre que ya pasó (o es hoy)
            const dateToCheck = new Date(year, month, d);
            const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const hasPassed = dateToCheck <= todayStart;

            if (isCompleted || (isSundayFree && hasPassed)) {
                completedCount++;
            }
        }

        const percent = Math.round((completedCount / daysInMonth) * 100);

        if (progressBar && progressPercent) {
            progressBar.style.width = `${percent}%`;
            progressPercent.textContent = `${percent}%`;
        }
    }

    if (markReadCheckbox) {
        markReadCheckbox.addEventListener('change', () => {
            const today = new Date();
            const month = today.getMonth();
            const day = today.getDate();
            const storageKey = `bible_read_${today.getFullYear()}_${month}_${day}`;

            if (markReadCheckbox.checked) {
                localStorage.setItem(storageKey, 'true');
                showToast('¡Lectura de hoy completada! Sigue así.', 'success');
            } else {
                localStorage.removeItem(storageKey);
            }

            updateProgressBar(month);
        });
    }

    loadBibleReading();


    /* ==========================================
       6. MINISTRIES DIALOG MODAL
       ========================================== */
    const ministryModal = document.getElementById('ministry-modal');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalTag = document.getElementById('modal-tag');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalSchedule = document.getElementById('modal-schedule');

    // Details for each ministry
    const ministryDetails = {
        jovenes: {
            title: "Grupo de Jóvenes",
            tag: "Jóvenes",
            img: "assets/jovenes.jpg",
            schedule: "Sábados a las 3:00 p.m. en los hogares.",
            desc: "Nos enfocamos en enseñar a los jóvenes cómo vivir bajo la luz de la Palabra de Dios en la sociedad contemporánea. A través de tiempos de alabanza, dinámicas, discipulado bíblico grupal y salidas fraternales, cultivamos amistades saludables arraigadas en Cristo."
        },
        ninos: {
            title: "Escuela Dominical",
            tag: "Niños y Adolescentes",
            img: "assets/escuela_dominical.jpg",
            schedule: "Domingos a las 9:30 a.m. durante el servicio general.",
            desc: "Nuestros niños aprenden las verdades de la Biblia en un ambiente seguro, divertido y adaptado a sus edades. Los maestros enseñan de forma cronológica e interactiva, utilizando manualidades, cantos y lecciones bíblicas fieles que construyen fundamentos espirituales firmes en Cristo."
        },
        oracion: {
            title: "Grupos de Oración en Casa",
            tag: "Comunidad",
            img: "assets/comunidad_oracion.jpg",
            schedule: "Miércoles a las 6:30 p.m. y Jueves a las 2:30 p.m. en diferentes sectores.",
            desc: "Creemos firmemente en el poder del clamor y la vida en comunidad. En estos grupos en hogares compartimos un café, estudiamos las Escrituras de manera informal y dedicamos tiempo a orar los unos por los otros, fortaleciendo el cuidado mutuo pastoral."
        },
        social: {
            title: "Ministerio del Galán",
            tag: "Servicio",
            img: "assets/labor_social.jpg",
            schedule: "Viernes y Sábados.",
            desc: "Llevamos el amor de Cristo a la práctica. Trabajamos en la comunidad, donde realizamos reuniones recreativas, juegos, refrigerios y lecciones bíblicas dinámicas para niños y adolescentes con el fin de apoyarlos en sus entornos de vida."
        },
        alabanza: {
            title: "Alabanza y Adoración",
            tag: "Música",
            img: "assets/alabanza.jpg",
            schedule: "Domingos a las 9:30 a.m.",
            desc: "Este ministerio se enfoca en guiar a la iglesia en la adoración colectiva. Buscamos cantar y exaltar a Dios con excelencia, reverencia y alegría, entonando himnos y cantos congregacionales centrados en la verdad del evangelio."
        },
        misiones: {
            title: "Misiones y Evangelismo",
            tag: "Misiones",
            img: "assets/misiones.jpg",
            // isSvg: true,
            schedule: "Jornadas especiales planificadas anualmente.",
            desc: "Comprometidos con la Gran Comisión de Mateo 28. Apoyamos a misioneros en diferentes campos e implementamos esfuerzos locales de evangelismo personal y comunitario para dar a conocer las buenas nuevas de salvación en Fusagasugá y sus alrededores."
        }
    };

    document.querySelectorAll('.ministry-card').forEach(card => {
        card.querySelector('.open-ministry-modal').addEventListener('click', (e) => {
            e.stopPropagation();
            const minKey = card.getAttribute('data-ministry');
            const data = ministryDetails[minKey];

            if (data) {
                // Populate Modal Data
                modalTitle.textContent = data.title;
                modalTag.textContent = data.tag;
                modalDesc.textContent = data.desc;
                modalSchedule.textContent = data.schedule;

                if (data.isSvg) {
                    modalImage.style.backgroundImage = 'none';
                    modalImage.innerHTML = `<div class="ministry-img-placeholder" style="height:100%">${card.querySelector('.ministry-img-placeholder').innerHTML}</div>`;
                } else {
                    modalImage.innerHTML = '';
                    modalImage.style.backgroundImage = `url('${data.img}')`;
                }

                // Open Modal
                ministryModal.classList.add('active');
                ministryModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Lock background scroll
            }
        });
    });

    function closeMinistryModal() {
        ministryModal.classList.remove('active');
        ministryModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeMinistryModal);
    }

    if (ministryModal) {
        ministryModal.addEventListener('click', (e) => {
            if (e.target === ministryModal) {
                closeMinistryModal();
            }
        });
    }

    /* ==========================================
       6b. DECLARATION OF FAITH MODAL
       ========================================== */
    const declaracionModal = document.getElementById('declaracion-modal');
    const openDeclaracionBtn = document.getElementById('open-declaracion-modal');
    const closeDeclaracionBtn = document.getElementById('declaracion-modal-close');

    if (openDeclaracionBtn && declaracionModal) {
        openDeclaracionBtn.addEventListener('click', () => {
            declaracionModal.classList.add('active');
            declaracionModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
    }

    function closeDeclaracionModal() {
        if (declaracionModal) {
            declaracionModal.classList.remove('active');
            declaracionModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }
    }

    if (closeDeclaracionBtn) {
        closeDeclaracionBtn.addEventListener('click', closeDeclaracionModal);
    }

    if (declaracionModal) {
        declaracionModal.addEventListener('click', (e) => {
            if (e.target === declaracionModal) {
                closeDeclaracionModal();
            }
        });
    }


    /* ==========================================
       7. GALLERY FILTERING
       ========================================== */
    const galleryFilterBtns = document.querySelectorAll('.btn-gallery');
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            galleryFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });


    /* ==========================================
       8. GALLERY LIGHTBOX
       ========================================== */
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    let currentImageIndex = 0;
    let visibleGalleryItems = [];

    function updateVisibleItems() {
        visibleGalleryItems = Array.from(galleryItems).filter(item => !item.classList.contains('hidden'));
    }

    function showLightboxImage(index) {
        if (index < 0) index = visibleGalleryItems.length - 1;
        if (index >= visibleGalleryItems.length) index = 0;

        currentImageIndex = index;
        const targetItem = visibleGalleryItems[currentImageIndex];

        // Extract background image URL
        const bgStyle = window.getComputedStyle(targetItem).backgroundImage;
        const imgUrl = bgStyle.replace(/url\(['"]?(.*?)['"]?\)/i, '$1');
        const desc = targetItem.getAttribute('data-description');

        lightboxImg.src = imgUrl;
        lightboxCaption.textContent = desc;
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            updateVisibleItems();
            const index = visibleGalleryItems.indexOf(item);

            if (index !== -1) {
                showLightboxImage(index);
                lightbox.classList.add('active');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxPrev) lightboxPrev.addEventListener('click', () => showLightboxImage(currentImageIndex - 1));
    if (lightboxNext) lightboxNext.addEventListener('click', () => showLightboxImage(currentImageIndex + 1));

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    // Keyboard Shortcuts for Modals & Lightbox
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMinistryModal();
            closeLightbox();
            closeDeclaracionModal();
        }
        if (lightbox && lightbox.classList.contains('active')) {
            if (e.key === 'ArrowLeft') showLightboxImage(currentImageIndex - 1);
            if (e.key === 'ArrowRight') showLightboxImage(currentImageIndex + 1);
        }
    });


    /* ==========================================
       9. CONTACT FORM VALIDATION & TOASTS
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const toastContainer = document.getElementById('toast-container');

    function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        let icon = '&#10003;'; // Checkmark
        if (type === 'error') icon = '&#9888;'; // Warning

        toast.innerHTML = `<span>${icon}</span><p>${message}</p>`;
        toastContainer.appendChild(toast);

        // Trigger reflow
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

                // Reset errors
                formGroup.classList.remove('invalid');

                if (!input.value.trim()) {
                    formGroup.classList.add('invalid');
                    isValid = false;
                }

                // Email format check
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
                submitBtn.disabled = true;
                submitBtn.textContent = 'Enviando...';

                // Enviar datos a la API de Web3Forms
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
                            showToast('¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.', 'success');
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
                        submitBtn.textContent = 'Enviar Mensaje';
                    });
            } else {
                showToast('Por favor, completa correctamente los campos obligatorios.', 'error');
            }
        });

        // Live input check on blur
        contactForm.querySelectorAll('input[required], textarea[required]').forEach(input => {
            input.addEventListener('blur', () => {
                const formGroup = input.parentElement;
                if (!input.value.trim()) {
                    formGroup.classList.add('invalid');
                } else {
                    formGroup.classList.remove('invalid');
                }
            });
            input.addEventListener('input', () => {
                const formGroup = input.parentElement;
                if (input.value.trim()) {
                    formGroup.classList.remove('invalid');
                }
            });
        });
    }
});
