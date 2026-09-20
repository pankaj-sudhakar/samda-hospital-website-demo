/**
 * SAMDA SUPERSPECIALITY HOSPITAL - JAVASCRIPT LOGIC
 * Hospital information, doctor-directory filtering, Booking Mitra availability
 * enquiries, insurance lookup, and accessible interactive components.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSearch();
  initSpecialtyFilter();
  initDoctorDirectory();
  initDepartmentDoctorLinks();
  initBookingMitra();
  renameBookingControls();
  enhanceDoctorCards();
  optimizeImages();
  initInsuranceLookup();
  initFAQAccordion();
  initContactInquiry();
  updateDynamicYear();
});

document.addEventListener('samda:cms-rendered', () => {
  initSpecialtyFilter();
  initDoctorDirectory();
  initDepartmentDoctorLinks();
  renameBookingControls();
  enhanceDoctorCards();
});

// ================= 1. NAVIGATION & MOBILE DRAWER =================
function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const closeDrawerBtn = document.getElementById('closeDrawerBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const navLinks = document.querySelectorAll('.nav-link');

  let lastFocusedElement;

  function openDrawer() {
    lastFocusedElement = document.activeElement;
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    mobileDrawer.removeAttribute('hidden');
    drawerOverlay.removeAttribute('hidden');
    mobileMenuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeDrawerBtn?.focus();
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    mobileDrawer.setAttribute('hidden', '');
    drawerOverlay.setAttribute('hidden', '');
    mobileMenuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    lastFocusedElement?.focus();
  }

  if (mobileDrawer) mobileDrawer.setAttribute('hidden', '');
  if (drawerOverlay) drawerOverlay.setAttribute('hidden', '');
  if (mobileMenuBtn) {
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-controls', 'mobileDrawer');
    mobileMenuBtn.addEventListener('click', openDrawer);
  }
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && mobileDrawer?.classList.contains('open')) closeDrawer();
  });

  // Active Link Highlighting on Scroll
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 120;
    const sections = document.querySelectorAll('section[id]');

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

// ================= 2. HERO QUICK SEARCH =================
function initHeroSearch() {
  const searchInput = document.getElementById('heroSearchInput');
  const searchBtn = document.getElementById('heroSearchBtn');
  const tagBtns = document.querySelectorAll('.tag-btn');
  const guidance = document.getElementById('searchGuidance');

  const updateGuidance = message => {
    if (guidance) guidance.textContent = message;
  };

  performCareSearch = function(query) {
    if (!query || !query.trim()) return;
    const q = query.trim().toLowerCase();
    const doctorInput = document.getElementById('doctorSearchInput');
    const doctorDeptSelect = document.getElementById('doctorDeptSelect');

    if (doctorInput) doctorInput.value = query;
    if (doctorDeptSelect) doctorDeptSelect.value = 'all';
    if (typeof filterDoctors === 'function') filterDoctors();
    document.getElementById('doctors')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    updateGuidance(`Showing doctors and departments matching “${q}”. If you are unsure which specialist to see, please call or message reception for guidance.`);
    showToast('Showing matching doctors and departments');
  };

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => performCareSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performCareSearch(searchInput.value);
    });
  }

  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      performCareSearch(q);
    });
  });
}

// ================= 3. SPECIALTY CATEGORY FILTERING =================
function initSpecialtyFilter() {
  const tabs = document.querySelectorAll('.dept-tab');
  const cards = document.querySelectorAll('.specialty-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetCategory = tab.getAttribute('data-dept');

      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (targetCategory === 'all' || category === targetCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Handle department availability requests.
  const specialtyBookBtns = document.querySelectorAll('.book-specialty-btn');
  specialtyBookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const doctorName = btn.getAttribute('data-doctor');
      openBookingMitraWithDoctor(doctorName);
    });
  });
}

// ================= 4. DOCTOR DIRECTORY FILTER & SEARCH =================
let filterDoctors;
let performCareSearch;

function initDoctorDirectory() {
  const searchInput = document.getElementById('doctorSearchInput');
  const deptSelect = document.getElementById('doctorDeptSelect');
  const careSearchBtn = document.getElementById('doctorCareSearchBtn');
  const doctorCards = document.querySelectorAll('.doctor-card');
  const filterBar = document.querySelector('.doctor-filter-bar');
  let resultsStatus = document.getElementById('doctorResultsStatus');
  let clearFiltersButton = document.getElementById('clearDoctorFilters');

  if (filterBar && !resultsStatus) {
    resultsStatus = document.createElement('p');
    resultsStatus.id = 'doctorResultsStatus';
    resultsStatus.className = 'doctor-results-status';
    resultsStatus.setAttribute('aria-live', 'polite');
    filterBar.insertAdjacentElement('afterend', resultsStatus);
  }
  if (filterBar && !clearFiltersButton) {
    clearFiltersButton = document.createElement('button');
    clearFiltersButton.id = 'clearDoctorFilters';
    clearFiltersButton.type = 'button';
    clearFiltersButton.className = 'clear-doctor-filters';
    clearFiltersButton.textContent = 'Clear filters';
    clearFiltersButton.hidden = true;
    resultsStatus?.insertAdjacentElement('afterend', clearFiltersButton);
    clearFiltersButton.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      if (deptSelect) deptSelect.value = 'all';
      filterDoctors();
      searchInput?.focus();
    });
  }

  filterDoctors = function() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedDept = deptSelect ? deptSelect.value.toLowerCase() : 'all';

    let visibleCount = 0;
    doctorCards.forEach(card => {
      const docName = card.getAttribute('data-name').toLowerCase();
      const docDept = card.getAttribute('data-dept').toLowerCase();
      const cardText = card.innerText.toLowerCase();

      const matchesSearch = !query || docName.includes(query) || cardText.includes(query);
      const matchesDept = selectedDept === 'all' || docDept.includes(selectedDept);

      if (matchesSearch && matchesDept) {
        card.style.display = 'flex';
        visibleCount += 1;
      } else {
        card.style.display = 'none';
      }
    });
    const hasFilter = Boolean(query) || selectedDept !== 'all';
    if (resultsStatus) resultsStatus.textContent = hasFilter ? `${visibleCount} doctor${visibleCount === 1 ? '' : 's'} found.` : '';
    if (clearFiltersButton) clearFiltersButton.hidden = !hasFilter;
  };

  if (searchInput) searchInput.addEventListener('input', filterDoctors);
  if (deptSelect) deptSelect.addEventListener('change', filterDoctors);
  if (careSearchBtn && searchInput) {
    careSearchBtn.addEventListener('click', () => performCareSearch?.(searchInput.value));
    searchInput.addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        performCareSearch?.(searchInput.value);
      }
    });
  }

  // Doctor card book buttons
  const bookDocBtns = document.querySelectorAll('.book-doc-btn');
  bookDocBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const doc = btn.getAttribute('data-doctor');
      openBookingMitraWithDoctor(doc);
    });
  });
}

function initDepartmentDoctorLinks() {
  const links = document.querySelectorAll('.department-doctor-link, .doc-department[data-dept]');
  const deptSelect = document.getElementById('doctorDeptSelect');
  const doctors = document.getElementById('doctors');

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (deptSelect) deptSelect.value = link.dataset.dept;
      if (filterDoctors) filterDoctors();
      doctors?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

function renameBookingControls() {
  document.querySelectorAll('.book-specialty-btn, .book-doc-btn').forEach(button => {
    button.innerHTML = '<i class="fa-solid fa-user-clock"></i> Check Availability';
    button.setAttribute('aria-label', `Check doctor availability: ${button.dataset.doctor || button.dataset.dept || ''}`.trim());
  });
}

function enhanceDoctorCards() {
  const departmentNames = {
    urology: 'Urology & Renal Care', gastro: 'GI & Laparoscopic Surgery',
    ortho: 'Orthopedics & Trauma', derma: 'Dermatology & Cosmetology',
    gynae: 'Obstetrics & Gynecology', general: 'General Surgery',
    physician: 'General Medicine & ICU', neuro: 'Neurosurgery',
    dental: 'Dental & Maxillofacial'
  };

  document.querySelectorAll('.doctor-card').forEach(card => {
    const department = departmentNames[card.dataset.dept];
    const meta = card.querySelector('.doc-meta');
    if (department && meta && !meta.querySelector('.doc-department')) {
      const link = document.createElement('a');
      link.className = 'doc-department';
      link.href = '#department-teams';
      link.textContent = department;
      link.setAttribute('aria-label', `View ${department} department`);
      meta.append(link);
    }

    const profiles = window.SAMDA_DOCTOR_PROFILES || {};
    const cardName = (card.dataset.name || '').toLowerCase().replace(/[^a-z]/g, '');
    const profileSlug = Object.entries(profiles).find(([, profile]) => profile.name.toLowerCase().replace(/[^a-z]/g, '') === cardName)?.[0];
    const actions = card.querySelector('.doc-actions');
    if (profileSlug && actions && !actions.querySelector('.view-doctor-profile')) {
      const nameHeading = card.querySelector('.doc-name');
      if (nameHeading && !nameHeading.querySelector('a')) {
        const nameLink = document.createElement('a');
        nameLink.className = 'doc-profile-name';
        nameLink.href = `doctor-profile.html?doctor=${encodeURIComponent(profileSlug)}`;
        nameLink.textContent = profiles[profileSlug].name;
        nameHeading.replaceChildren(nameLink);
      }
      const profileLink = document.createElement('a');
      profileLink.className = 'btn btn-outline btn-sm view-doctor-profile';
      profileLink.href = `doctor-profile.html?doctor=${encodeURIComponent(profileSlug)}`;
      profileLink.innerHTML = '<i class="fa-regular fa-id-card"></i> View Profile';
      profileLink.setAttribute('aria-label', `View ${profiles[profileSlug].name} profile`);
      actions.prepend(profileLink);
    }
  });
}

function optimizeImages() {
  document.querySelectorAll('main img').forEach(image => {
    image.decoding = 'async';
    if (!image.closest('.hero-section')) image.loading = 'lazy';
  });
}

// ================= 5. BOOKING MITRA AVAILABILITY ENQUIRY =================
function initBookingMitra() {
  const bookingModal = document.getElementById('bookingMitraModal');
  const closeBookingModalBtn = document.getElementById('closeBookingMitraModal');
  const quickBookBtn = document.getElementById('quickBookBtn');
  const heroBookBtn = document.getElementById('heroBookBtn');
  const aboutBookBtn = document.getElementById('aboutBookBtn');
  const mobileBookBtn = document.getElementById('mobileBookBtn');
  const floatingBookBtn = document.getElementById('floatingBookBtn');
  const availabilityForm = document.getElementById('availabilityForm');
  const confirmWhatsappBtn = document.getElementById('checkAvailabilityBtn');

  let lastFocusedElement;

  function openModal() {
    lastFocusedElement = document.activeElement;
    bookingModal.classList.add('active');
    bookingModal.removeAttribute('hidden');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    closeBookingModalBtn?.focus();
  }

  function closeModal() {
    bookingModal.classList.remove('active');
    bookingModal.setAttribute('hidden', '');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocusedElement?.focus();
  }

  if (bookingModal) {
    bookingModal.setAttribute('role', 'dialog');
    bookingModal.setAttribute('aria-modal', 'true');
    bookingModal.setAttribute('aria-hidden', 'true');
    bookingModal.setAttribute('hidden', '');
  }

  if (quickBookBtn) quickBookBtn.addEventListener('click', openModal);
  if (heroBookBtn) heroBookBtn.addEventListener('click', openModal);
  if (aboutBookBtn) aboutBookBtn.addEventListener('click', openModal);
  if (mobileBookBtn) mobileBookBtn.addEventListener('click', openModal);
  if (floatingBookBtn) floatingBookBtn.addEventListener('click', openModal);
  if (closeBookingModalBtn) closeBookingModalBtn.addEventListener('click', closeModal);

  // Close modal when clicking outside
  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeModal();
    });
  }

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && bookingModal?.classList.contains('active')) closeModal();
  });

  // Confirm via WhatsApp
  if (confirmWhatsappBtn) {
    confirmWhatsappBtn.addEventListener('click', () => {
      if (!availabilityForm.reportValidity()) return;
      const doctor = document.getElementById('bookDoctor').value || 'Any Available Specialist';
      const time = document.getElementById('availabilityWindow').value || 'Today';
      const name = document.getElementById('patientName').value || 'Patient';
      const phone = document.getElementById('patientPhone').value || 'Not provided';
      const remarks = document.getElementById('patientRemarks').value || 'Please share the next available time and request a callback.';

      const msg = `*BOOKING MITRA — DOCTOR AVAILABILITY REQUEST*%0A%0A` +
        `👤 *Patient Name:* ${encodeURIComponent(name)}%0A` +
        `📱 *Contact:* ${encodeURIComponent(phone)}%0A` +
        `🩺 *Specialist:* ${encodeURIComponent(doctor)}%0A` +
        `⏰ *Preferred time:* ${encodeURIComponent(time)}%0A` +
        `📝 *Message:* ${encodeURIComponent(remarks)}%0A%0A` +
        `_Please check the doctor's current availability and request a callback. This is not an appointment booking._`;

      const waUrl = `https://wa.me/919425529769?text=${msg}`;
      window.open(waUrl, '_blank');
      closeModal();
      showToast('Opening WhatsApp to ask Booking Mitra about availability...', 'success');
    });
  }

  if (availabilityForm) {
    availabilityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      confirmWhatsappBtn.click();
    });
  }
}

function openBookingMitraWithDoctor(doctorName) {
  const bookingModal = document.getElementById('bookingMitraModal');
  const bookDoctorSelect = document.getElementById('bookDoctor');

  if (bookDoctorSelect && doctorName) {
    // Find matching option
    for (let opt of bookDoctorSelect.options) {
      if (opt.text.toLowerCase().includes(doctorName.toLowerCase()) || opt.value.toLowerCase().includes(doctorName.toLowerCase())) {
        bookDoctorSelect.value = opt.value;
        break;
      }
    }
  }

  if (bookingModal) {
    bookingModal.classList.add('active');
    bookingModal.removeAttribute('hidden');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('closeBookingMitraModal')?.focus();
  }
}

// ================= 6. INSURANCE & TPA LOOKUP =================
function initInsuranceLookup() {
  const tpaInput = document.getElementById('tpaSearchInput');
  const tpaList = document.getElementById('tpaList');
  const tpaPills = document.querySelectorAll('.tpa-pill');

  if (tpaInput && tpaList) {
    tpaInput.addEventListener('input', () => {
      const q = tpaInput.value.toLowerCase().trim();
      let matchCount = 0;

      tpaPills.forEach(pill => {
        const tpaName = pill.getAttribute('data-tpa') || pill.innerText.toLowerCase();
        if (!q || tpaName.includes(q)) {
          pill.style.display = 'flex';
          matchCount++;
        } else {
          pill.style.display = 'none';
        }
      });
    });
  }
}

// ================= 7. FAQ ACCORDION =================
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    const answerId = `faq-answer-${index + 1}`;
    answer.id = answerId;
    question.setAttribute('aria-controls', answerId);
    const initiallyOpen = item.classList.contains('active');
    question.setAttribute('aria-expanded', initiallyOpen ? 'true' : 'false');
    answer.hidden = !initiallyOpen;
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-question')?.setAttribute('aria-expanded', 'false');
        const otherAnswer = i.querySelector('.faq-answer');
        if (otherAnswer) otherAnswer.hidden = true;
      });
      if (!isActive) {
        item.classList.add('active');
        question.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });
}

// ================= 8. CONTACT & INQUIRY FORM =================
function initContactInquiry() {
  const form = document.getElementById('contactInquiryForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const name = document.getElementById('inqName').value;
      const phone = document.getElementById('inqPhone').value;
      const dept = document.getElementById('inqDept').value;
      const message = document.getElementById('inqMessage').value;

      const waText = `*PATIENT INQUIRY - SAMDA HOSPITAL*%0A%0A` +
        `👤 *Name:* ${encodeURIComponent(name)}%0A` +
        `📱 *Phone:* ${encodeURIComponent(phone)}%0A` +
        `🏥 *Department:* ${encodeURIComponent(dept)}%0A` +
        `💬 *Message:* ${encodeURIComponent(message || 'Inquiry regarding treatment.')}`;

      const waUrl = `https://wa.me/919425529769?text=${waText}`;
      window.open(waUrl, '_blank');

      showToast('Opening WhatsApp to send your callback request...', 'success');
      form.reset();
    });
  }
}

// ================= 9. TOAST NOTIFICATION UTILITY =================
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type === 'success' ? 'toast-success' : ''}`;
  
  const icon = type === 'success' ? '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i>' : '<i class="fa-solid fa-bell" style="color:#60a5fa;"></i>';
  toast.innerHTML = `${icon} <span>${message}</span>`;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4500);
}

// ================= 11. FOOTER DYNAMIC YEAR =================
function updateDynamicYear() {
  const yr = document.getElementById('currentYear');
  if (yr) yr.textContent = new Date().getFullYear();
}
