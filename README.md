# Harvest Table E-Menu

QR-based e-menu MVP built with Nuxt and Nuxt UI.

## Included in this build

- Public `/menu` page for customers
- Admin `/admin` login page
- Protected `/dashboard` page
- Category CRUD
- Product CRUD
- Product image upload with preview
- Availability toggle
- Local persistence using `localStorage`
- Firebase-ready `firestore.rules` and `storage.rules`

## Demo admin credentials

- Email: `admin@emenu.local`
- Password: `admin12345`

## Local development

```bash
pnpm install
pnpm dev
```

## Build

```bash
pnpm build
```

## Current data mode

This MVP is fully functional in local demo mode. Categories, products, and uploaded images persist in the browser via `localStorage`, which makes it easy to keep building UI and flow before connecting live Firebase services.

## Firebase handoff notes

When you are ready to replace the demo layer with Firebase:

1. Add Firebase project credentials to your Nuxt runtime config.
2. Replace the local persistence inside `app/composables/useMenuStore.ts` with Firestore, Auth, and Storage calls.
3. Apply the included `firestore.rules` and `storage.rules`.
4. Deploy with Firebase Hosting after `pnpm build`.

## Suggested routes

- `/` redirects to `/menu`
- `/menu` customer menu
- `/admin` admin login
- `/dashboard` protected admin dashboard
