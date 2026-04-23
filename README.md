# 🌱 Leftovers to Life

> **Team Neural Ninjas**
> A full-stack food redistribution platform that connects food donors with NGOs and agricultural trusts to reduce waste and feed communities.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Team](https://img.shields.io/badge/Team-Neural%20Ninjas-purple.svg)](#)
[![UN SDG](https://img.shields.io/badge/UN%20SDG-Zero%20Hunger-blue.svg)](https://sdgs.un.org/goals/goal2)

---

## 🌍 What is Leftovers to Life?

**Leftovers to Life** is a smart, real-world food redistribution platform that:

- Connects **food donors** (restaurants, households, caterers) with **NGOs** for surplus food pickup
- Routes **organic kitchen waste** to **agricultural trusts** for composting
- Uses **AI/ML** to predict demand hotspots and optimize pickup routes
- Provides **real-time map tracking**, analytics dashboards, and a gamified **leaderboard**
- Aligns with UN SDGs: Zero Hunger, No Poverty, Responsible Consumption, Climate Action

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 JWT Authentication | Secure signup/login for Donors, NGOs, Admins |
| 🍱 Donor Dashboard | Post food with type, quantity, location, expiry |
| 🏢 NGO Dashboard | AI-scored nearby donations with radius slider |
| 🗺️ Live Map | OpenStreetMap with color-coded donation markers |
| ♻️ Organic Waste | Route kitchen waste to agricultural trusts |
| 📊 Admin Analytics | SDG impact tracker, user/donation tables |
| 🏆 Leaderboard | Gold/silver/bronze podium with points system |
| 🤖 AI Matching | Haversine geofencing + freshness scoring |
| 📍 Geolocation | Browser GPS for donors and NGOs |
| 🔔 Toast Alerts | Real-time success/error notifications |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + Tailwind CSS |
| Routing | React Router v6 |
| Maps | Leaflet + OpenStreetMap |
| HTTP | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT (bcryptjs) |
| Dev Server | Nodemon |

---

## 📁 Folder Structure

```
leftovers-to-life/
├── client/                        # ⚛️ React Frontend
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx                # Main router
│       ├── index.css              # Global styles (glassmorphism, animations)
│       ├── main.jsx               # React entry point
│       ├── components/
│       │   ├── DonationCard.jsx   # Reusable donation display card
│       │   ├── Navbar.jsx         # Sticky nav with mobile hamburger
│       │   ├── Spinner.jsx        # Loading spinner
│       │   ├── StatCard.jsx       # Animated stat cards
│       │   └── Toast.jsx          # Auto-dismiss toast notifications
│       ├── context/
│       │   └── AuthContext.jsx    # JWT auth + React context
│       ├── pages/
│       │   ├── AdminDashboard.jsx # Analytics + user/donation tables
│       │   ├── DonorDashboard.jsx # Post & track donations
│       │   ├── LandingPage.jsx    # Hero + features + SDG banner
│       │   ├── LeaderboardPage.jsx# Gamified rankings with podium
│       │   ├── LoginPage.jsx      # Login + demo quick-login
│       │   ├── MapPage.jsx        # Interactive Leaflet map
│       │   ├── NgoDashboard.jsx   # AI-scored nearby donations
│       │   └── RegisterPage.jsx   # Signup with role selector
│       └── utils/
│           └── api.js             # Axios instance with interceptors
│
└── server/                        # 🟢 Node.js Backend
    ├── index.js                   # Express app entry
    ├── seed.js                    # Demo data seeder
    ├── .env.example               # Environment template
    ├── package.json
    ├── config/
    │   └── db.js                  # MongoDB connection
    ├── controllers/
    │   ├── authController.js      # Register + Login
    │   ├── donationController.js  # Full CRUD + analytics
    │   ├── ngoController.js       # NGO management
    │   └── userController.js      # Profile management
    ├── middleware/
    │   └── auth.js                # protect / adminOnly / ngoOnly
    ├── models/
    │   ├── Donation.js            # Mongoose schema
    │   ├── NGO.js
    │   └── User.js
    └── routes/
        ├── auth.js
        ├── donations.js
        ├── ngos.js
        └── users.js
```

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- [MongoDB](https://www.mongodb.com/try/download/community) (local) **or** a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- Git

### Step 1 — Clone the repository

```bash
git clone https://github.com/KishanGC/example.git
cd example
```

### Step 2 — Backend setup

```bash
cd server
npm install
```

Create your `.env` file:

```bash
copy .env.example .env
```

Edit `server/.env`:

```env
MONGO_URI=mongodb://localhost:27017/leftovers-to-life
JWT_SECRET=your_super_secret_key_here
PORT=5000
```

Start the backend:

```bash
npm run dev        # uses nodemon for hot-reload
# or
npm start          # production mode
```

### Step 3 — Seed demo data (optional but recommended)

```bash
# from the server/ directory
npm run seed
```

This creates:
- 👤 **Admin:** `admin@demo.com` / `demo1234`
- 🍽️ **Donor:** `donor@demo.com` / `demo1234`
- 🏢 **NGO:** `ngo@demo.com` / `demo1234`
- 12 sample donations across New Delhi

### Step 4 — Frontend setup

```bash
cd ../client
npm install
npm run dev
```

### Step 5 — Open in browser

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## 🔌 Environment Variables

Create `server/.env` (never commit this file):

```env
# Required
MONGO_URI=mongodb://localhost:27017/leftovers-to-life
JWT_SECRET=your_super_secret_key_here

# Optional
PORT=5000
```

For MongoDB Atlas, replace `MONGO_URI` with your Atlas connection string:

```env
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/leftovers-to-life?retryWrites=true&w=majority
```

---

## 📡 API Documentation

### Auth

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | `/api/auth/register` | Register new user | ❌ |
| POST | `/api/auth/login` | Login & get JWT token | ❌ |

### Donations

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/donations` | Get all donations (with filters) | ✅ |
| GET | `/api/donations/my` | Get my donations | ✅ Donor |
| GET | `/api/donations/analytics` | Platform analytics | ✅ Admin |
| POST | `/api/donations` | Create donation | ✅ Donor |
| PUT | `/api/donations/:id/accept` | Accept donation | ✅ NGO |
| PUT | `/api/donations/:id/reject` | Reject donation | ✅ NGO |
| PUT | `/api/donations/:id/complete` | Mark completed | ✅ |

### Users

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/users/me` | Get my profile | ✅ |
| PUT | `/api/users/me` | Update my profile | ✅ |
| GET | `/api/users` | Get all users | ✅ Admin |

### NGOs

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| GET | `/api/ngos` | List all NGOs | ✅ |

---

## 👥 User Roles

| Role | Access | Default |
|------|--------|---------|
| `donor` | Post donations, track history | ✅ Default |
| `ngo` | Accept/reject/complete donations | Set at register |
| `admin` | All + analytics + user management | Manually set in DB |

---

## 🤖 AI/ML Features

### Implemented

- **Haversine Geofencing** — calculates exact great-circle distance between NGO and donation
- **AI Priority Score** — `score = (1/distance) × log(timeRemaining + 1)` — closer & fresher = higher priority
- **Smart Sorting** — donations auto-sorted by AI score on NGO dashboard
- **Demand Estimation** — admin dashboard shows impact metrics and SDG progress bars

### Future Roadmap

- TensorFlow.js demand prediction model
- Duplicate detection with NLP
- Real-time WebSocket notifications (Socket.IO)
- Route optimization with OSRM or Google Maps Directions API
- Multi-language support (Hindi, Tamil, Bengali)
- CSR module for corporate reporting

---

## 📊 Impact Metrics (Estimated)

| Metric | Estimate |
|--------|---------|
| Per donation | ~5 kg food, ~10 meals |
| CO₂ reduction | ~2 kg per donation |
| Compost yield | ~3 kg per organic donation |

---

## 🎨 Design System

- **Theme:** Dark eco-green (slate-900 background, green-400 accent)
- **Typography:** Inter + Outfit (Google Fonts)
- **Effects:** Glassmorphism cards, gradient text, micro-animations
- **Components:** Reusable cards, badges, modals, toasts

---

## 📸 Pages

1. **Landing Page** — Hero, impact stats, how-it-works, features, role cards, SDG banner
2. **Login** — Demo quick-login buttons (donor / ngo / admin)
3. **Register** — Role selector (donor or NGO) with full form
4. **Donor Dashboard** — Stats, post donations modal, history with tabs
5. **NGO Dashboard** — AI recommendations, radius slider, accept/reject/complete
6. **Map Page** — Leaflet map with custom markers and filter buttons
7. **Leaderboard** — Gold/silver/bronze podium + full ranked list
8. **Admin Dashboard** — Overview / Donations / Users tabs with SDG tracker

---

## 🗺️ Git Repository Setup

```bash
# 1. Initialize (already done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "feat: complete Leftovers to Life full-stack app - SIH 2025"

# 4. Connect to GitHub repo:
git remote add origin https://github.com/KishanGC/example.git
git branch -M main
git push -u origin main
```

---

## 👥 Team Neural Ninjas

| Role | Name |
|------|------|
| Full-Stack Lead | Team Member 1 |
| Backend Dev | Team Member 2 |
| Frontend Dev | Team Member 3 |
| UI/UX Designer | Team Member 4 |
| ML Engineer | Team Member 5 |
| Project Manager | Team Member 6 |


---

## 🏗️ System Architecture

```
╔══════════════════════════════════════════════════════════════════════╗
║                           USER LAYER                                 ║
║                                                                      ║
║              Browser (Desktop / Mobile / Tablet)                     ║
║              Roles: Donor  |  NGO  |  Admin                          ║
╚══════════════════════════════╤═══════════════════════════════════════╝
                               │
                               ▼
╔══════════════════════════════════════════════════════════════════════╗
║                        FRONTEND LAYER                                ║
║                   React 18 + Vite  (localhost:5173)                  ║
║                                                                      ║
║   ┌─────────────────────────────────────────────────────────────┐   ║
║   │                          Pages                              │   ║
║   │                                                             │   ║
║   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │   ║
║   │  │ LandingPage │  │  LoginPage  │  │ RegisterPage│        │   ║
║   │  │ Hero+Stats  │  │ Quick-login │  │Role Selector│        │   ║
║   │  └─────────────┘  └─────────────┘  └─────────────┘        │   ║
║   │                                                             │   ║
║   │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │   ║
║   │  │   Donor     │  │    NGO      │  │   Admin     │        │   ║
║   │  │  Dashboard  │  │  Dashboard  │  │  Dashboard  │        │   ║
║   │  │ Post+Track  │  │ AI-Score+   │  │ Analytics+  │        │   ║
║   │  │  Donations  │  │ Accept/Done │  │ User Mgmt   │        │   ║
║   │  └─────────────┘  └─────────────┘  └─────────────┘        │   ║
║   │                                                             │   ║
║   │  ┌─────────────┐  ┌─────────────┐                         │   ║
║   │  │   MapPage   │  │ Leaderboard │                         │   ║
║   │  │  Leaflet +  │  │ Gold/Silver/│                         │   ║
║   │  │ OSM Markers │  │ Bronze Rank │                         │   ║
║   │  └─────────────┘  └─────────────┘                         │   ║
║   └─────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
║   ┌─────────────────────────────────────────────────────────────┐   ║
║   │                    Shared Components                        │   ║
║   │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │   ║
║   │  │  Navbar  │  │Donation  │  │ StatCard │  │  Toast   │  │   ║
║   │  │ + Mobile │  │  Card    │  │ +Animate │  │+ Spinner │  │   ║
║   │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │   ║
║   └─────────────────────────────────────────────────────────────┘   ║
║                                                                      ║
║   ┌─────────────────────────────────────────────────────────────┐   ║
║   │           AuthContext  +  api.js (Axios)                    │   ║
║   │  JWT in localStorage → Bearer token on all requests         │   ║
║   └─────────────────────────────────────────────────────────────┘   ║
╚══════════════════════════════╤═══════════════════════════════════════╝
                               │
                               │  HTTP REST (Axios)
                               │  POST /api/auth/login
                               │  POST /api/donations
                               │  GET  /api/donations
                               │  PUT  /api/donations/:id/accept
                               │  GET  /api/users  |  GET /api/ngos
                               ▼
╔══════════════════════════════════════════════════════════════════════╗
║                        BACKEND LAYER                                 ║
║                  Node.js + Express  (localhost:5000)                 ║
║                                                                      ║
║   ┌──────────────────────────────────────────────────────────┐      ║
║   │                     Routes + Controllers                 │      ║
║   │                                                          │      ║
║   │  /api/auth      → authController                        │      ║
║   │                   • POST /register  (hash pw + JWT)      │      ║
║   │                   • POST /login     (verify + JWT)       │      ║
║   │                                                          │      ║
║   │  /api/donations → donationController                     │      ║
║   │                   • POST   /          (Donor only)       │      ║
║   │                   • GET    /          (all + filters)    │      ║
║   │                   • GET    /my        (Donor's own)      │      ║
║   │                   • PUT    /:id/accept   (NGO only)      │      ║
║   │                   • PUT    /:id/complete (NGO only)      │      ║
║   │                   • GET    /analytics   (Admin only)     │      ║
║   │                                                          │      ║
║   │  /api/users     → userController                         │      ║
║   │                   • GET/PUT /me  |  GET / (Admin)        │      ║
║   │                                                          │      ║
║   │  /api/ngos      → ngoController                          │      ║
║   │                   • GET /  (list all NGOs)               │      ║
║   └──────────────────────────────────────────────────────────┘      ║
║                                                                      ║
║   ┌──────────────────────────────────────────────────────────┐      ║
║   │              Auth Middleware  (middleware/auth.js)       │      ║
║   │  protect()   → Verify JWT → Attach user to req          │      ║
║   │  adminOnly() → role === 'admin'                         │      ║
║   │  ngoOnly()   → role === 'ngo'                           │      ║
║   └──────────────────────────────────────────────────────────┘      ║
║                                                                      ║
║   ┌──────────────────────────────────────────────────────────┐      ║
║   │              AI Matching Engine                          │      ║
║   │  Haversine Distance → great-circle km between points    │      ║
║   │  Score = (1 / distance) × log(hoursRemaining + 1)       │      ║
║   │  Result → Donations sorted by AI score for NGO          │      ║
║   └──────────────────────────────────────────────────────────┘      ║
╚══════════════════════════════╤═══════════════════════════════════════╝
                               │
                               │  Mongoose ODM
                               │  mongodb://...@cluster0.mongodb.net
                               ▼
╔══════════════════════════════════════════════════════════════════════╗
║                        DATABASE LAYER                                ║
║                   MongoDB Atlas  (Cloud — Free Tier)                 ║
║                   DB: leftovers-to-life                              ║
║                                                                      ║
║   ┌─────────────────────┐   ┌─────────────────────┐                 ║
║   │   User Collection   │   │ Donation Collection  │                 ║
║   │ • name              │   │ • donor (ref: User)  │                 ║
║   │ • email (unique)    │   │ • acceptedBy (ref)   │                 ║
║   │ • password (hashed) │   │ • foodType (enum)    │                 ║
║   │ • role (enum)       │   │ • quantity           │                 ║
║   │ • organization      │   │ • address            │                 ║
║   │ • location {lat,lng}│   │ • location {lat,lng} │                 ║
║   │ • points            │   │ • status (enum)      │                 ║
║   │ • donationsCount    │   │ • expiresAt          │                 ║
║   └─────────────────────┘   └─────────────────────┘                 ║
║                                                                      ║
║   ┌─────────────────────┐                                            ║
║   │   NGO Collection    │                                            ║
║   │ • name              │                                            ║
║   │ • location {lat,lng}│                                            ║
║   │ • contact           │                                            ║
║   └─────────────────────┘                                            ║
╚══════════════════════════════════════════════════════════════════════╝
```

---

## 📄 License

MIT License — Team Neural Ninjas

---

> *"Turning today's leftovers into tomorrow's life."* 🌱
