# Sri Salasar Marketing — React Website

Responsive React + Vite website concept for Sri Salasar Marketing, matching the supplied blue/orange/white branding and product flyer.

## Run locally
1. Install Node.js (LTS).
2. Extract this ZIP and open a terminal in the project folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the local URL printed by Vite.

## Backend API
- The client defaults to `http://localhost:5000/api`.
- To use another backend, set `VITE_API_URL` in a client `.env` file, for example `VITE_API_URL=https://api.example.com/api`.
- Uploaded local image URLs use the backend host derived from this API URL; Cloudinary image URLs are used directly.

## Backend and database
- Start the backend from `server` with `npm install` and `npm run dev`.
- Configure `server/.env` from `.env.example`, including a reachable `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`. The API will not start if MongoDB is unavailable.
- Product, document, and enquiry records are read from and written directly to MongoDB. `server/data/store.json` is not used at runtime.
- To import legacy JSON records once, run `npm run migrate:store` from `server`. The importer only writes to empty MongoDB collections and skips collections that already contain records.

## Included
- Responsive homepage and mobile navigation
- Product catalogue with category filters and search
- Product categories derived from current product records
- Product detail modal and WhatsApp enquiry buttons
- Bulk quote form that prepares a WhatsApp message
- Admin portal for managing database products, documents, and enquiries
- Original advertisement, generated website design mockup and generated logo assets

## Important production notes
- The WhatsApp number is currently set to `916369021006` based on the supplied flyer. Verify that it is the correct WhatsApp-enabled business number before launch.
- Product and document records are served from MongoDB through the backend API. Uploaded media is stored using the configured Cloudinary integration or the backend upload directory.
- Before using this for real business, configure secure credentials, server-side validation, spam protection, backups, analytics, a privacy policy, and verified contact details.
- Product illustrations are CSS mockups. Replace them with real, high-quality product photos for the live store.
- Pricing is intentionally not hard-coded; use enquiries for bulk pricing until official prices are supplied.
- The logo and ad assets are the user-provided/generated visual references included in `src/assets`.
