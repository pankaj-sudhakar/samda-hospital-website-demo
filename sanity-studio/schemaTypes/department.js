export const department = {
  name: 'department',
  title: 'Departments',
  type: 'document',
  fields: [
    { name: 'title', title: 'Department name', type: 'string', validation: rule => rule.required() },
    { name: 'slug', title: 'URL name', type: 'slug', options: { source: 'title', maxLength: 96 }, validation: rule => rule.required() },
    { name: 'shortDescription', title: 'Short description', type: 'text', rows: 3, validation: rule => rule.max(260) },
    { name: 'overview', title: 'Department overview', type: 'text', rows: 6 },
    { name: 'services', title: 'Services or procedures', type: 'array', of: [{ type: 'string' }] },
    { name: 'facilities', title: 'Facilities', type: 'array', of: [{ type: 'string' }] },
    { name: 'orderRank', title: 'Display order', type: 'number', initialValue: 100 },
    { name: 'isPublished', title: 'Show on website', type: 'boolean', initialValue: true }
  ],
  preview: { select: { title: 'title', subtitle: 'shortDescription' } }
}
