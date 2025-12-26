document.addEventListener('DOMContentLoaded', () => {
    // Language Switching Logic
    const langButtons = document.querySelectorAll('.lang-switch button');

    // Check localStorage or default to PT (ignore browser)
    let currentLang = localStorage.getItem('hterm_lang') || 'pt';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('hterm_lang', lang);
        document.documentElement.lang = lang;

        // Update active button state
        langButtons.forEach(btn => {
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Update text content
        const elements = document.querySelectorAll('[data-i18n]');
        console.log(`Found ${elements.length} elements to translate`);

        elements.forEach(el => {
            const key = el.dataset.i18n;
            if (window.translations && window.translations[lang] && window.translations[lang][key]) {
                el.textContent = window.translations[lang][key];
            } else {
                console.warn(`Missing translation for key: ${key} in language: ${lang}`);
            }
        });
    }

    // Initialize Language
    setLanguage(currentLang);

    // Add Click Listeners
    langButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent any default behavior
            console.log(`Language button clicked: ${btn.dataset.lang}`);
            if (currentLang !== btn.dataset.lang) {
                setLanguage(btn.dataset.lang);
            } else {
                console.log('Language already active');
            }
        });
    });

    // FAQ Accordion Logic
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(q => {
        q.addEventListener('click', () => {
            const item = q.parentElement;
            const isActive = item.classList.contains('active');

            // Close all others
            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-toggle').innerHTML = '<i class="fa-solid fa-plus"></i>';
            });

            // Toggle current if it wasn't active
            if (!isActive) {
                item.classList.add('active');
                q.querySelector('.faq-toggle').innerHTML = '<i class="fa-solid fa-minus"></i>';
            }
        });
    });



    // Mobile Menu Logic
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // Form Submission Logic
    const contactForm = document.querySelector('.contact-form-card form');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Loading state
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = currentLang === 'pt' ? '<i class="fas fa-spinner fa-spin"></i> A enviar...' : '<i class="fas fa-spinner fa-spin"></i> Sending...';

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success logic
                    alert(currentLang === 'pt' ? 'Obrigado! Recebemos o seu pedido.' : 'Thank you! We received your request.');
                    contactForm.reset();
                } else {
                    // Error logic
                    const data = await response.json();
                    if (Object.hasOwn(data, 'errors')) {
                        alert(data["errors"].map(error => error["message"]).join(", "));
                    } else {
                        alert(currentLang === 'pt' ? 'Ocorreu um erro ao enviar o seu pedido.' : 'An error occurred while sending your request.');
                    }
                }
            } catch (error) {
                alert(currentLang === 'pt' ? 'Ocorreu um erro técnico. Por favor, tente novamente mais tarde.' : 'A technical error occurred. Please try again later.');
            } finally {
                // Restore button state
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
            }
        });
    }

    // Header Scroll Effect
    const header = document.getElementById('main-header');
    const logoImg = document.querySelector('.logo-img');
    const scrollThreshold = 50;

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
            if (logoImg) logoImg.src = 'assets/logo.png';
        } else {
            header.classList.remove('scrolled');
            if (logoImg) logoImg.src = 'assets/logo-light.png';
        }
    }

    // Initial check
    handleScroll();

    // Safety: Remove duplicate logos if they exist
    const logoContainer = document.querySelector('.logo');
    if (logoContainer) {
        const images = logoContainer.querySelectorAll('img');
        if (images.length > 1) {
            console.warn('Found duplicate logos, removing extras...');
            for (let i = 1; i < images.length; i++) {
                images[i].remove();
            }
        }
    }

    // Listen for scroll
    window.addEventListener('scroll', handleScroll);

    // Select Label Floats
    const selects = document.querySelectorAll('.modern-form select');
    selects.forEach(select => {
        const handleSelectValue = () => {
            if (select.value) {
                select.classList.add('has-value');
            } else {
                select.classList.remove('has-value');
            }
        };
        select.addEventListener('change', handleSelectValue);
        handleSelectValue(); // check on init
    });

    console.log('HTERM App initialized');
});
