# 🖨️ PrintNSupply

![PrintNSupply Banner](./image/banner.png)

**PrintNSupply** is a modern, student-focused printing and stationery web application that enables fast PDF uploads, print orders, and stationery purchases with a seamless, responsive experience.

Built with **React + Vite frontend** and **Node.js/Express backend**, this project demonstrates a full-stack solution for on-demand document services with cloud uploads, secure authentication, and online payments.

---

## 🚀 Project Overview

- **Objective:** Provide students a fast, reliable platform for printing and stationery purchases.
- **Scope:** Upload PDFs, manage shopping carts, checkout via Stripe, and handle orders through an admin panel.
- **Key Features:** Cloud-powered file uploads, responsive UI, secure authentication, and seamless payment integration.

---

## 🧰 Tech Stack

![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-0078FF?logo=cloudinary&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?logo=stripe&logoColor=white)

---

## ✨ Key Features

- **PDF Uploads:** Cloudinary-powered, with signed/unsigned flows.
- **Shopping Cart:** Add, remove, and manage print & stationery items.
- **Admin Panel:** Manage products, view orders, and track print requests.
- **Stripe Integration:** Smooth, secure online payments.
- **Responsive Design:** Mobile-first UI using Tailwind CSS.
- **Authentication:** Clerk-powered user authentication and session management.

---

## 🧭 Repository Structure

```
/frontend      # React + Vite frontend
  └─ src/     # Components, pages, config
/backend       # Node.js + Express backend
  └─ server.js
  └─ package.json
/image         # Assets (screenshots, banners)
/test          # Testing utilities
*.md           # Historical notes (archive recommended)
```

---

## ⚙️ Local Development

### Prerequisites
- Node.js >= 18
- npm or yarn
- Cloudinary account (for file uploads)
- Stripe test keys
- Supabase/Postgres credentials

### Setup
```bash
# Clone repository
git clone https://github.com/uttamofficial/PrintNSupply.git
cd PrintNSupply
```

**Frontend**
```bash
cd frontend
npm install
# Copy environment variables into .env.local
npm run dev
# Access at http://localhost:5173
```

**Backend**
```bash
cd backend
npm install
# Set environment variables in .env
node server.js
# Runs on configured PORT (default: 5000)
```

---

## 🧾 Environment Variables

**Frontend (`frontend/.env.local`)**
```
VITE_CLERK_PUBLISHABLE_KEY
VITE_SUPABASE_KEY
VITE_CLOUDINARY_UPLOAD_PRESET
VITE_API_BASE_URL (e.g., http://localhost:5000)
```

**Backend (`backend/.env`)**
```
PORT=5000
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
CLOUDINARY_CLOUD_NAME
STRIPE_SECRET_KEY
DATABASE_URL or SUPABASE_SERVICE_KEY
```

> 🔒 Never commit secrets. Use `.env` or a secret manager.

---

## 🛠️ Production Build & Deployment

**Frontend**
```bash
cd frontend
npm run build
# Deploy /dist folder to Vercel or Netlify
```

**Backend**
- Deploy via Render, VPS, or Docker production setup

**Tips**
- Ensure Cloudinary preset supports unsigned uploads if using client-side.
- Use dynamic import() to reduce Vite bundle sizes.
- Verify Clerk keys to avoid frontend runtime errors.

---

## 🧩 Repository Cleanup (Optional)

We have multiple `.md` files for past notes, guides, and fixes. Options:
1. **Archive (Recommended):** Move all `*.md` files (except `backend/README.md`) into `docs/archived-md/`.
2. **Permanent Delete:** Remove all historical notes (irreversible).

---

## 🤝 Contributing

1. Fork the repository  
2. Create a feature branch  
3. Submit a PR with a detailed description

---

## 🔗 Live Demo & Repository

- **GitHub:** [https://github.com/uttamofficial/PrintNSupply](https://github.com/uttamofficial/PrintNSupply)  
- **Live Deployment:** [https://printnsupply.onrender.com]  

