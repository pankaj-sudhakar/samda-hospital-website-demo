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

  function openDrawer() {
    mobileDrawer.classList.add('open');
    drawerOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    drawerOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);
  if (drawerOverlay) drawerOverlay.addEventListener('click', closeDrawer);

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
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

  function performSearch(query) {
    if (!query || !query.trim()) return;
    const q = query.trim().toLowerCase();

    // Check if query matches specialty or doctor
    const specialtiesSection = document.getElementById('specialties');
    const doctorInput = document.getElementById('doctorSearchInput');
    const doctorDeptSelect = document.getElementById('doctorDeptSelect');

    if (q.includes('kidney') || q.includes('stone') || q.includes('urol') || q.includes('nikhar') || q.includes('prostate')) {
      if (doctorDeptSelect) doctorDeptSelect.value = 'urology';
      filterDoctors();
      document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' });
      showToast('Filtered doctors for Urology & Stone Care');
    } else if (q.includes('gastro') || q.includes('gallbladder') || q.includes('hernia') || q.includes('romil') || q.includes('laparo')) {
      if (doctorDeptSelect) doctorDeptSelect.value = 'gastro';
      filterDoctors();
      document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' });
      showToast('Filtered doctors for GI & Laparoscopic Surgery');
    } else if (q.includes('ortho') || q.includes('bone') || q.includes('joint') || q.includes('knee') || q.includes('fracture') || q.includes('mayank')) {
      if (doctorDeptSelect) doctorDeptSelect.value = 'ortho';
      filterDoctors();
      document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' });
      showToast('Filtered doctors for Orthopedics');
    } else if (q.includes('skin') || q.includes('derma') || q.includes('laser') || q.includes('hair') || q.includes('utsavi') || q.includes('acne')) {
      if (doctorDeptSelect) doctorDeptSelect.value = 'derma';
      filterDoctors();
      document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' });
      showToast('Filtered doctors for Dermatology & Laser Clinic');
    } else {
      if (doctorInput) {
        doctorInput.value = query;
        filterDoctors();
      }
      document.getElementById('doctors').scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (searchBtn && searchInput) {
    searchBtn.addEventListener('click', () => performSearch(searchInput.value));
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') performSearch(searchInput.value);
    });
  }

  tagBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const q = btn.getAttribute('data-query');
      performSearch(q);
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

function initDoctorDirectory() {
  const searchInput = document.getElementById('doctorSearchInput');
  const deptSelect = document.getElementById('doctorDeptSelect');
  const doctorCards = document.querySelectorAll('.doctor-card');

  filterDoctors = function() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
    const selectedDept = deptSelect ? deptSelect.value.toLowerCase() : 'all';

    doctorCards.forEach(card => {
      const docName = card.getAttribute('data-name').toLowerCase();
      const docDept = card.getAttribute('data-dept').toLowerCase();
      const cardText = card.innerText.toLowerCase();

      const matchesSearch = !query || docName.includes(query) || cardText.includes(query);
      const matchesDept = selectedDept === 'all' || docDept.includes(selectedDept);

      if (matchesSearch && matchesDept) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  if (searchInput) searchInput.addEventListener('input', filterDoctors);
  if (deptSelect) deptSelect.addEventListener('change', filterDoctors);

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

  function openModal() {
    bookingModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    bookingModal.classList.remove('active');
    document.body.style.overflow = '';
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

  // Confirm via WhatsApp
  if (confirmWhatsappBtn) {
    confirmWhatsappBtn.addEventListener('click', () => {
      if (!availabilityForm.reportValidity()) return;
      const doctor = document.getElementById('bookDoctor').value || 'Any Available Specialist';
      const time = document.getElementById('availabilityWindow').value || 'Today';
      const name = document.getElementById('patientName').value || 'Patient';
      const phone = document.getElementById('patientPhone').value || 'Not provided';
      const remarks = document.getElementById('patientRemarks').value || 'Please share the next available consultation time.';

      const msg = `*BOOKING MITRA — DOCTOR AVAILABILITY REQUEST*%0A%0A` +
        `👤 *Patient Name:* ${encodeURIComponent(name)}%0A` +
        `📱 *Contact:* ${encodeURIComponent(phone)}%0A` +
        `🩺 *Specialist:* ${encodeURIComponent(doctor)}%0A` +
        `⏰ *Preferred time:* ${encodeURIComponent(time)}%0A` +
        `📝 *Message:* ${encodeURIComponent(remarks)}%0A%0A` +
        `_Please let me know the doctor's current availability. This is not an appointment booking._`;

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
    document.body.style.overflow = 'hidden';
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

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
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
