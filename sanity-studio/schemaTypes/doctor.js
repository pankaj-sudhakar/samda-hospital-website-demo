export const doctor = {
  name: 'doctor',
  title: 'Doctors',
  type: 'document',
  fields: [
    { name: 'name', title: 'Full name', type: 'string', validation: rule => rule.required() },
    { name: 'slug', title: 'URL name', type: 'slug', options: { source: 'name', maxLength: 96 }, validation: rule => rule.required() },
    { name: 'photo', title: 'Professional photo', type: 'image', options: { hotspot: true }, validation: rule => rule.required() },
    { name: 'designation', title: 'Designation', type: 'string' },
    { name: 'qualifications', title: 'Qualifications', type: 'string' },
    { name: 'department', title: 'Related department', type: 'reference', to: [{ type: 'department' }], validation: rule => rule.required() },
    { name: 'specialties', title: 'Specialties', type: 'array', of: [{ type: 'string' }] },
    { name: 'expertise', title: 'Areas of expertise', type: 'array', of: [{ type: 'string' }] },
    { name: 'languages', title: 'Languages', type: 'array', of: [{ type: 'string' }] },
    { name: 'opdSchedule', title: 'OPD schedule', type: 'text', rows: 3, description: 'Enter only confirmed timings.' },
    { name: 'biography', title: 'Biography', type: 'text', rows: 5 },
    { name: 'orderRank', title: 'Display order', type: 'number', initialValue: 100 },
    { name: 'isPublished', title: 'Show on website', type: 'boolean', initialValue: true }
  ],
  preview: { select: { title: 'name', subtitle: 'designation', media: 'photo' } }
}
