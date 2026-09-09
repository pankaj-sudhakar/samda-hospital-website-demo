(() => {
  const content = document.getElementById('doctorProfileContent')
  const slug = new URLSearchParams(window.location.search).get('doctor')
  const doctor = window.SAMDA_DOCTOR_PROFILES?.[slug]
  const create = (tag, className, text) => {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (text) element.textContent = text
    return element
  }
  document.getElementById('currentYear').textContent = new Date().getFullYear()
  if (!doctor) {
    content.append(create('h1', 'section-title', 'Doctor profile not found'), create('p', 'section-subtitle', 'Please return to the doctor directory and select a profile.'))
    const link = create('a', 'btn btn-primary', 'View all doctors')
    link.href = 'index.html#doctors'
    content.append(link)
    return
  }

  document.title = `${doctor.name} | Samda Superspeciality Hospital`
  document.querySelector('meta[name="description"]').content = `${doctor.name}, ${doctor.specialty}. View department, OPD details and request availability through Booking Mitra at Samda Hospital, Rajnandgaon.`
  const profile = create('article', 'doctor-profile-card')
  const header = create('div', 'doctor-profile-header')
  const image = document.createElement('img')
  image.src = doctor.photo
  image.alt = `Portrait of ${doctor.name}`
  image.className = 'doctor-profile-photo'
  header.append(image)
  const intro = create('div', 'doctor-profile-intro')
  intro.append(create('span', 'doc-badge', doctor.designation), create('h1', '', doctor.name), create('p', 'doctor-profile-specialty', doctor.specialty), create('p', 'doctor-profile-qualifications', doctor.qualifications))
  const department = create('a', 'doc-department', doctor.department)
  department.href = `index.html#department-teams`
  intro.append(department)
  header.append(intro)
  profile.append(header)

  const details = create('div', 'doctor-profile-details')
  const schedule = create('section', 'doctor-profile-panel')
  schedule.append(create('h2', '', 'OPD / Consultation timing'))
  const scheduleList = create('ul', 'doctor-profile-list')
  doctor.schedule.forEach(item => scheduleList.append(create('li', '', item)))
  schedule.append(scheduleList, create('p', 'profile-note', 'Timings and availability can change. Please confirm with Booking Mitra before visiting.'))
  details.append(schedule)
  const expertise = create('section', 'doctor-profile-panel')
  expertise.append(create('h2', '', 'Areas of expertise'))
  const expertiseList = create('div', 'expertise-tags')
  doctor.expertise.forEach(item => expertiseList.append(create('span', '', item)))
  expertise.append(expertiseList)
  details.append(expertise)
  profile.append(details)

  const actions = create('div', 'doctor-profile-actions')
  const availability = create('a', 'btn btn-whatsapp btn-lg', 'Check Availability with Booking Mitra')
  const message = `Hello Samda Hospital, I would like to check ${doctor.name}'s availability and request a callback. This is not an appointment booking.`
  availability.href = `https://wa.me/919425529769?text=${encodeURIComponent(message)}`
  availability.target = '_blank'
  availability.rel = 'noopener noreferrer'
  actions.append(availability)
  const back = create('a', 'btn btn-outline btn-lg', 'Back to all doctors')
  back.href = 'index.html#doctors'
  actions.append(back)
  profile.append(actions, create('p', 'profile-disclaimer', 'Booking Mitra is for doctor availability and callback requests only. For an emergency, call the hospital emergency line.'))
  content.append(profile)
})()
