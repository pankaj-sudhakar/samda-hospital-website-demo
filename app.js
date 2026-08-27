/**
 * SAMDA SUPERSPECIALITY HOSPITAL - JAVASCRIPT LOGIC
 * High-performance, modular ES application handling OPD booking, WhatsApp triage,
 * doctor filtering, insurance search, interactive modals, and pitch demonstration.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initHeroSearch();
  initSpecialtyFilter();
  initDoctorDirectory();
  initBookingEngine();
  initInsuranceLookup();
  initFAQAccordion();
  initContactInquiry();
  initPitchMode();
  updateDynamicYear();
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

  // Handle "Book Specialty OPD" buttons
  const specialtyBookBtns = document.querySelectorAll('.book-specialty-btn');
  specialtyBookBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const doctorName = btn.getAttribute('data-doctor');
      openBookingModalWithDoctor(doctorName);
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
      openBookingModalWithDoctor(doc);
    });
  });
}

// ================= 5. APPOINTMENT BOOKING ENGINE & WHATSAPP GENERATOR =================
function initBookingEngine() {
  const bookingModal = document.getElementById('bookingModal');
  const closeBookingModalBtn = document.getElementById('closeBookingModal');
  const quickBookBtn = document.getElementById('quickBookBtn');
  const heroBookBtn = document.getElementById('heroBookBtn');
  const aboutBookBtn = document.getElementById('aboutBookBtn');
  const mobileBookBtn = document.getElementById('mobileBookBtn');
  const floatingBookBtn = document.getElementById('floatingBookBtn');
  const appointmentForm = document.getElementById('appointmentForm');
  const confirmWhatsappBtn = document.getElementById('confirmWhatsappBtn');
  const bookDateInput = document.getElementById('bookDate');

  // Set minimum date to today
  if (bookDateInput) {
    const today = new Date().toISOString().split('T')[0];
    bookDateInput.min = today;
    bookDateInput.value = today;
  }

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
      const doctor = document.getElementById('bookDoctor').value || 'Any Available Specialist';
      const date = document.getElementById('bookDate').value || 'Today';
      const time = document.getElementById('bookTime').value || 'Morning Slot';
      const name = document.getElementById('patientName').value || 'Patient';
      const phone = document.getElementById('patientPhone').value || 'Not provided';
      const city = document.getElementById('patientCity').value || 'Rajnandgaon';
      const remarks = document.getElementById('patientRemarks').value || 'Consultation inquiry';
      
      const paymentEl = document.querySelector('input[name="paymentType"]:checked');
      const paymentType = paymentEl ? paymentEl.value : 'General';

      if (!name || name === 'Patient') {
        showToast('Please enter the patient full name.', 'error');
        document.getElementById('patientName').focus();
        return;
      }

      const msg = `*NEW OPD APPOINTMENT REQUEST - SAMDA HOSPITAL*%0A%0A` +
        `👤 *Patient Name:* ${encodeURIComponent(name)}%0A` +
        `📱 *Contact:* ${encodeURIComponent(phone)}%0A` +
        `📍 *City/Town:* ${encodeURIComponent(city)}%0A` +
        `🩺 *Specialist:* ${encodeURIComponent(doctor)}%0A` +
        `📅 *Preferred Date:* ${encodeURIComponent(date)}%0A` +
        `⏰ *Preferred Slot:* ${encodeURIComponent(time)}%0A` +
        `💳 *Billing/Scheme:* ${encodeURIComponent(paymentType)}%0A` +
        `📝 *Problem/Remarks:* ${encodeURIComponent(remarks)}%0A%0A` +
        `_Please confirm doctor availability and consultation token._`;

      const waUrl = `https://wa.me/919425529769?text=${msg}`;
      window.open(waUrl, '_blank');
      closeModal();
      showToast('Opening WhatsApp to confirm your appointment...', 'success');
    });
  }

  // Submit via Web Form
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patientName = document.getElementById('patientName').value;
      const doctor = document.getElementById('bookDoctor').value;
      
      closeModal();
      showToast(`Thank you, ${patientName}! Your request for ${doctor} has been received. Our desk will call you shortly.`, 'success');
      appointmentForm.reset();
    });
  }
}

function openBookingModalWithDoctor(doctorName) {
  const bookingModal = document.getElementById('bookingModal');
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

      showToast(`Inquiry sent! We will connect with you on ${phone} promptly.`, 'success');
      form.reset();
    });
  }
}

// ================= 9. PITCH MODE PROPOSAL MODAL =================
function initPitchMode() {
  const pitchModal = document.getElementById('pitchModal');
  const openPitchBtn = document.getElementById('openPitchBtn');
  const mobilePitchBtn = document.getElementById('mobilePitchBtn');
  const footerPitchBtn = document.getElementById('footerPitchBtn');
  const closePitchModalBtn = document.getElementById('closePitchModal');
  const pitchShareBtn = document.getElementById('pitchShareBtn');

  function openPitch() {
    pitchModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closePitch() {
    pitchModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openPitchBtn) openPitchBtn.addEventListener('click', openPitch);
  if (mobilePitchBtn) mobilePitchBtn.addEventListener('click', openPitch);
  if (footerPitchBtn) footerPitchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openPitch();
  });
  if (closePitchModalBtn) closePitchModalBtn.addEventListener('click', closePitch);

  if (pitchModal) {
    pitchModal.addEventListener('click', (e) => {
      if (e.target === pitchModal) closePitch();
    });
  }

  if (pitchShareBtn) {
    pitchShareBtn.addEventListener('click', () => {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href);
        showToast('Demo link copied to clipboard! Ready to share with Dr. Jain.', 'success');
      } else {
        showToast('Share URL: ' + window.location.href, 'success');
      }
    });
  }
}

// ================= 10. TOAST NOTIFICATION UTILITY =================
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
