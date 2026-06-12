/* ==========================================
   ARIA DENTAL STUDIO — app.js
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initComparison();
  initBooking();
  initCarousel();
  initGallery();
  initFAQ();
  initWhatsApp();
  initScrollReveal();
});

/* ==========================================
   1. NAVIGATION — Hamburger + Scroll Shrink
   ========================================== */
function initNav() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  const navbar = document.querySelector('.navbar');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // Scroll shrink
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 60) {
        navbar.style.boxShadow = '0 4px 30px rgba(197,168,128,0.1)';
      } else {
        navbar.style.boxShadow = 'none';
      }
    }
  }, { passive: true });
}

/* ==========================================
   2. BEFORE/AFTER COMPARISON SLIDER
   ========================================== */
function initComparison() {
  const wrapper = document.querySelector('.comparison-wrapper');
  if (!wrapper) return;

  const before = wrapper.querySelector('.comparison-before');
  const handle = wrapper.querySelector('.comparison-slider-handle');
  if (!before || !handle) return;

  let isDragging = false;
  let startPos = 50;

  const setPosition = (pct) => {
    const clamped = Math.max(5, Math.min(95, pct));
    before.style.width = `${clamped}%`;
    handle.style.left = `${clamped}%`;
    if (before.querySelector('img')) {
      const totalWidth = wrapper.offsetWidth;
      before.querySelector('img').style.width = `${totalWidth}px`;
    }
  };

  const getPercent = (clientX) => {
    const rect = wrapper.getBoundingClientRect();
    return ((clientX - rect.left) / rect.width) * 100;
  };

  // Initialize position
  setPosition(50);

  handle.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
  handle.addEventListener('touchstart', (e) => { isDragging = true; }, { passive: true });

  wrapper.addEventListener('mousedown', (e) => { isDragging = true; setPosition(getPercent(e.clientX)); });
  wrapper.addEventListener('touchstart', (e) => {
    isDragging = true;
    setPosition(getPercent(e.touches[0].clientX));
  }, { passive: true });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setPosition(getPercent(e.clientX));
  });

  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setPosition(getPercent(e.touches[0].clientX));
  }, { passive: true });

  document.addEventListener('mouseup', () => { isDragging = false; });
  document.addEventListener('touchend', () => { isDragging = false; });
}

/* ==========================================
   3. BOOKING FORM — Multi-Step + Popup Modal
   ========================================== */
function initBooking() {
  const steps = [
    document.getElementById('booking-step-1'),
    document.getElementById('booking-step-2'),
  ];
  const successView = document.getElementById('booking-step-success');
  const nextBtn = document.getElementById('booking-next');
  const prevBtn = document.getElementById('booking-prev');
  const actionsBar = document.getElementById('booking-actions');
  const stepNodes = [
    document.getElementById('node-1'),
    document.getElementById('node-2'),
    document.getElementById('node-3'),
  ];
  const lineActive = document.querySelector('.booking-step-line-active');

  let currentStep = 0;

  const updateUI = () => {
    steps.forEach((s, i) => s.classList.toggle('active', i === currentStep));
    if (successView) successView.classList.remove('active');

    stepNodes.forEach((n, i) => {
      n.classList.toggle('active', i === currentStep);
      n.classList.toggle('completed', i < currentStep);
    });

    if (lineActive) {
      lineActive.style.width = currentStep === 0 ? '0%' : '50%';
    }

    if (prevBtn) prevBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.textContent = currentStep === 0 ? 'Next Step' : 'Confirm Booking';
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        updateUI();
      } else {
        // Trigger success
        handleBookingSuccess();
      }
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentStep > 0) { currentStep--; updateUI(); }
    });
  }

  // Service card selection
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', () => {
      document.querySelectorAll('.service-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      const svc = card.dataset.service;
      const sel = document.getElementById('booking-service');
      if (sel && svc) sel.value = svc;
    });
  });

  // File Upload Preview
  const uploadBox = document.getElementById('upload-box');
  const fileInput = document.getElementById('profile-file-input');
  const previewWrapper = document.getElementById('preview-wrapper');
  const previewImg = document.getElementById('preview-img');
  const removeBtn = document.getElementById('remove-photo-btn');

  if (uploadBox && fileInput) {
    uploadBox.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (previewImg) previewImg.src = ev.target.result;
        if (previewWrapper) {
          previewWrapper.style.display = 'block';
          previewWrapper.classList.add('active');
        }
      };
      reader.readAsDataURL(file);
    });

    uploadBox.addEventListener('dragover', (e) => { e.preventDefault(); uploadBox.classList.add('drag-over'); });
    uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('drag-over'));
    uploadBox.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadBox.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (previewImg) previewImg.src = ev.target.result;
        if (previewWrapper) {
          previewWrapper.style.display = 'block';
          previewWrapper.classList.add('active');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  if (removeBtn && previewWrapper && fileInput) {
    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      previewWrapper.style.display = 'none';
      previewWrapper.classList.remove('active');
      fileInput.value = '';
    });
  }

  function handleBookingSuccess() {
    const name = document.getElementById('booking-name')?.value?.trim() || '—';
    const email = document.getElementById('booking-email')?.value?.trim() || '—';
    const date = document.getElementById('booking-date')?.value || '';
    const notes = document.getElementById('booking-notes')?.value?.trim() || 'None';
    const serviceEl = document.getElementById('booking-service');
    const service = serviceEl ? serviceEl.options[serviceEl.selectedIndex]?.text : '—';
    const practitionerEl = document.getElementById('booking-practitioner');
    const practitioner = practitionerEl ? practitionerEl.options[practitionerEl.selectedIndex]?.text : '—';

    const formatDate = (d) => {
      if (!d) return '—';
      const [y, m, day] = d.split('-');
      const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
      return `${months[parseInt(m)-1]} ${day}, ${y}`;
    };

    // Inline success view
    if (document.getElementById('summary-name')) document.getElementById('summary-name').textContent = name;
    if (document.getElementById('summary-email')) document.getElementById('summary-email').textContent = email;
    if (document.getElementById('summary-service')) document.getElementById('summary-service').textContent = service;
    if (document.getElementById('summary-date')) document.getElementById('summary-date').textContent = formatDate(date);
    if (document.getElementById('summary-notes')) document.getElementById('summary-notes').textContent = notes;
    if (document.getElementById('summary-practitioner')) document.getElementById('summary-practitioner').textContent = practitioner;

    // Show popup modal
    const modal = document.getElementById('booking-success-modal');
    const overlay = document.getElementById('booking-modal-overlay');
    if (document.getElementById('modal-name')) document.getElementById('modal-name').textContent = name;
    if (document.getElementById('modal-service')) document.getElementById('modal-service').textContent = service;
    if (document.getElementById('modal-date')) document.getElementById('modal-date').textContent = formatDate(date);

    if (modal) modal.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Also show inline success
    steps.forEach(s => s.classList.remove('active'));
    if (successView) successView.classList.add('active');
    if (actionsBar) actionsBar.style.display = 'none';
    stepNodes.forEach((n, i) => {
      n.classList.toggle('active', i === 2);
      n.classList.remove('completed');
    });
    if (lineActive) lineActive.style.width = '100%';
  }

  // Close popup modal
  const modalClose = document.getElementById('modal-close-btn');
  const modalOverlay = document.getElementById('booking-modal-overlay');
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      const modal = document.getElementById('booking-success-modal');
      if (modal) modal.classList.remove('active');
      if (modalOverlay) modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
  if (modalOverlay) {
    modalOverlay.addEventListener('click', () => {
      const modal = document.getElementById('booking-success-modal');
      if (modal) modal.classList.remove('active');
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  updateUI();
}

/* ==========================================
   4. CLINIC TOUR CAROUSEL
   ========================================== */
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const slides = track.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  let current = 0;
  let interval;

  const go = (n) => {
    current = (n + slides.length) % slides.length;
    track.style.transform = `translateX(-${(current * 100) / 3}%)`;
    slides.forEach((s, i) => s.classList.toggle('active', i === current));
    indicators.forEach((dot, i) => dot.classList.toggle('active', i === current));
  };

  const autoPlay = () => { interval = setInterval(() => go(current + 1), 5000); };
  const resetAuto = () => { clearInterval(interval); autoPlay(); };

  if (prevBtn) prevBtn.addEventListener('click', () => { go(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { go(current + 1); resetAuto(); });

  indicators.forEach((dot, i) => {
    dot.addEventListener('click', () => { go(i); resetAuto(); });
  });

  // Touch support
  let touchStartX = 0;
  const trackWrapper = document.querySelector('.carousel-track-wrapper');
  if (trackWrapper) {
    trackWrapper.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    trackWrapper.addEventListener('touchend', (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) { go(diff > 0 ? current + 1 : current - 1); resetAuto(); }
    });
  }

  autoPlay();
}

/* ==========================================
   5. GALLERY FILTER
   ========================================== */
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const cards = document.querySelectorAll('.gallery-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.category;

      cards.forEach(card => {
        const shouldShow = cat === 'all' || card.dataset.category === cat;
        card.style.opacity = '0';
        card.style.transform = 'scale(0.97)';
        card.style.display = shouldShow ? 'block' : 'none';

        if (shouldShow) {
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            }, 20);
          });
        }
      });
    });
  });
}

/* ==========================================
   6. FAQ ACCORDION
   ========================================== */
function initFAQ() {
  const faqs = document.querySelectorAll('.faq-item');

  faqs.forEach(item => {
    const btn = item.querySelector('.faq-question');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Close all
      faqs.forEach(f => f.classList.remove('active'));
      // Toggle clicked
      if (!isActive) item.classList.add('active');
    });
  });
}

/* ==========================================
   7. WHATSAPP ICON-ONLY + POPUP FORM
   ========================================== */
function initWhatsApp() {
  const btn = document.getElementById('whatsapp-btn');
  const popup = document.getElementById('whatsapp-popup');
  const closeBtn = document.getElementById('whatsapp-close');
  const sendBtn = document.getElementById('wa-send-btn');
  const nameInput = document.getElementById('wa-name');
  const msgInput = document.getElementById('wa-msg');
  const PHONE = '13105550190';

  if (!btn || !popup) return;

  btn.addEventListener('click', () => {
    popup.classList.toggle('active');
    if (popup.classList.contains('active') && nameInput) {
      setTimeout(() => nameInput.focus(), 300);
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => popup.classList.remove('active'));
  }

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const name = nameInput?.value?.trim();
      const msg = msgInput?.value?.trim();

      if (!name) {
        nameInput?.focus();
        nameInput?.style && (nameInput.style.borderColor = 'red');
        return;
      }
      if (!msg) {
        msgInput?.focus();
        msgInput?.style && (msgInput.style.borderColor = 'red');
        return;
      }

      const text = encodeURIComponent(`Hi! I'm ${name}.\n\n${msg}`);
      window.open(`https://wa.me/${PHONE}?text=${text}`, '_blank');
      popup.classList.remove('active');
    });
  }

  // Reset border on input
  [nameInput, msgInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => { input.style.borderColor = ''; });
    }
  });
}

/* ==========================================
   8. SCROLL REVEAL ANIMATION
   ========================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-fade');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  elements.forEach(el => observer.observe(el));
}
