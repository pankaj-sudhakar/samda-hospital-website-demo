# Samda Hospital admin dashboard

The admin dashboard is the Sanity Studio in `sanity-studio/`. Once deployed to a protected URL such as `cms.samdahospital.com`, authorised hospital staff can sign in and manage:

- doctors, departments and profile details;
- photos, videos and Media Gallery items;
- recruitment vacancies;
- hospital contact and social settings;
- patient messages delivered by an approved secure integration.

## Patient messages: required integration

The current public website opens a WhatsApp message and does not store messages on the website. A dashboard cannot read personal WhatsApp chats automatically.

To show messages in the **Patient messages** section, the hospital must first provide either:

1. WhatsApp Business Platform/API access and a webhook endpoint; or
2. a secure website form service/server that submits consented enquiries to the hospital and creates a `patientInquiry` document using a server-side Sanity token.

Never put a WhatsApp or Sanity write token in browser JavaScript. Before switching to stored enquiries, obtain hospital privacy approval, define a retention policy, and limit dashboard access to authorised staff.
