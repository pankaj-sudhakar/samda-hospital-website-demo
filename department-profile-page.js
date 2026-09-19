(() => {
  const root = document.getElementById('departmentProfileContent')
  const slug = new URLSearchParams(window.location.search).get('department')
  const department = window.SAMDA_DEPARTMENT_PROFILES?.[slug]
  const doctors = window.SAMDA_DOCTOR_PROFILES || {}
  const el = (tag, className, text) => { const node = document.createElement(tag); if (className) node.className = className; if (text) node.textContent = text; return node }
  if (!department) { root.append(el('h1', 'section-title', 'Department not found'), el('p', 'section-subtitle', 'Please return to the department directory and select a department.')); const back = el('a', 'btn btn-primary', 'View all departments'); back.href = 'specialities.html'; root.append(back); return }
  document.title = `${department.title} | Samda Superspeciality Hospital`
  document.querySelector('meta[name="description"]').content = `${department.title} information and associated doctors at Samda Superspeciality Hospital in Rajnandgaon.`
  const profile = el('article', 'department-profile-card')
  profile.append(el('div', 'section-tag', 'Department information'), el('h1', 'department-profile-title', department.title), el('p', 'department-profile-overview', department.overview))
  const info = el('div', 'doctor-profile-details')
  const services = el('section', 'doctor-profile-panel')
  services.append(el('h2', '', 'Services and consultation areas'))
  const serviceList = el('ul', 'doctor-profile-list'); department.services.forEach(item => serviceList.append(el('li', '', item))); services.append(serviceList)
  const notice = el('section', 'doctor-profile-panel'); notice.append(el('h2', '', 'Before you visit'), el('p', '', 'Clinical advice, eligibility and doctor availability must be confirmed directly with the hospital team.'))
  info.append(services, notice); profile.append(info)
  profile.append(el('h2', 'department-doctors-title', 'Associated doctors'))
  const doctorGrid = el('div', 'department-doctor-grid')
  department.doctors.forEach(doctorSlug => { const doctor = doctors[doctorSlug]; if (!doctor) return; const card = el('article', 'department-doctor-card'); const photo = document.createElement('img'); photo.src = doctor.photo; photo.alt = `Portrait of ${doctor.name}`; photo.loading = 'lazy'; photo.className = 'department-doctor-photo'; const name = el('h3', '', doctor.name); const profileLink = el('a', 'btn btn-outline btn-sm', 'View doctor profile'); profileLink.href = `doctor-profile.html?doctor=${encodeURIComponent(doctorSlug)}`; card.append(photo, name, el('p', '', doctor.specialty), profileLink); doctorGrid.append(card) })
  profile.append(doctorGrid)
  const actions = el('div', 'doctor-profile-actions')
  const availability = el('a', 'btn btn-whatsapp btn-lg', 'Check Availability with Booking Mitra'); availability.href = `https://wa.me/919425529769?text=${encodeURIComponent(`Hello Samda Hospital, I would like to check doctor availability for ${department.title} and request a callback. This is not an appointment booking.`)}`; availability.target = '_blank'; availability.rel = 'noopener noreferrer'; actions.append(availability)
  const back = el('a', 'btn btn-outline btn-lg', 'Back to all departments'); back.href = 'specialities.html'; actions.append(back); profile.append(actions)
  root.append(profile)
})()
