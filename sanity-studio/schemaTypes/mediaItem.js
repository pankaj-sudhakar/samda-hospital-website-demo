export const mediaItem = {
  name: 'mediaItem',
  title: 'Media Gallery',
  type: 'document',
  fields: [
    { name: 'title', title: 'Caption', type: 'string', validation: rule => rule.required() },
    { name: 'mediaType', title: 'Media type', type: 'string', options: { list: ['Image', 'Video'] }, initialValue: 'Image', validation: rule => rule.required() },
    { name: 'image', title: 'Image', type: 'image', options: { hotspot: true }, hidden: ({ parent }) => parent?.mediaType === 'Video' },
    { name: 'videoFile', title: 'Video file', type: 'file', options: { accept: 'video/*' }, hidden: ({ parent }) => parent?.mediaType !== 'Video' },
    { name: 'altText', title: 'Image or video description (accessibility)', type: 'string', validation: rule => rule.required().max(160) },
    { name: 'category', title: 'Category', type: 'string', options: { list: ['Facilities', 'Health camp', 'Awareness', 'Hospital event', 'Community'] } },
    { name: 'publishedAt', title: 'Publish date', type: 'date' },
    { name: 'isPublished', title: 'Show on website', type: 'boolean', initialValue: true }
  ],
  preview: { select: { title: 'title', subtitle: 'category', media: 'image' } }
}
