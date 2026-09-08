export const jobPosting = {
  name: 'jobPosting',
  title: 'Job vacancies',
  type: 'document',
  fields: [
    { name: 'title', title: 'Role title', type: 'string', validation: rule => rule.required() },
    { name: 'department', title: 'Related department (optional)', type: 'reference', to: [{ type: 'department' }] },
    { name: 'employmentType', title: 'Employment type', type: 'string', options: { list: ['Full-time', 'Part-time', 'Visiting consultant', 'Contract'] } },
    { name: 'summary', title: 'Short description', type: 'text', rows: 4, validation: rule => rule.required().max(360) },
    { name: 'requirements', title: 'Requirements', type: 'array', of: [{ type: 'string' }] },
    { name: 'closingDate', title: 'Closing date', type: 'date' },
    { name: 'isOpen', title: 'Accepting applications', type: 'boolean', initialValue: true }
  ],
  preview: { select: { title: 'title', subtitle: 'employmentType' } }
}
