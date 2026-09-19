export const patientInquiry = {
  name: 'patientInquiry',
  title: 'Patient messages',
  type: 'document',
  fields: [
    { name: 'receivedAt', title: 'Received at', type: 'datetime', validation: rule => rule.required() },
    { name: 'source', title: 'Source', type: 'string', options: { list: ['Website form', 'WhatsApp Business', 'Phone request'] }, validation: rule => rule.required() },
    { name: 'name', title: 'Name', type: 'string', readOnly: true },
    { name: 'phone', title: 'Phone', type: 'string', readOnly: true },
    { name: 'department', title: 'Department or doctor requested', type: 'string', readOnly: true },
    { name: 'message', title: 'Message', type: 'text', rows: 4, readOnly: true },
    { name: 'consentRecorded', title: 'Consent recorded', type: 'boolean', readOnly: true },
    { name: 'status', title: 'Response status', type: 'string', options: { list: ['New', 'Contacted', 'Closed'] }, initialValue: 'New' }
  ],
  preview: { select: { title: 'name', subtitle: 'status' } }
}
