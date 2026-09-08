/* Public content bridge for Samda Hospital's static website. */
(() => {
  const config = window.SAMDA_SANITY_CONFIG || {}
  if (!config.projectId || !config.dataset || !config.apiVersion) return

  const query = `{
    "departments": *[_type == "department" && isPublished != false] | order(orderRank asc, title asc) {
      _id, title, "slug": slug.current, shortDescription, services
    },
    "doctors": *[_type == "doctor" && isPublished != false] | order(orderRank asc, name asc) {
      _id, name, designation, qualifications, specialties, expertise, opdSchedule,
      "department": department->{title, "slug": slug.current},
      "imageUrl": photo.asset->url
    },
    "media": *[_type == "mediaItem" && isPublished != false] | order(publishedAt desc) {
      _id, title, altText, category, "imageUrl": image.asset->url
    },
    "jobs": *[_type == "jobPosting" && isOpen == true] | order(closingDate asc, title asc) {
      _id, title, employmentType, summary, requirements, closingDate,
      "department": department->title
    }
  }`

  const create = (tag, className, text) => {
    const element = document.createElement(tag)
    if (className) element.className = className
    if (text) element.textContent = text
    return element
  }

  const safeImageUrl = value => {
    try {
      const url = new URL(value)
      return url.protocol === 'https:' && url.hostname === 'cdn.sanity.io' ? url.href : ''
    } catch {
      return ''
    }
  }

  const renderDepartments = departments => {
    const specialtyGrid = document.getElementById('specialtiesGrid')
    const tabs = document.getElementById('deptTabs')
    const teamGrid = document.querySelector('.department-team-grid')
    if (!departments?.length) return

    if (tabs) {
      tabs.replaceChildren()
      const all = create('button', 'dept-tab active', 'All Departments')
      all.dataset.dept = 'all'
      tabs.append(all)
      departments.forEach(department => {
        const button = create('button', 'dept-tab', department.title)
        button.dataset.dept = department.slug
        tabs.append(button)
      })
    }

    if (specialtyGrid) {
      specialtyGrid.replaceChildren()
      departments.forEach(department => {
        const card = create('article', 'specialty-card')
        card.dataset.category = department.slug
        card.append(create('h3', '', department.title))
        card.append(create('p', 'specialty-lead', department.shortDescription || 'Clinical information is available from the hospital team.'))
        if (department.services?.length) {
          const services = create('ul', 'procedure-list')
          department.services.forEach(service => services.append(create('li', '', service)))
          card.append(services)
        }
        const footer = create('div', 'card-footer')
        const availability = create('button', 'btn btn-sm btn-primary book-specialty-btn', 'Check Availability')
        availability.dataset.dept = department.title
        footer.append(availability)
        card.append(footer)
        specialtyGrid.append(card)
      })
    }

    if (teamGrid) {
      teamGrid.replaceChildren()
      departments.forEach(department => {
        const card = create('article', 'department-team-card')
        card.append(create('h3', '', department.title))
        card.append(create('p', '', 'View the specialists associated with this department.'))
        const button = create('button', 'department-doctor-link', 'View department doctors')
        button.dataset.dept = department.slug
        card.append(button)
        teamGrid.append(card)
      })
    }
  }

  const renderDoctors = doctors => {
    const grid = document.getElementById('doctorsGrid')
    const select = document.getElementById('doctorDeptSelect')
    if (!grid || !doctors?.length) return
    grid.replaceChildren()
    if (select) {
      select.replaceChildren()
      select.append(new Option('All Specialties', 'all'))
      doctors.forEach(doctor => {
        if (doctor.department?.slug && !select.querySelector(`option[value="${CSS.escape(doctor.department.slug)}"]`)) {
          select.append(new Option(doctor.department.title, doctor.department.slug))
        }
      })
    }
    doctors.forEach(doctor => {
      const card = create('article', 'doctor-card')
      card.dataset.name = doctor.name || ''
      card.dataset.dept = doctor.department?.slug || 'all'
      const header = create('div', 'doc-header')
      const photoFrame = create('div', 'doc-photo-frame')
      const imageUrl = safeImageUrl(doctor.imageUrl)
      if (imageUrl) {
        const image = document.createElement('img')
        image.className = 'doc-real-photo'
        image.src = imageUrl
        image.alt = doctor.name ? `Portrait of ${doctor.name}` : 'Doctor portrait'
        image.loading = 'lazy'
        image.decoding = 'async'
        photoFrame.append(image)
      }
      header.append(photoFrame)
      const meta = create('div', 'doc-meta')
      if (doctor.designation) meta.append(create('span', 'doc-badge', doctor.designation))
      meta.append(create('h3', 'doc-name', doctor.name || 'Doctor'))
      if (doctor.qualifications) meta.append(create('p', 'doc-degrees', doctor.qualifications))
      if (doctor.specialties?.length) meta.append(create('p', 'doc-spec', doctor.specialties.join(' · ')))
      if (doctor.department?.title) {
        const departmentLink = create('a', 'doc-department', doctor.department.title)
        departmentLink.href = '#department-teams'
        departmentLink.dataset.dept = doctor.department.slug || ''
        meta.append(departmentLink)
      }
      header.append(meta)
      card.append(header)
      if (doctor.opdSchedule || doctor.expertise?.length) {
        const body = create('div', 'doc-body')
        if (doctor.opdSchedule) {
          const timing = create('div', 'timing-box')
          timing.append(create('div', 'timing-title', 'OPD timings'))
          timing.append(create('div', 'timing-schedule', doctor.opdSchedule))
          body.append(timing)
        }
        if (doctor.expertise?.length) {
          const expertise = create('div', 'expertise-tags')
          doctor.expertise.forEach(item => expertise.append(create('span', '', item)))
          body.append(expertise)
        }
        card.append(body)
      }
      const actions = create('div', 'doc-actions')
      const availability = create('button', 'btn btn-primary btn-sm book-doc-btn', 'Check Availability')
      availability.dataset.doctor = doctor.name || ''
      availability.dataset.dept = doctor.department?.title || ''
      actions.append(availability)
      card.append(actions)
      grid.append(card)
    })
  }

  const renderMedia = media => {
    const grid = document.querySelector('.media-gallery-grid')
    if (!grid || !media?.length) return
    grid.replaceChildren()
    media.forEach(item => {
      const imageUrl = safeImageUrl(item.imageUrl)
      if (!imageUrl) return
      const figure = document.createElement('figure')
      const image = document.createElement('img')
      image.src = imageUrl
      image.alt = item.altText || item.title || 'Samda Hospital gallery image'
      image.loading = 'lazy'
      image.decoding = 'async'
      figure.append(image, create('figcaption', '', item.title || item.category || 'Samda Hospital'))
      grid.append(figure)
    })
  }

  const renderJobs = jobs => {
    const list = document.querySelector('.job-list')
    if (!list || !jobs?.length) return
    list.replaceChildren()
    jobs.filter(job => !job.closingDate || job.closingDate >= new Date().toISOString().slice(0, 10)).forEach(job => {
      const article = create('article', 'job-card')
      article.append(create('h3', '', job.title))
      const details = [job.department, job.employmentType].filter(Boolean).join(' · ')
      if (details) article.append(create('p', 'job-meta', details))
      article.append(create('p', '', job.summary || 'Contact the HR team for role details.'))
      list.append(article)
    })
  }

  const url = `https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/query/${config.dataset}?query=${encodeURIComponent(query)}`
  fetch(url, { headers: { Accept: 'application/json' } })
    .then(response => response.ok ? response.json() : Promise.reject(new Error(`Sanity request failed: ${response.status}`)))
    .then(({ result }) => {
      renderDepartments(result.departments)
      renderDoctors(result.doctors)
      renderMedia(result.media)
      renderJobs(result.jobs)
      document.dispatchEvent(new CustomEvent('samda:cms-rendered'))
    })
    .catch(error => console.warn('Samda CMS content is unavailable; showing the approved website fallback.', error))
})()
