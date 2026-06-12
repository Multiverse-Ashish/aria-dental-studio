document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initToothMap();
  initComparisonSlider();
  initBookingWizard();
  initFAQs();
  initContactForm();
  initTourCarousel();
  initGalleryFilters();
});

/* ==========================================
   1. NAVIGATION & GENERAL INTERACTIVE SCRIPT
   ========================================== */
function initNavbar() {
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // Smooth scroll offsets for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        const offset = 90; // height of navbar
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================
   2. INTERACTIVE SVG TOOTH MAP
   ========================================== */
const toothData = {
  'tooth-molar-l': {
    name: 'Upper Left Molars',
    type: 'Molar',
    symptoms: ['Slight sensitivity to cold liquids', 'Mild localized pressure ache'],
    treatment: 'Composite Dental Filling',
    description: 'Molars are primary grinding surfaces. Sensitivity usually indicates early enamel decay or a hairline crack that is easily treatable with tooth-colored composite restorations.',
    duration: '30-40 mins',
    cost: '$150 - $250'
  },
  'tooth-premolar-l': {
    name: 'Upper Left Premolars',
    type: 'Premolar',
    symptoms: ['No active pain', 'Excellent alignment'],
    treatment: 'Routine Dental Clean & Seal',
    description: 'This area is healthy. We recommend applying a protective sealant to the deep grooves of premolars during your next clean to protect them from future decay.',
    duration: '20 mins',
    cost: '$80 - $120'
  },
  'tooth-incisors': {
    name: 'Anterior Incisors',
    type: 'Incisor (Front)',
    symptoms: ['Slight overlapping', 'Minor staining on edges'],
    treatment: 'Invisalign & Professional Whitening',
    description: 'Front teeth define your smile. Minor crowding can be corrected quickly with clear aligners. A professional clinical bleaching session will brighten the smile by up to 8 shades.',
    duration: 'Consultation + 1hr session',
    cost: 'Varies / Bleaching $399'
  },
  'tooth-premolar-r': {
    name: 'Upper Right Premolars',
    type: 'Premolar',
    symptoms: ['Food impaction', 'Gums bleed slightly when flossing'],
    treatment: 'Interproximal Scaling & Deep Clean',
    description: 'Premolars are susceptible to plaque build-up between teeth. A targeted scale and polish combined with flossing education will resolve inflammation.',
    duration: '45 mins',
    cost: '$120 - $180'
  },
  'tooth-molar-r': {
    name: 'Upper Right Molars',
    type: 'Molar',
    symptoms: ['Moderate dull throbbing pain', 'Pain when chewing hard food'],
    treatment: 'In-depth Diagnostics / Root Canal',
    description: 'Chewing pain or constant dull ache may indicate deeper decay affecting the tooth nerve. A digital scan will determine if root canal therapy or a protective crown is required.',
    duration: '60 mins',
    cost: '$800 - $1,200 (Insurance friendly)'
  }
};

function initToothMap() {
  const toothPaths = document.querySelectorAll('.tooth-path');
  const emptyCard = document.getElementById('tooth-empty-state');
  const detailCard = document.getElementById('tooth-active-state');
  
  if (toothPaths.length === 0 || !emptyCard || !detailCard) return; // Exit if not on home page

  // Element references in active card
  const toothName = document.getElementById('tooth-detail-name');
  const toothType = document.getElementById('tooth-detail-type');
  const toothDesc = document.getElementById('tooth-detail-desc');
  const toothSymptoms = document.getElementById('tooth-detail-symptoms');
  const toothTreatment = document.getElementById('tooth-detail-treatment');
  const toothDuration = document.getElementById('tooth-detail-duration');
  const toothCost = document.getElementById('tooth-detail-cost');
  const bookTreatmentBtn = document.getElementById('tooth-book-treatment');

  toothPaths.forEach(path => {
    path.addEventListener('click', () => {
      // Clear active states
      toothPaths.forEach(p => p.classList.remove('active'));
      
      // Add active state to clicked tooth
      path.classList.add('active');
      
      const id = path.id;
      const data = toothData[id];

      if (data) {
        // Populating card
        toothName.textContent = data.name;
        toothType.textContent = data.type;
        toothDesc.textContent = data.description;
        toothTreatment.textContent = data.treatment;
        toothDuration.textContent = data.duration;
        toothCost.textContent = data.cost;
        
        // Populate symptoms tags
        toothSymptoms.innerHTML = '';
        data.symptoms.forEach(symptom => {
          const span = document.createElement('span');
          span.className = 'tooth-symptom-tag';
          span.textContent = symptom;
          toothSymptoms.appendChild(span);
        });
        
        // Custom CTA update
        bookTreatmentBtn.onclick = (e) => {
          e.preventDefault();
          const selectElement = document.getElementById('booking-service');
          if (selectElement) {
            let matchedService = 'general';
            if (data.treatment.includes('Whitening') || data.treatment.includes('Invisalign')) {
              matchedService = 'cosmetic';
            } else if (data.treatment.includes('Root Canal') || data.treatment.includes('Filling')) {
              matchedService = 'surgical';
            }
            selectService(matchedService);
          }
          // Scroll to booking
          const bookingSec = document.getElementById('booking');
          if (bookingSec) {
            const offset = 90;
            const elementPosition = bookingSec.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        };

        emptyCard.style.display = 'none';
        detailCard.classList.add('active');
      }
    });
  });
}

/* ==========================================
   3. BEFORE / AFTER SMILE COMPARISON SLIDER
   ========================================== */
function initComparisonSlider() {
  const container = document.querySelector('.comparison-wrapper');
  const beforeImg = document.querySelector('.comparison-before');
  const sliderHandle = document.querySelector('.comparison-slider-handle');
  
  if (!container || !beforeImg || !sliderHandle) return; // Exit if not on home page

  let isDragging = false;

  const updateContainerWidth = () => {
    const rect = container.getBoundingClientRect();
    container.style.setProperty('--container-width', `${rect.width}px`);
  };

  // Initialize and bind to resize
  updateContainerWidth();
  window.addEventListener('resize', updateContainerWidth);

  const setSliderPosition = (x) => {
    const rect = container.getBoundingClientRect();
    let positionX = x - rect.left;
    
    if (positionX < 0) positionX = 0;
    if (positionX > rect.width) positionX = rect.width;
    
    const percentage = (positionX / rect.width) * 100;
    beforeImg.style.width = `${percentage}%`;
    sliderHandle.style.left = `${percentage}%`;
  };

  // Mouse events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch events for mobile
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    setSliderPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    setSliderPosition(e.touches[0].clientX);
  });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================
   4. MULTI-STEP BOOKING WIZARD & IMAGE UPLOAD
   ========================================== */
let selectedService = 'general'; 
let uploadedImageBase64 = null; 

function selectService(serviceId) {
  selectedService = serviceId;
  const cards = document.querySelectorAll('.service-card');
  cards.forEach(card => {
    if (card.dataset.service === serviceId) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  const selectElement = document.getElementById('booking-service');
  if (selectElement) selectElement.value = serviceId;
}

function initBookingWizard() {
  const btnNext = document.getElementById('booking-next');
  if (!btnNext) return; // Exit if not on page with booking wizard (index.html)

  const serviceCards = document.querySelectorAll('.service-card');
  serviceCards.forEach(card => {
    card.addEventListener('click', () => {
      selectService(card.dataset.service);
    });
  });

  const selectElement = document.getElementById('booking-service');
  if (selectElement) {
    selectElement.addEventListener('change', () => {
      selectService(selectElement.value);
    });
  }

  const steps = [
    document.getElementById('booking-step-1'),
    document.getElementById('booking-step-2'),
    document.getElementById('booking-step-success')
  ];

  const stepNodes = [
    document.getElementById('node-1'),
    document.getElementById('node-2'),
    document.getElementById('node-3')
  ];

  const stepLineActive = document.querySelector('.booking-step-line-active');
  const btnPrev = document.getElementById('booking-prev');
  let currentStepIdx = 0;

  function updateStepsUI() {
    steps.forEach((step, idx) => {
      if (idx === currentStepIdx) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });

    stepNodes.forEach((node, idx) => {
      if (idx < currentStepIdx) {
        node.className = 'booking-step-node completed';
        node.innerHTML = '&#10003;'; 
      } else if (idx === currentStepIdx) {
        node.className = 'booking-step-node active';
        node.textContent = idx + 1;
      } else {
        node.className = 'booking-step-node';
        node.textContent = idx + 1;
      }
    });

    const progressPercent = currentStepIdx === 0 ? 0 : currentStepIdx === 1 ? 50 : 100;
    if (stepLineActive) stepLineActive.style.width = `${progressPercent}%`;

    if (currentStepIdx === 0) {
      btnPrev.style.visibility = 'hidden';
      btnNext.textContent = 'Next Step';
    } else if (currentStepIdx === 1) {
      btnPrev.style.visibility = 'visible';
      btnNext.textContent = 'Book Consultation';
    } else {
      btnPrev.style.display = 'none';
      btnNext.style.display = 'none';
      document.querySelector('.booking-actions').style.display = 'none';
    }
  }

  btnNext.addEventListener('click', () => {
    if (currentStepIdx === 0) {
      currentStepIdx = 1;
      updateStepsUI();
    } else if (currentStepIdx === 1) {
      const name = document.getElementById('booking-name').value.trim();
      const email = document.getElementById('booking-email').value.trim();
      const date = document.getElementById('booking-date').value.trim();
      const notes = document.getElementById('booking-notes').value.trim();

      if (!name || !email || !date) {
        alert('Please fill out all required fields (Name, Email, and Date).');
        return;
      }

      document.getElementById('summary-name').textContent = name;
      document.getElementById('summary-email').textContent = email;
      document.getElementById('summary-date').textContent = date;
      document.getElementById('summary-notes').textContent = notes || 'None';
      
      const serviceLabels = {
        'general': 'General Treatment & Cleaning',
        'cosmetic': 'Cosmetic Smile Makeover',
        'surgical': 'Restorative / Surgical Dentistry'
      };
      document.getElementById('summary-service').textContent = serviceLabels[selectedService];

      // Premium options mapping
      const practitionerSelect = document.getElementById('booking-practitioner');
      const practitionerLabels = {
        'none': 'No Preference (First Available)',
        'stone': 'Dr. Evelyn Stone (Chief Cosmetic Surgeon)',
        'vance': 'Dr. Marcus Vance (Restorative Specialist)'
      };
      const practitionerVal = practitionerSelect ? practitionerSelect.value : 'none';
      const summaryPractitioner = document.getElementById('summary-practitioner');
      if (summaryPractitioner) {
        summaryPractitioner.textContent = practitionerLabels[practitionerVal] || practitionerVal;
      }

      const billingSelect = document.getElementById('booking-billing');
      const billingLabels = {
        'private': 'Private Pay / Self-Pay',
        'insurance': 'PPO Dental Insurance Coordination'
      };
      const billingVal = billingSelect ? billingSelect.value : 'private';
      const summaryBilling = document.getElementById('summary-billing');
      if (summaryBilling) {
        summaryBilling.textContent = billingLabels[billingVal] || billingVal;
      }

      const historyCheckboxes = document.querySelectorAll('input[name="history"]:checked');
      const historyList = [];
      historyCheckboxes.forEach(cb => {
        const labelSpan = cb.nextElementSibling;
        if (labelSpan) {
          historyList.push(labelSpan.textContent.trim());
        }
      });
      const summaryHistory = document.getElementById('summary-history');
      if (summaryHistory) {
        summaryHistory.textContent = historyList.length > 0 ? historyList.join(', ') : 'None Reported';
      }

      const summaryPhoto = document.getElementById('summary-photo');
      if (uploadedImageBase64) {
        summaryPhoto.src = uploadedImageBase64;
        summaryPhoto.style.display = 'block';
      } else {
        summaryPhoto.style.display = 'none';
      }

      currentStepIdx = 2;
      updateStepsUI();
    }
  });

  btnPrev.addEventListener('click', () => {
    if (currentStepIdx > 0) {
      currentStepIdx--;
      updateStepsUI();
    }
  });

  // Photo upload widgets
  const uploadBox = document.getElementById('upload-box');
  const fileInput = document.getElementById('profile-file-input');
  const previewWrapper = document.getElementById('preview-wrapper');
  const previewImg = document.getElementById('preview-img');
  const removeBtn = document.getElementById('remove-photo-btn');

  if (uploadBox && fileInput) {
    uploadBox.addEventListener('click', () => {
      fileInput.click();
    });

    uploadBox.addEventListener('dragover', (e) => {
      e.preventDefault();
      uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
      uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
      e.preventDefault();
      uploadBox.classList.remove('drag-over');
      if (e.dataTransfer.files.length > 0) {
        handleImageFile(e.dataTransfer.files[0]);
      }
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        handleImageFile(fileInput.files[0]);
      }
    });

    removeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      uploadedImageBase64 = null;
      fileInput.value = '';
      previewWrapper.classList.remove('active');
      uploadBox.style.display = 'block';
    });
  }

  function handleImageFile(file) {
    if (!file.type.startsWith('image/')) {
      alert('Only image files are allowed.');
      return;
    }
    
    if (file.size > 4 * 1024 * 1024) {
      alert('File size exceeds the 4MB limit.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      uploadedImageBase64 = e.target.result;
      previewImg.src = uploadedImageBase64;
      previewWrapper.classList.add('active');
      uploadBox.style.display = 'none';
    };
    reader.readAsDataURL(file);
  }
}

/* ==========================================
   5. FAQ ACCORDION HANDLER
   ========================================== */
function initFAQs() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (faqQuestions.length === 0) return; // Exit if not on contact.html

  faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const isActive = item.classList.contains('active');
      
      // Close all other items
      document.querySelectorAll('.faq-item').forEach(faqItem => {
        faqItem.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================
   6. CONTACT FORM SUBMISSION INTERCEPT
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-inquiry-form');
  const successMsg = document.getElementById('contact-success-msg');

  if (!form || !successMsg) return; // Exit if not on contact.html

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Simulate submission
    form.style.display = 'none';
    successMsg.style.display = 'block';
  });
}

/* ==========================================
   7. CLINIC TOUR CAROUSEL
   ========================================== */
function initTourCarousel() {
  const container = document.querySelector('.carousel-container');
  if (!container) return; // Exit if not on index.html

  const track = container.querySelector('.carousel-track');
  const slides = container.querySelectorAll('.carousel-slide');
  const nextBtn = container.querySelector('.next-btn');
  const prevBtn = container.querySelector('.prev-btn');
  const indicators = container.querySelectorAll('.indicator');

  let currentIdx = 0;
  const slideCount = slides.length;
  let autoSlideInterval;

  const updateCarousel = (idx) => {
    if (idx < 0) {
      currentIdx = slideCount - 1;
    } else if (idx >= slideCount) {
      currentIdx = 0;
    } else {
      currentIdx = idx;
    }

    const shiftPercent = currentIdx * -33.333;
    track.style.transform = `translateX(${shiftPercent}%)`;

    slides.forEach((slide, i) => {
      if (i === currentIdx) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    indicators.forEach((indicator, i) => {
      if (i === currentIdx) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  };

  nextBtn.addEventListener('click', () => {
    resetAutoSlide();
    updateCarousel(currentIdx + 1);
  });

  prevBtn.addEventListener('click', () => {
    resetAutoSlide();
    updateCarousel(currentIdx - 1);
  });

  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      resetAutoSlide();
      const slideIndex = parseInt(indicator.dataset.slide, 10);
      updateCarousel(slideIndex);
    });
  });

  const startAutoSlide = () => {
    autoSlideInterval = setInterval(() => {
      updateCarousel(currentIdx + 1);
    }, 5000);
  };

  const resetAutoSlide = () => {
    clearInterval(autoSlideInterval);
    startAutoSlide();
  };

  startAutoSlide();

  container.addEventListener('mouseenter', () => {
    clearInterval(autoSlideInterval);
  });

  container.addEventListener('mouseleave', () => {
    startAutoSlide();
  });
}

/* ==========================================
   8. SMILE GALLERY FILTERING
   ========================================== */
function initGalleryFilters() {
  const filterBtns = document.querySelectorAll('.gallery-filter-btn');
  const galleryCards = document.querySelectorAll('.gallery-card');

  if (filterBtns.length === 0 || galleryCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      filterBtns.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      btn.classList.add('active');

      const category = btn.dataset.category;

      galleryCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}
