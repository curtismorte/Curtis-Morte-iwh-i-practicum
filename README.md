# Integrating With HubSpot I: Foundations Practicum

Node/Express app for the Integrating With HubSpot I: Foundations certification practicum (Curtis Morte).

This practicum is one of two certification requirements; the other is the Academy exam (at least 75%).

## Custom object list view (developer test account)

Replace the placeholders below with your **developer test account** IDs after you create the custom object:

https://app.hubspot.com/contacts/<test-account-id>/objects/<custom-object-id>/views/all/list

Example shape only (not a live link): `https://app.hubspot.com/contacts/12345678/objects/2-12345678/views/all/list`

## Setup (developer test account)

1. Create a **developer test account** (not a live CRM account).
2. Create a private app titled **Curtis's Practicum Private App** with scopes (read and write):
   - `crm.schemas.custom`
   - `crm.objects.custom`
   - `crm.objects.contacts`
3. Create a custom object (subject: **Pets**) with at least three custom properties, including a string property **Name**, plus **Breed** and **Age**.
4. Add at least three records and associate the custom object with contacts.
5. Copy `.env.example` to `.env` and set:
   - `PRIVATE_APP_ACCESS` — private app token (never commit this)
   - `CUSTOM_OBJECT_TYPE` — custom object type ID or FQN (e.g. `2-xxxxxxxx`)
6. Install and run:

```bash
npm install
node index.js
```

Open http://localhost:3000 — homepage table and **Add to this table** → `/update-cobj`.

**Without a token:** `GET /` and `GET /update-cobj` still respond; the homepage shows an empty table and a notice. `POST /update-cobj` requires credentials.

## Routes

| Method | Path | Behavior |
|--------|------|----------|
| GET | `/` | Table of custom object records + link to form |
| GET | `/update-cobj` | Form titled `Update Custom Object Form \| Integrating With HubSpot I Practicum` |
| POST | `/update-cobj` | Create record via HubSpot API, redirect to `/` |

## Tips

- Commit often; keep work on `working-branch`, then merge to `main` before any eventual submission.
- **DO NOT** commit your private app token. Keep it in `.env` only (already in `.gitignore`).
- Do not submit from Academy until authorized; repository must be a public fork named `Curtis-Morte-iwh-i-practicum`.

## Full directions

See the [practicum instructions](https://app.hubspot.com/academy/l/tracks/1092124/1093824/5493?language=en) in HubSpot Academy.
