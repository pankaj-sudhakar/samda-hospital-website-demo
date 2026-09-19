(() => {
  const departments = [
    ['Urology & Renal Care', 'urology', 'Dr. Nikhar Jain', 'Kidney stone, prostate and urinary care.'],
    ['GI & Laparoscopic Surgery', 'gastro', 'Dr. Romil Jain', 'Digestive, gallbladder and laparoscopic surgery care.'],
    ['Orthopedics & Trauma', 'ortho', 'Dr. Mayank Jain', 'Bone, joint, fracture and trauma care.'],
    ['Dermatology & Cosmetology', 'derma', 'Dr. Utsavi Jain', 'Skin, hair and dermatology consultations.'],
    ['Obstetrics & Gynecology', 'gynae', 'Dr. Siddhi Sainik', 'Women’s health, pregnancy and gynecology care.'],
    ['General Surgery', 'general', 'Dr. B. C. Jain', 'General surgical consultation and care.'],
    ['General Medicine & ICU', 'physician', 'Dr. Rahul Govindani · Dr. Tilak Gajendra', 'Physician and critical-care consultations.'],
    ['Dental & Maxillofacial', 'dental', 'Dr. Deepika Jain · Dr. Jay Taank', 'Dental and maxillofacial consultations.']
  ]
  const facilities = [
    ['facility-icu.jpg', 'Critical care ICU', 'Critical-care facility information.'],
    ['facility-ot.jpg', 'Operation theatre', 'Operation theatre facility information.'],
    ['facility-patho.jpg', 'Pathology laboratory', 'Laboratory facility information.'],
    ['facility-ambulance.jpg', 'Emergency ambulance', 'Emergency transport support.'],
    ['facility-ward.jpg', 'Patient ward', 'Patient ward facility information.'],
    ['facility-reception.jpg', 'Reception', 'Reception and patient-support area.']
  ]
  const root = document.getElementById('pageContent')
  if (!root) return
  const page = document.body.dataset.page
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text) node.textContent = text; return node }
  const link = (label, href, className = '') => { const node = el('a', className, label); node.href = href; return node }
  const section = (title, intro) => { const node = el('section', 'page-content-section'); node.append(el('h2', 'section-title', title)); if (intro) node.append(el('p', 'section-subtitle', intro)); return node }

  if (page === 'departments') {
    const node = section('Specialities & Departments', 'Explore departments and the associated specialists. Confirm availability with Booking Mitra before visiting.')
    const grid = el('div', 'page-card-grid')
    departments.forEach(([name, key, doctors, description]) => { const card = el('article', 'page-info-card'); card.append(el('h3', '', name), el('p', '', description), el('p', 'page-card-meta', `Associated doctors: ${doctors}`), link('View department information', `department-profile.html?department=${encodeURIComponent(key)}`, 'quick-link')); grid.append(card) })
    node.append(grid); root.append(node)
  }

  if (page === 'doctors') {
    const node = section('Doctors & OPD Timings', 'Select a profile to view department, qualifications, current published OPD information and Booking Mitra availability support.')
    const queryDept = new URLSearchParams(window.location.search).get('department')
    const grid = el('div', 'page-card-grid doctors-page-grid')
    Object.entries(window.SAMDA_DOCTOR_PROFILES || {}).filter(([, doctor]) => !queryDept || doctor.departmentKey === queryDept).forEach(([slug, doctor]) => {
      const card = el('article', 'page-info-card doctor-page-card')
      const photo = document.createElement('img'); photo.src = doctor.photo; photo.alt = `Portrait of ${doctor.name}`; photo.loading = 'lazy'; photo.decoding = 'async'; photo.className = 'page-doctor-photo'
      card.append(photo, el('span', 'doc-badge', doctor.designation), el('h3', '', doctor.name), el('p', 'page-card-meta', doctor.specialty), el('p', '', doctor.qualifications), link('View full profile & availability', `doctor-profile.html?doctor=${encodeURIComponent(slug)}`, 'btn btn-primary btn-sm'))
      grid.append(card)
    })
    node.append(grid); root.append(node)
  }

  if (page === 'facilities') {
    const node = section('Facilities & Media Gallery', 'A look at Samda Hospital facilities and public hospital updates. Publish new approved images in the Media Gallery through the content dashboard.')
    const grid = el('div', 'page-card-grid facility-page-grid')
    facilities.forEach(([imageName, title, description]) => { const card = el('figure', 'page-info-card'); const image = document.createElement('img'); image.src = `assets/${imageName}`; image.alt = title; image.loading = 'lazy'; image.decoding = 'async'; card.append(image, el('figcaption', '', title), el('p', '', description)); grid.append(card) })
    node.append(grid, link('Open Media Gallery', 'media-gallery.html', 'btn btn-primary'))
    root.append(node)
  }

  if (page === 'ayushman') {
    const node = section('Ayushman & Cashless TPA', 'Get hospital guidance on Ayushman PM-JAY and cashless TPA options before admission.')
    const steps = el('ol', 'page-steps')
    ;['Bring your scheme or insurance documents to the hospital helpdesk.', 'Ask the team to check eligibility, approved package and current scheme or insurer rules.', 'Wait for the hospital’s confirmation before relying on coverage for admission or treatment.'].forEach(text => steps.append(el('li', '', text)))
    node.append(steps, link('Ask the Ayushman helpdesk on WhatsApp', 'https://wa.me/919425529769?text=Hello%20Samda%20Hospital%2C%20I%20would%20like%20guidance%20about%20Ayushman%20or%20cashless%20TPA%20eligibility.', 'btn btn-whatsapp'))
    root.append(node)
  }

  if (page === 'contact') {
    const node = section('Contact & Directions', 'Call for emergency help, use WhatsApp for doctor availability and callback requests, or get directions to the hospital.')
    const grid = el('div', 'page-card-grid')
    ;[['Emergency / आपातकालीन सहायता', '+91 94255 29769', 'tel:+919425529769'], ['Reception & OPD / ओपीडी सहायता', '07744-29769', 'tel:0774429769'], ['WhatsApp availability / व्हाट्सऐप सहायता', 'Check doctor availability and request a callback', 'https://wa.me/919425529769?text=Hello%20Samda%20Hospital%2C%20I%20would%20like%20to%20check%20doctor%20availability.'], ['Directions / दिशा-निर्देश', 'Kaurin Bhatha, Basantpur Road, Rajnandgaon', 'https://maps.google.com/?q=Samda+Superspeciality+Hospital+Rajnandgaon']].forEach(([title, text, href]) => { const card = el('article', 'page-info-card'); card.append(el('h3', '', title), link(text, href, 'quick-link')); grid.append(card) })
    node.append(grid); root.append(node)
  }
})()
