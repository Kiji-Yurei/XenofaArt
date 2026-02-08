document.addEventListener('DOMContentLoaded', function() {

// Cargar galerías desde galeria.json
// Estructura: { "arte": [{"src":"Arte/x.jpg","desc":""}, ...] } o formato legacy {"arte":["Arte/x.jpg"], ...}
function renderGallery(container, images, basePath) {
    if (!container || !Array.isArray(images)) return;
    container.innerHTML = '';
    var galeria = container.getAttribute('data-galeria') || 'arte';
    images.forEach(function(item, i) {
        var src = typeof item === 'string' ? item : (item.src || item);
        var desc = typeof item === 'object' && item.desc ? item.desc : '';
        var div = document.createElement('div');
        div.className = 'gallery-item gallery-item-img';
        var fullSrc = new URL(src, window.location.origin + basePath).href;
        div.setAttribute('data-src', fullSrc);
        div.setAttribute('data-desc', desc);
        div.setAttribute('data-alt', (galeria === 'arte' ? 'Arte ' : galeria === 'pelucas' ? 'Peluca ' : 'Cosplay ') + (i + 1));
        var img = document.createElement('img');
        img.src = fullSrc;
        img.alt = div.getAttribute('data-alt');
        img.loading = 'lazy';
        div.appendChild(img);
        container.appendChild(div);
    });
}

function addSparklesToGallery() {
    document.querySelectorAll('.gallery-art .gallery-item-img, .gallery-cosplay .gallery-item-img').forEach(function(item) {
        if (item.querySelector('.frame-sparkle')) return;
        var sparkles = ['☆', '✧', '✦', '★'];
        var positions = ['tl', 'tr', 'bl', 'br'];
        positions.forEach(function(pos, i) {
            var span = document.createElement('span');
            span.className = 'frame-sparkle frame-sparkle-' + pos;
            span.textContent = sparkles[i];
            span.setAttribute('aria-hidden', 'true');
            item.prepend(span);
        });
    });
    document.querySelectorAll('.gallery-pelucas .gallery-item-img').forEach(function(item) {
        if (item.querySelector('.frame-sparkle')) return;
        var pelucasEmojis = ['✂️', '🪮', '💇', '🌬️'];
        var positions = ['tl', 'tr', 'bl', 'br'];
        positions.forEach(function(pos, i) {
            var span = document.createElement('span');
            span.className = 'frame-sparkle frame-sparkle-' + pos + ' frame-sparkle-pelucas';
            span.textContent = pelucasEmojis[i];
            span.setAttribute('aria-hidden', 'true');
            item.prepend(span);
        });
    });
}

function initPopupPelucas(pelucasItems, basePath) {
    var track = document.querySelector('.popup-pelucas-slider-track');
    if (!track || !pelucasItems || pelucasItems.length === 0) return;
    track.innerHTML = '';
    pelucasItems.forEach(function(item) {
        var src = (typeof item === 'string' ? item : (item.src || item));
        var fullSrc = new URL(src, window.location.origin + (basePath || '/')).href;
        var div = document.createElement('div');
        div.className = 'popup-pelucas-slider-slide';
        div.style.backgroundImage = "url('" + fullSrc + "')";
        track.appendChild(div);
    });
    var popupIdx = 0;
    var total = pelucasItems.length;
    function updatePopupSlider() {
        track.style.transform = 'translateX(-' + (popupIdx * 100) + '%)';
    }
    document.querySelector('.popup-pelucas-prev')?.addEventListener('click', function() {
        popupIdx = (popupIdx - 1 + total) % total;
        updatePopupSlider();
    });
    document.querySelector('.popup-pelucas-next')?.addEventListener('click', function() {
        popupIdx = (popupIdx + 1) % total;
        updatePopupSlider();
    });
    setInterval(function() {
        if (document.getElementById('popup-pelucas')?.classList.contains('is-open')) {
            popupIdx = (popupIdx + 1) % total;
            updatePopupSlider();
        }
    }, 4000);
}

(function loadGalleries() {
    // Ruta base: en GitHub Pages es /XenofaArt/, en local puede ser /
    var pathname = window.location.pathname;
    var basePath = pathname;
    if (pathname.match(/\.[^/]+$/)) {
        basePath = pathname.replace(/\/[^/]+$/, '/');
    } else if (!pathname.endsWith('/')) {
        basePath = pathname + '/';
    }
    if (!basePath) basePath = '/';
    var jsonUrl = new URL(basePath + 'galeria.json', window.location.origin).href;

    fetch(jsonUrl, { cache: 'no-store' })
        .then(function(r) { return r.ok ? r.json() : Promise.reject(new Error('Fetch failed: ' + r.status)); })
        .then(function(data) {
            var artGallery = document.querySelector('[data-galeria="arte"]');
            var cosplayGallery = document.querySelector('[data-galeria="cosplay"]');
            var pelucasGallery = document.querySelector('[data-galeria="pelucas"]');
            if (artGallery && data.arte && Array.isArray(data.arte)) {
                renderGallery(artGallery, data.arte, basePath);
            }
            if (cosplayGallery && data.cosplay && Array.isArray(data.cosplay)) {
                renderGallery(cosplayGallery, data.cosplay, basePath);
            }
            if (pelucasGallery && data.pelucas && Array.isArray(data.pelucas)) {
                renderGallery(pelucasGallery, data.pelucas, basePath);
            }
            addSparklesToGallery();
            if (data.pelucas && Array.isArray(data.pelucas)) initPopupPelucas(data.pelucas, basePath);
        })
        .catch(function(err) {
            document.querySelectorAll('[data-galeria]').forEach(function(el) {
                el.innerHTML = '<p class="gallery-error">No se pudo cargar la galería (' + (err && err.message ? err.message : 'error') + ').</p>';
            });
        });
})();

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
    pelucas: document.getElementById('page-pelucas'),
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
        if (pageId === 'cosplay') {
            const w = document.getElementById('popup-pelucas-wrapper');
            if (w) { w.classList.add('is-visible'); w.setAttribute('aria-hidden', 'false'); }
            setTimeout(() => { if (typeof openPopupPelucas === 'function') openPopupPelucas(); }, 500);
        } else {
            const w = document.getElementById('popup-pelucas-wrapper');
            if (w) { w.classList.remove('is-visible'); w.setAttribute('aria-hidden', 'true'); }
        }
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

window.syncLightboxFromInline = function(imgs, idx) {
    lightboxImages = imgs || [];
    lightboxIndex = idx >= 0 ? idx : 0;
};

function buildLightboxImages(galleryEl) {
    lightboxImages = [];
    const items = galleryEl ? galleryEl.querySelectorAll('.gallery-item-img') : document.querySelectorAll('.gallery-item-img');
    items.forEach(item => {
        const img = item.querySelector('img');
        const src = item.dataset.src || img?.src;
        const alt = img?.alt || 'Imagen';
        const desc = item.dataset.desc || '';
        if (src) lightboxImages.push({ src, alt, desc });
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
    const item = lightboxImages[lightboxIndex];
    if (lightboxImg && item) {
        lightboxImg.src = item.src;
        lightboxImg.alt = item.alt || 'Imagen';
    }
    const lbDesc = document.getElementById('lightbox-desc');
    if (lbDesc) lbDesc.textContent = (item && item.desc) ? item.desc : 'Sin descripción';
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
