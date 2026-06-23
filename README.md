# Holistic EP Command Center Demo

A polished Phase 1 static web app demo for **Holistic Exercise Physiology** lead movement, urgent emails, follow-up reminders, and Executive Assistant daily task planning.

## What is included

- Client-ready login/demo screen
- Role views for Admin, Hassan, Jason, and Executive Assistant
- Executive Command Center dashboard
- Lead Pipeline with stage movement
- Urgent Email Tracker
- Follow-Up Reminders board
- EA Task Planner
- Executive Reports with visual summaries
- Demo Settings page
- CSV export for leads and urgent emails
- Daily EA summary generator for Hassan and Jason
- Responsive design for desktop, tablet, and mobile
- LocalStorage persistence for demo data

## Important privacy note

This is a static Phase 1 demo. It uses browser LocalStorage only. Do not enter real patient, NDIS, referral, health, or personally identifiable information until the app is connected to a secure backend with authentication, permissions, audit logs, and privacy safeguards.

## How to open locally

Open `index.html` in your browser.

## How to deploy to Netlify

1. Upload the full folder to GitHub or drag the folder contents into Netlify.
2. Build command: leave blank.
3. Publish directory: project root.
4. Netlify will serve the static files directly.

## Files

- `index.html` — app shell
- `styles.css` — full professional UI styling
- `app.js` — data model, demo data, UI rendering, CRUD actions, filters, reports
- `_redirects` — Netlify redirect fallback
- `netlify.toml` — basic Netlify configuration and headers

## Demo positioning

Use this demo to show the client how a simple internal system can help Hassan, Jason, and the Executive Assistant:

- Reduce missed enquiries
- Track lead movement clearly
- Prioritise urgent emails
- Keep warm leads active
- Assign ownership
- Create daily visibility over bookings and follow-ups
