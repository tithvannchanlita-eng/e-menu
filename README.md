# E-Menu (Digital Restaurant Menu)

A modern, mobile-first digital restaurant menu built with **Vue 3** and **Tailwind CSS**.

Customers scan a QR code and open a URL like:

`https://e-menu.web.app/r/{restaurantId}`

## Features

- QR-route friendly pattern (`/r/:restaurantId`)
- Modern card UI for menu items (image, name, price, rating)
- Smooth mobile browsing and sticky restaurant header
- Item detail modal on tap
- Firebase Hosting rewrite for SPA routes

## Tech Stack

- Vue 3 (CDN build)
- Tailwind CSS (CDN)
- Firebase Hosting (for deployment)

## Local Run

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/`.

## Firebase Hosting

`firebase.json` rewrites `/r/**` to `/index.html` so direct QR route visits work.
