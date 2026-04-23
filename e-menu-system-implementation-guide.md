# E-Menu System – Implementation Guide

## Overview

Build a QR-based E-Menu web application where customers can scan a QR code to browse menu items, while admins can securely manage categories and products through an admin dashboard.

This version focuses on a simple MVP:
- Customers can view the menu only
- Admins can log in and manage menu data
- The app is easy to deploy with Firebase

---

## Goals

- Provide a mobile-friendly digital menu
- Let customers access the menu without logging in
- Allow admins to manage categories and products
- Support image uploads for products
- Deploy quickly using Firebase Hosting

---

## Recommended Tech Stack

## Frontend
- Nuxt
- Tailwind CSS for styling

## Backend / BaaS
- Firebase Hosting
- Firestore Database
- Firebase Authentication
- Firebase Storage

---

## User Roles

## 1. Customer (Guest)
Customers do not need an account.

They can:
- Scan a QR code
- Open the menu page
- Browse categories
- View available products
- View product details

## 2. Admin
Admins must log in.

They can:
- Log in and log out
- Create, edit, and delete categories
- Create, edit, and delete products
- Upload product images
- Toggle product availability

---

## Core Features

## Customer Features
- View menu categories
- View menu items grouped by category
- View product details
- View only available products

## Admin Features
- Secure login
- Dashboard access
- Category CRUD
- Product CRUD
- Product image upload
- Availability toggle

---

## Suggested Project Structure

```text
src/
├── pages/
│   ├── MenuPage.vue
│   ├── AdminLogin.vue
│   └── Dashboard.vue
├── components/
│   ├── CategoryList.vue
│   ├── ProductCard.vue
│   └── ProductForm.vue
├── services/
│   ├── firebase.js
│   ├── productService.js
│   └── categoryService.js
├── router/
│   └── index.js
├── stores/
│   └── authStore.js
└── App.vue
```

You can adapt the structure if using React.

---

## Firebase Setup

## 1. Create a Firebase Project
In Firebase Console, create a new project for the E-Menu system.

Enable the following services:
- Firestore Database
- Authentication
- Storage
- Hosting

## 2. Authentication
Enable:
- Email/Password sign-in method

This will be used for admin login only.

## 3. Firestore
Create the database in production mode or test mode first, then apply proper security rules.

## 4. Storage
Use Firebase Storage to store product images.

## 5. Hosting
Use Firebase Hosting to deploy the frontend.

---

## Firestore Data Model

## Collection: `categories`

```json
{
  "id": "string",
  "name": "string",
  "created_at": "timestamp"
}
```

## Collection: `products`

```json
{
  "id": "string",
  "name": "string",
  "price": 0,
  "category_id": "string",
  "image_url": "string",
  "description": "string",
  "is_available": true,
  "created_at": "timestamp"
}
```

### Notes
- `category_id` links a product to a category
- `is_available` controls whether customers can see the product
- `image_url` stores the Firebase Storage public download URL

---

## Routing Example

Suggested routes:

```text
/               -> redirect to /menu
/menu           -> customer menu page
/admin          -> admin login page
/dashboard      -> admin dashboard (protected)
```

---

## Firebase Initialization Example

```js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // your firebase config
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
```

---

## Customer Flow

1. Customer scans the QR code
2. QR code opens:

```text
https://your-app.web.app/menu
```

3. App loads menu data from Firestore
4. Categories are displayed
5. Products are grouped under each category
6. Only products where `is_available = true` are shown

---

## Admin Flow

1. Admin opens:

```text
/admin
```

2. Admin logs in with email and password
3. After successful login, redirect to dashboard
4. Admin manages:
   - Categories
   - Products
   - Product images
   - Availability status

---

## Functional Requirements

## Menu Display Logic
- Fetch all categories
- Fetch all products
- Group products by `category_id`
- Show only available products on customer page
- Sort categories and products if needed

## Admin Product Logic
- Create product with:
  - name
  - price
  - category
  - description
  - image
  - availability status
- Update existing product
- Delete product
- Upload and replace product image
- Toggle product availability without deleting

---

## Image Upload Flow

1. Admin selects an image in the product form
2. Upload image to Firebase Storage
3. Retrieve the download URL
4. Save the download URL in Firestore under `image_url`

Example flow:
- Storage path: `products/{fileName}`
- Save returned URL into product document

---

## Basic Security Rules

## Firestore Rules

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }

    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## Storage Rules

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /products/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Important Note
These are basic MVP rules only. For production, you should restrict write access further, for example by allowing only verified admin users.

---

## UI Requirements

## Customer UI
- Mobile-first responsive layout
- Clean and simple design
- Category-based sections
- Product card layout
- Product image, name, price, and short description
- Clear availability status if needed

## Admin UI
- Simple login page
- Dashboard layout
- Table or list view for categories and products
- Create/edit form
- Image preview before upload
- Delete confirmation dialog

---

## Recommended Components

## Customer Side
- `CategoryList.vue`
- `ProductCard.vue`
- `MenuPage.vue`

## Admin Side
- `AdminLogin.vue`
- `Dashboard.vue`
- `ProductForm.vue`
- `CategoryForm.vue`
- `ProductTable.vue`

---

## Deployment Steps

## 1. Build the app

```bash
npm run build
```

## 2. Deploy to Firebase

```bash
firebase deploy
```

If deploying only hosting:

```bash
firebase deploy --only hosting
```

---

## QR Code Usage

Generate a QR code that points to:

```text
https://your-app.web.app/menu
```

Place the QR code:
- On each table
- At the restaurant entrance
- On printed marketing materials if needed

---

## Suggested MVP Checklist

- [ ] Firebase project created
- [ ] Firestore enabled
- [ ] Authentication enabled
- [ ] Storage enabled
- [ ] Hosting enabled
- [ ] Customer menu page completed
- [ ] Admin login completed
- [ ] Admin dashboard completed
- [ ] Category CRUD completed
- [ ] Product CRUD completed
- [ ] Image upload completed
- [ ] Product availability toggle completed
- [ ] Security rules applied
- [ ] App deployed
- [ ] QR code generated and tested

---

## Future Enhancements

After the MVP is complete, you can extend the system with:

- Add-to-cart functionality
- Ordering system
- Table-based ordering
- KHQR / Bakong payment integration
- Multi-language support (English / Khmer)
- Product reviews and ratings
- Search and filter
- Promo banners
- Recommended items
- Admin analytics dashboard

---

## Definition of Done

The project is complete when:

- Customers can scan a QR code and view the menu
- Customers can browse categories and products without logging in
- Admin can log in securely
- Admin can manage categories and products
- Admin can upload product images
- Product availability works correctly
- The app is deployed and accessible online

---

## Optional Implementation Notes for AI Coding Assistant

If you are using this document to guide an AI coding assistant, instruct it to:

- Build the frontend using Vue 3
- Use Firebase modular SDK
- Keep customer pages public
- Protect admin routes
- Separate Firebase services into reusable service files
- Use clean component-based structure
- Keep code simple and MVP-focused
- Prepare the project for future ordering and KHQR integration

---

## Recommended Next Phase

After this MVP, the best next step is:

1. Add table-specific QR codes
2. Add ordering flow
3. Add kitchen/admin order tracking
4. Add payment integration
5. Add multi-language support

This will turn the E-Menu into a full digital restaurant ordering platform.
