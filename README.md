# HelpLink - Volunteer Coordination Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css" alt="TailwindCSS" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?logo=prisma" alt="Prisma" />
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Google%20OAuth-4285F4?logo=google" alt="Google OAuth" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</div>

<br />

<p align="center">
  <strong>✨ Break social work into small, actionable micro-tasks — making it easier for anyone to contribute instantly where help is needed most. ✨</strong>
</p>

<br />

## 📖 Table of Contents

- [About HelpLink](#-about-helplink)
- [Key Features](#-key-features)
- [Live Demo](#-live-demo)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Testing Accounts](#-testing-accounts)
- [License](#-license)

---

## 🎯 About HelpLink

**HelpLink** is a data-driven volunteer coordination platform that connects NGOs and field workers with volunteers through an innovative **micro-task system**. Instead of overwhelming volunteers with large responsibilities, HelpLink breaks down community needs into small, actionable tasks that anyone can complete in **2-3 hours**.

---

## ✨ Key Features

### 1. 🔐 Google OAuth Authentication
- Sign in with your own Google account
- Real email verification and automatic registration

### 2. 📊 Smart Priority Scoring
- Medical: 5 points | Food: 4 points | Education/Shelter: 3 points
- Location density bonus (+1 per report in same area)
- Severity bonus (+1 for HIGH severity)

### 3. 🧩 Micro-Task System
- Break large reports into small, claimable tasks
- Real-time status updates (Available → Claimed → Completed)

### 4. 🗺️ Location-Based Heatmap
- Groups reports by location with color-coded urgency
- Click any location to view filtered reports

### 5. 👤 Volunteer Profile Management
- Profile picture upload, multi-select skills, preferred location

### 6. 📱 Dual-Role System
- **Reporters (NGOs)**: Submit and track community needs
- **Volunteers**: Browse, claim, and complete tasks

---

## 🌐 Live Demo

| Environment | URL | Status |
|-------------|-----|--------|
| **Production** | https://sparklesquadhelplink.vercel.app | ✅ Live |
| **Development** | http://localhost:3000 | Local only |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript 5.6 |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| Database | PostgreSQL (Neon) / SQLite (dev) |
| ORM | Prisma 5.22 |
| Auth | NextAuth.js (Google OAuth + Credentials) |
| Icons | Lucide React |
| Deployment | Vercel |

---

## 🔧 Installation & Setup

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/pragga9876/HelpLink.git
cd HelpLink

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Generate Prisma client and setup database
npx prisma generate
npx prisma db push
node prisma/seed.js

# 5. Run the development server
npm run dev
```

Open http://localhost:3000

---

## 🔐 Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL or SQLite connection string |
| `NEXTAUTH_SECRET` | JWT encryption secret |
| `NEXTAUTH_URL` | Application URL |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID (optional) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret (optional) |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Create new user |
| POST | `/api/auth/callback/credentials` | Email login |
| POST | `/api/auth/callback/google` | Google login |
| GET | `/api/reports` | Get all reports |
| POST | `/api/reports` | Create new report |
| GET | `/api/microtasks` | Get all tasks |
| POST | `/api/microtasks/[id]/claim` | Claim a task |
| GET | `/api/profile` | Get volunteer profile |
| POST | `/api/profile` | Update profile |

---

## 🧪 Testing Accounts

| Role | Email | Password |
|------|-------|----------|
| Reporter (NGO) | `ngo1@example.com` | `password123` |
| Volunteer | `volunteer1@example.com` | `password123` |

**Google Sign In**: Use your own Google account - it will be automatically registered!

---

## 📄 License

MIT License - see LICENSE file for details.

---

## 📞 Contact

**Project Maintainer**: Pragga Mukherjee

- GitHub: https://github.com/pragga9876
- Project Link: https://github.com/pragga9876/HelpLink
- Live Demo: https://sparklesquadhelplink.vercel.app

---

<div align="center">
  <strong>Built with ❤️ for the Google Solution Challenge 2026</strong>
  <br />
  <sub>Making social impact accessible to everyone, one micro-task at a time.</sub>
</div>
```
