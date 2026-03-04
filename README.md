# E-Menu (Digital Restaurant Menu)

A mobile-friendly web menu that opens directly from a QR code URL like:

`https://e-menu.web.app/r/{restaurantId}`

## Features

- QR-code-ready route format (`/r/:restaurantId`)
- Menu cards with image, item name, price, and rating
- Mobile-first scrolling layout
- Tap/click on an item to open details modal

## Local run

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173/` (defaults to demo restaurant).

## Firebase Hosting

`firebase.json` includes a rewrite so `/r/**` loads `index.html` for client-side route handling.
