document.addEventListener('DOMContentLoaded', function() {

// Texto animado - letras que aparecen en "XenofaArt"
const heroTitleText = document.querySelector('.hero-title-text');
if (heroTitleText) {
    const text = heroTitleText.textContent;
    heroTitleText.textContent = '';
    text.split('').forEach((char, i) => {
        const span = document.createElement('span');
        span.className = 'letter';
        span.textContent = char;
        span.style.animationDelay = `${i * 0.08}s`;
        heroTitleText.appendChild(span);
    });
}

// Partículas en botón Solicitar comisión
const commissionBtn = document.querySelector('.btn-commission-open');
const particlesContainer = document.querySelector('.btn-commission-particles');

function createParticle(container) {
    if (!container) return;
    const p = document.createElement('span');
    p.className = 'btn-commission-particle';
    const angle = Math.random() * Math.PI * 2;
    const dist = 30 + Math.random() * 50;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist - 20;
    p.style.setProperty('--tx', tx + 'px');
    p.style.setProperty('--ty', ty + 'px');
    p.style.left = '50%';
    p.style.top = '50%';
    container.appendChild(p);
    setTimeout(() => p.remove(), 1500);
}

let particleInterval;
if (commissionBtn && particlesContainer) {
    commissionBtn.addEventListener('mouseenter', () => {
        particleInterval = setInterval(() => {
            for (let i = 0; i < 3; i++) createParticle(particlesContainer);
        }, 200);
    });
    commissionBtn.addEventListener('mouseleave', () => clearInterval(particleInterval));
}

// Scroll reveal - bloques aparecen al entrar en pantalla
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => {
    revealObserver.observe(el);
});

// Parallax - formas del fondo se mueven con el scroll
function updateParallax() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    document.querySelectorAll('.bg-shape-parallax').forEach(wrapper => {
        const speed = parseFloat(wrapper.dataset.speed) || 0.3;
        const y = scrollY * speed * 0.25;
        wrapper.style.transform = `translateY(${y}px)`;
    });
}

window.addEventListener('scroll', updateParallax, { passive: true });
window.addEventListener('load', updateParallax);

// Navegación entre páginas
const pages = {
    home: document.getElementById('page-home'),
    art: document.getElementById('page-art'),
    cosplay: document.getElementById('page-cosplay'),
    contacto: document.getElementById('page-contacto')
};

function showPage(pageId) {
    if (!pages[pageId]) return;
    const currentActive = Object.keys(pages).find(id => pages[id] && pages[id].classList.contains('active'));
    
    const applyPage = () => {
        Object.keys(pages).forEach(id => {
            pages[id].classList.toggle('active', id === pageId);
            pages[id].classList.remove('leaving');
        });
        window.location.hash = pageId === 'home' ? '' : pageId;
        updateNavActive(pageId);
        // Scroll reveal: marcar secciones visibles cuando la página se muestra
        requestAnimationFrame(() => {
            pages[pageId]?.querySelectorAll('.reveal').forEach(el => el.classList.add('revealed'));
        });
    };

    if (currentActive && currentActive !== pageId) {
        pages[currentActive].classList.add('leaving');
        setTimeout(applyPage, 350);
    } else {
        applyPage();
    }
}

function updateNavActive(pageId) {
    document.querySelectorAll('.nav-menu a, .nav-logo').forEach(link => {
        const linkPage = link.getAttribute('data-page') || link.getAttribute('href')?.slice(1) || 'home';
        link.classList.toggle('nav-active', linkPage === pageId);
    });
}

function handleNavigation() {
    const hash = window.location.hash.slice(1) || 'home';
    if (pages[hash]) showPage(hash);
}

// Navegación por enlaces (data-page o href con #)
document.body.addEventListener('click', (e) => {
    const link = e.target.closest('a[data-page], a[href^="#"]');
    if (!link) return;
    const page = link.getAttribute('data-page') || (link.getAttribute('href')?.slice(1)) || 'home';
    if (!page) return;
    if (pages[page]) {
        e.preventDefault();
        showPage(page);
        document.querySelector('.nav-menu')?.classList.remove('active');
        window.location.hash = page === 'home' ? '' : page;
        if (modalCommission?.classList.contains('is-open')) closeCommissionModal();
    }
}, true);

window.addEventListener('hashchange', handleNavigation);
window.addEventListener('load', handleNavigation);

// Modal de comisiones
const modalCommission = document.getElementById('modal-commission');
const modalClose = modalCommission?.querySelector('.modal-close');
const modalBackdrop = modalCommission?.querySelector('.modal-backdrop');
const btnModalContact = document.querySelector('.btn-modal-contact');

function openCommissionModal() {
    if (modalCommission) {
        modalCommission.classList.add('is-open');
        modalCommission.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
}

function closeCommissionModal() {
    if (modalCommission) {
        modalCommission.classList.remove('is-open');
        modalCommission.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}
window.closeCommissionModal = closeCommissionModal;

if (commissionBtn) commissionBtn.addEventListener('click', openCommissionModal);
if (modalClose) modalClose.addEventListener('click', closeCommissionModal);
if (modalBackdrop) modalBackdrop.addEventListener('click', closeCommissionModal);

if (btnModalContact) {
    btnModalContact.addEventListener('click', (e) => {
        e.preventDefault();
        closeCommissionModal();
        showPage('contacto');
    });
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (document.getElementById('lightbox')?.classList.contains('is-open') && typeof closeLightboxInline === 'function') closeLightboxInline();
        else if (modalCommission?.classList.contains('is-open')) closeCommissionModal();
    }
});

// Lightbox - imagen a pantalla completa con flechas siguiente/anterior
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = lightbox?.querySelector('.lightbox-close');
const lightboxBackdrop = lightbox?.querySelector('.lightbox-backdrop');
const lightboxPrev = lightbox?.querySelector('.lightbox-prev');
const lightboxNext = lightbox?.querySelector('.lightbox-next');

let lightboxImages = [];
let lightboxIndex = 0;

function buildLightboxImages(galleryEl) {
    lightboxImages = [];
    const items = galleryEl ? galleryEl.querySelectorAll('.gallery-item-img') : document.querySelectorAll('.gallery-item-img');
    items.forEach(item => {
        const img = item.querySelector('img');
        const src = item.dataset.src || img?.src;
        const alt = img?.alt || 'Imagen';
        if (src) lightboxImages.push({ src, alt });
    });
}

function openLightbox(src, alt, galleryEl) {
    buildLightboxImages(galleryEl);
    const idx = lightboxImages.findIndex(i => i.src === src);
    lightboxIndex = idx >= 0 ? idx : 0;
    updateLightboxImage();
    if (lightbox && lightboxImg) {
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    updateLightboxArrows();
}

function updateLightboxImage() {
    if (lightboxImg && lightboxImages[lightboxIndex]) {
        lightboxImg.src = lightboxImages[lightboxIndex].src;
        lightboxImg.alt = lightboxImages[lightboxIndex].alt;
    }
}

function updateLightboxArrows() {
    if (lightboxPrev) lightboxPrev.disabled = lightboxIndex <= 0;
    if (lightboxNext) lightboxNext.disabled = lightboxIndex >= lightboxImages.length - 1;
}

function lightboxGoPrev() {
    if (lightboxIndex > 0) {
        lightboxIndex--;
        updateLightboxImage();
        updateLightboxArrows();
    }
}

function lightboxGoNext() {
    if (lightboxIndex < lightboxImages.length - 1) {
        lightboxIndex++;
        updateLightboxImage();
        updateLightboxArrows();
    }
}

function closeLightbox() {
    if (lightbox) {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }
}

// Lightbox manejado por script inline en index.html
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener('click', (e) => { e.stopPropagation(); lightboxGoPrev(); });
if (lightboxNext) lightboxNext.addEventListener('click', (e) => { e.stopPropagation(); lightboxGoNext(); });

document.addEventListener('keydown', (e) => {
    if (lightbox?.classList.contains('is-open')) {
        if (e.key === 'ArrowLeft') lightboxGoPrev();
        if (e.key === 'ArrowRight') lightboxGoNext();
    }
});

// Menú móvil
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.toggle('active'));
}

});
