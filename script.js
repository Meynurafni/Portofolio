/**
 * Portfolio - Interaktivitas
 * Menu mobile, header scroll, form contact
 */

document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.querySelector('.contact-form');

  // ========== Aesthetic FX (stars / butterflies) ==========
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fxGlyphs = ['✦', '✨', '✧', '⋆', '🦋'];
  let fxLayer = null;
  let lastFxAt = 0;

  function ensureFxLayer() {
    if (prefersReducedMotion) return null;
    if (fxLayer) return fxLayer;
    fxLayer = document.createElement('div');
    fxLayer.className = 'fx-layer';
    fxLayer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(fxLayer);
    return fxLayer;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function spawnParticle(opts) {
    const layer = ensureFxLayer();
    if (!layer) return;

    const now = Date.now();
    if (opts && opts.throttleMs && now - lastFxAt < opts.throttleMs) return;
    lastFxAt = now;

    // Limit particles to keep it light
    if (layer.childElementCount > 36) {
      for (let i = 0; i < 10; i++) layer.firstChild && layer.removeChild(layer.firstChild);
    }

    const p = document.createElement('i');
    p.className = 'fx-particle';

    const x = opts && typeof opts.x === 'number' ? opts.x : rand(0.15, 0.85) * window.innerWidth;
    const y = opts && typeof opts.y === 'number' ? opts.y : rand(0.2, 0.8) * window.innerHeight;

    const dx = rand(-70, 70);
    const dy = rand(90, 160);
    const size = Math.round(rand(14, 22));
    const dur = Math.round(rand(1200, 1900));
    const rot = Math.round(rand(-18, 18));
    const scale = rand(0.85, 1.15).toFixed(2);

    p.style.setProperty('--x', `${x}px`);
    p.style.setProperty('--y', `${y}px`);
    p.style.setProperty('--dx', `${dx}px`);
    p.style.setProperty('--dy', `${dy}px`);
    p.style.setProperty('--size', `${size}px`);
    p.style.setProperty('--dur', `${dur}ms`);
    p.style.setProperty('--rot', `${rot}deg`);
    p.style.setProperty('--scale', `${scale}`);

    const glyph = fxGlyphs[Math.floor(Math.random() * fxGlyphs.length)];
    p.innerHTML = `<span>${glyph}</span>`;

    p.addEventListener('animationend', function () {
      p.remove();
    });

    layer.appendChild(p);
  }

  // ========== Stable viewport height (mobile rotate safe) ==========
  function setStableVh() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  setStableVh();
  window.addEventListener('resize', setStableVh, { passive: true });
  window.addEventListener('orientationchange', setStableVh, { passive: true });

  // ========== Header scroll effect ==========
  function updateHeader() {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', updateHeader);
  updateHeader();

  // Particles on scroll (subtle)
  let scrollFxTimer = 0;
  window.addEventListener('scroll', function () {
    if (prefersReducedMotion) return;
    if (scrollFxTimer) return;
    scrollFxTimer = window.setTimeout(function () {
      scrollFxTimer = 0;
      // spawn 1-2 particles near bottom area
      spawnParticle({ y: rand(0.55, 0.9) * window.innerHeight, throttleMs: 0 });
      if (Math.random() > 0.55) spawnParticle({ y: rand(0.55, 0.9) * window.innerHeight, throttleMs: 0 });
    }, 120);
  }, { passive: true });

  // ========== Mobile menu toggle ==========
  function toggleMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  }

  function closeMenu() {
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', toggleMenu);

    navLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });
  }

  // Tutup menu saat klik di luar
  document.addEventListener('click', function (e) {
    if (navMenu && navMenu.classList.contains('active') &&
        !navMenu.contains(e.target) && navToggle && !navToggle.contains(e.target)) {
      closeMenu();
    }
  });

  // ========== Form contact ==========
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      if (!name || !email || !message) {
        alert('Mohon lengkapi semua field.');
        return;
      }

      // Simulasi pengiriman (ganti dengan backend/Formspree/etc)
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = 'Mengirim...';
      btn.disabled = true;

      setTimeout(function () {
        btn.textContent = 'Pesan Terkirim ✓';
        btn.style.background = 'linear-gradient(135deg, #F4A6B8, #C5B4E3)';
        contactForm.reset();

        setTimeout(function () {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
        }, 2500);
      }, 800);
    });
  }

  // Animasi halus saat scroll (fade-in untuk section)
  const sections = document.querySelectorAll('.section');
  const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        // Small burst when section appears
        const rect = entry.target.getBoundingClientRect();
        const cx = rect.left + rect.width * 0.5;
        const cy = rect.top + Math.min(120, rect.height * 0.25);
        spawnParticle({ x: cx + rand(-140, 140), y: cy + rand(-20, 40), throttleMs: 250 });
        if (Math.random() > 0.45) spawnParticle({ x: cx + rand(-160, 160), y: cy + rand(-20, 40), throttleMs: 250 });
      }
    });
  }, observerOptions);

  sections.forEach(function (section) {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
  });

  // ========== Clickable images (Lightbox) ==========
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('aria-hidden', 'true');
  lightbox.innerHTML = `
    <div class="lightbox-dialog" role="dialog" aria-modal="true" aria-label="Preview gambar">
      <button type="button" class="lightbox-close" aria-label="Tutup preview">✕</button>
      <img class="lightbox-img" alt="">
    </div>
  `;
  document.body.appendChild(lightbox);

  const lightboxImg = lightbox.querySelector('.lightbox-img');
  const lightboxClose = lightbox.querySelector('.lightbox-close');
  const lightboxDialog = lightbox.querySelector('.lightbox-dialog');
  let lastFocusEl = null;

  function openLightbox(src, alt) {
    if (!src) return;
    lastFocusEl = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || 'Gambar';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    lightboxImg.src = '';
    document.body.style.overflow = navMenu && navMenu.classList.contains('active') ? 'hidden' : '';
    if (lastFocusEl && typeof lastFocusEl.focus === 'function') lastFocusEl.focus();
  }

  lightboxClose.addEventListener('click', closeLightbox);

  // Close if click outside dialog
  lightbox.addEventListener('click', function (e) {
    if (!lightboxDialog.contains(e.target)) closeLightbox();
  });

  // Close on ESC
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeLightbox();
  });

  // Make images clickable + keyboard accessible
  const clickableImages = document.querySelectorAll(
    '.portfolio-image img, .certificate-image img, .about-image img'
  );

  clickableImages.forEach(function (img) {
    img.classList.add('clickable-image');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', `Buka preview: ${img.alt || 'gambar'}`);

    img.addEventListener('click', function () {
      openLightbox(img.currentSrc || img.src, img.alt);
    });

    img.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(img.currentSrc || img.src, img.alt);
      }
    });
  });


  // ========== ANIMASI CLICK ==========
  document.addEventListener("click", function (e) {

    // Ripple circle
    const ripple = document.createElement("div");
    ripple.classList.add("click-effect");
    ripple.style.left = e.clientX + "px";
    ripple.style.top = e.clientY + "px";
    document.body.appendChild(ripple);
  
    setTimeout(() => {
      ripple.remove();
    }, 600);
  
    // Sparkle emoji
    const sparkle = document.createElement("div");
    sparkle.classList.add("sparkle");
    sparkle.innerHTML = "❤️";
    sparkle.style.left = e.clientX + "px";
    sparkle.style.top = e.clientY + "px";
    document.body.appendChild(sparkle);
  
    setTimeout(() => {
      sparkle.remove();
    }, 800);
  });



  // ========== pesan ==========

  const form = document.getElementById("contactForm");
const popup = document.getElementById("successPopup");
const closePopup = document.getElementById("closePopup");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = new FormData(form);

  fetch("https://formsubmit.co/ajax/meynurafni11@gmail.com", {
    method: "POST",
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    popup.classList.add("active");
    form.reset();
  })
  .catch(error => console.error("Error:", error));
});

closePopup.addEventListener("click", function () {
  popup.classList.remove("active");
});

});
