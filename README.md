# Holistic EP Lead & Follow-Up Tracker

A Phase 1.1 internal web app concept for Holistic Exercise Physiology to track leads, urgent emails, follow-ups, bookings, and EA daily tasks.

## What was fixed/improved

- Better localStorage safety and migration from the first demo version
- Smoother filtering and clearer filters by owner, service, priority, and status
- Daily EA Command Center on the dashboard
- Daily summary generator for quick updates to Hassan and Jason
- CSV export for leads and urgent emails
- Validation for important forms, including Closed/Lost reason and follow-up date requirements
- Stronger urgent/critical visual indicators
- Improved reports page and task planner filtering
- Netlify files added: `_redirects` and `netlify.toml`
- Mobile and responsive layout polish

## Features

- Demo login roles: Admin, Hassan, Jason, Executive Assistant
- Daily EA dashboard with operational priorities
- Lead pipeline board from New Lead to Closed/Lost
- Urgent email tracker with urgency levels
- Follow-up reminders with overdue/due today visibility
- EA task planner
- Reports page with visual summaries and CSV export
- Settings page for service categories, lead stages, users, and more
- localStorage persistence
- Responsive layout for desktop, tablet, and mobile

## Important

This Phase 1 version uses browser localStorage only. Do not store real client, patient, referral, medical, NDIS, or other sensitive information in this demo. For live business use, connect this to a secure backend with authentication, permissions, encryption, and privacy-compliant data handling.

## How to Run

Open `index.html` directly in a browser.

## Deploy to Netlify

Option 1: Drag-and-drop this folder into Netlify.

Option 2: Upload to GitHub and connect the repository to Netlify.

Build command: leave blank
Publish directory: project root or `/`

## Suggested Next Phase

- Add secure authentication
- Add backend database such as Supabase
- Add Gmail integration for real urgent email syncing
- Add Google Calendar or Halaxy booking integration
- Add role-based permissions
- Add audit trail
- Add CSV import
