export const siteSettings = {
  name: 'siteSettings',
  title: 'Hospital settings',
  type: 'document',
  fields: [
    { name: 'hospitalName', title: 'Hospital name', type: 'string', validation: rule => rule.required() },
    { name: 'careerEmail', title: 'Career email', type: 'string', validation: rule => rule.email() },
    { name: 'careerWhatsapp', title: 'Career WhatsApp number', type: 'string', description: 'Digits only, including country code.' },
    { name: 'youtubeChannelUrl', title: 'YouTube channel URL', type: 'url' },
    { name: 'instagramUrl', title: 'Instagram URL', type: 'url' }
  ],
  preview: { select: { title: 'hospitalName' } }
}
