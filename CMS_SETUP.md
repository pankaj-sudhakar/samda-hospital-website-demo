# Samda Hospital Content Management

This website keeps its approved, static content as a fallback. Once the Sanity project is connected, published Sanity content replaces the website listings for departments, doctors, gallery images, and open roles.

## What editors manage

- **Doctors:** photo, designation, qualifications, specialties, expertise, timings, and one related department.
- **Departments:** description, services, display order, and whether the department is visible.
- **Media Gallery:** image, accessible image description, caption, category, and publish state.
- **Job vacancies:** title, department, employment type, description, closing date, and whether applications are open.

Doctors and departments are connected through the doctor's **Related department** field. Editors must publish a department before selecting it for a doctor.

## One-time launch checklist

1. Create a Sanity project and a public `production` dataset at [Sanity Manage](https://www.sanity.io/manage).
2. In `sanity-studio`, copy `.env.example` to `.env`, then add the project ID.
3. Run `npm install`, then `npm run dev` from `sanity-studio` and sign in with an authorized hospital account.
4. Add the final public website origin and the Studio origin to the Sanity project's CORS settings.
5. Add the same project ID to `sanity-content-config.js`. Do not add a token there.
6. Enter and publish all existing doctors, departments, gallery images, and vacancies in the Studio. The website keeps its current approved content until at least one CMS item has been published for that listing.
7. Deploy the Studio to a restricted editor URL, such as `cms.samdahospital.com`, and invite only authorized staff as Sanity project members.

## Career applications

Sanity manages job **postings**, not candidate applications or CV files. Applicants should submit through a secure HR form or an approved ATS. A future form integration can send applications to a protected HR inbox, Google Workspace, or a dedicated applicant-tracking system. Never store a Sanity write token in the public website.

## Publishing guidance

Only publish information approved by hospital leadership. In particular, confirm doctor credentials, OPD timings, medical claims, photos, and captions before publishing.
