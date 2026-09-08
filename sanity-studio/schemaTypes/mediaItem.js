export const mediaItem = {
  name: 'mediaItem',
  title: 'Media Gallery',
  type: 'document',
  fields: [
    { name: 'title', title: 'Caption', type: 'string', validation: rule => rule.required() },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, validation: rule => rule.required() },
    { name: 'altText', title: 'Image description (accessibility)', type: 'string', validation: rule => rule.required().max(160) },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['Facilities', 'Health camp', 'Awareness', 'Hospital event', 'Community'] } },
    { name: 'publishedAt', title: 'Publish date', type: 'date' },
    { name: 'isPublished', title: 'Show on website', type: 'boolean', initialValue: true }
  ],
  preview: { select: { title: 'title', subtitle: 'category', media: 'image' } }
}
