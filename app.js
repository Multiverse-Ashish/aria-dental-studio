/*
  =========================================
  ApexTools Interactive Controls (app.js)
  =========================================
*/

document.addEventListener('DOMContentLoaded', () => {
  // 0. Theme Manager (Light / Dark Mode)
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  const headerActions = document.querySelector('.header-actions');
  if (headerActions) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'theme-toggle-btn';
    toggleBtn.setAttribute('aria-label', 'Toggle light/dark theme');
    
    const renderToggleIcon = () => {
      const isLight = document.body.classList.contains('light-theme');
      toggleBtn.innerHTML = isLight 
        ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>` // Moon SVG
        : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`; // Sun SVG
    };

    renderToggleIcon();
    headerActions.insertBefore(toggleBtn, headerActions.firstChild);

    toggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      const currentTheme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
      localStorage.setItem('theme', currentTheme);
      renderToggleIcon();
    });
  }

  // 1. Sticky Navigation Scroll Effect
  const header = document.querySelector('header');
  const checkScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Run initially on load

  // 2. Search & Category Filters
  const searchInput = document.getElementById('tool-search');
  const filterTags = document.querySelectorAll('.filter-tag');
  const toolCards = document.querySelectorAll('.tool-card');
  const noResults = document.querySelector('.no-results');

  let currentCategory = 'all';
  let searchQuery = '';

  const filterTools = () => {
    let visibleCount = 0;

    toolCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      const toolTitle = card.querySelector('h3').textContent.toLowerCase();
      const toolDesc = card.querySelector('p').textContent.toLowerCase();
      
      const matchesCategory = currentCategory === 'all' || cardCategory === currentCategory;
      const matchesSearch = toolTitle.includes(searchQuery) || toolDesc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        card.style.display = 'flex';
        // Add subtle entrance animation
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
        visibleCount++;
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
        card.style.transform = 'scale(0.95)';
      }
    });

    // Toggle No Results Block
    if (visibleCount === 0) {
      noResults.style.display = 'block';
    } else {
      noResults.style.display = 'none';
    }
  };

  // Category Tag Clicks
  filterTags.forEach(tag => {
    tag.addEventListener('click', () => {
      filterTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      currentCategory = tag.getAttribute('data-filter');
      filterTools();
    });
  });

  // Search Input Handler
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterTools();
    });
  }

  // 3. Checkout Simulator Modal
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutTriggers = document.querySelectorAll('.trigger-checkout');
  const modalClose = document.querySelector('.modal-close');
  const checkoutForm = document.getElementById('checkout-form');
  const formState = document.getElementById('form-state');
  const successState = document.getElementById('success-state');
  const submitBtn = checkoutForm?.querySelector('button[type="submit"]');

  const openCheckout = () => {
    if (checkoutModal) {
      checkoutModal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
      // Reset form states
      if (formState && successState) {
        formState.style.display = 'block';
        successState.style.display = 'none';
      }
      if (checkoutForm) checkoutForm.reset();
      if (submitBtn) {
        submitBtn.innerHTML = 'Complete Purchase';
        submitBtn.disabled = false;
      }
    }
  };

  const closeCheckout = () => {
    if (checkoutModal) {
      checkoutModal.classList.remove('active');
      document.body.style.overflow = ''; // Restore background scroll
    }
  };

  checkoutTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openCheckout();
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeCheckout);
  }

  // Close modal when clicking outside of modal content
  if (checkoutModal) {
    checkoutModal.addEventListener('click', (e) => {
      if (e.target === checkoutModal) {
        closeCheckout();
      }
    });
  }

  // Simulated Payment Form Submission
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic Validation Check
      const emailInput = document.getElementById('card-email');
      const cardNum = document.getElementById('card-number');
      if (!emailInput.value || !cardNum.value) return;

      // Simulate payment processing delay
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="spinner" style="animation: spin 1s linear infinite; margin-right: 8px; display: inline-block; vertical-align: middle;">
            <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)"></circle>
            <path d="M12 2a10 10 0 0 1 10 10"></path>
          </svg>
          Processing...
        `;
      }

      setTimeout(() => {
        // Transition to success layout
        if (formState && successState) {
          formState.style.display = 'none';
          successState.style.display = 'block';
        }
      }, 1500);
    });
  }

  // 4. Scroll Reveal Animations (Subtle fade-in effect)
  const revealElements = document.querySelectorAll('.stat-item, .tool-card, .pricing-card, .prose-container');
  
  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.05,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)';
    revealOnScroll.observe(el);
  });
});

// Keyframe Spinner Rotation Style injection (ensures clean self-containment)
const styleNode = document.createElement('style');
styleNode.innerHTML = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleNode);
