```markdown
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
- [Architecture Overview](#-architecture-overview)
- [Database Schema](#-database-schema)
- [Priority Scoring Algorithm](#-priority-scoring-algorithm)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Testing Accounts](#-testing-accounts)
- [Caveats & Limitations](#-caveats--limitations)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 About HelpLink

**HelpLink** is a data-driven volunteer coordination platform that connects NGOs and field workers with volunteers through an innovative **micro-task system**. 

### The Problem We Solve

Instead of overwhelming potential volunteers with large, intimidating responsibilities, HelpLink breaks down community needs into small, actionable tasks that anyone can complete in **2-3 hours**.

---

## ✨ Key Features

### 1. 🔐 Google OAuth Authentication
- Sign in with your own Google account
- Real email verification
- Automatic user registration
- Works on both localhost and production

### 2. 📊 Smart Priority Scoring System
- Rule-based algorithm that automatically calculates urgency scores
- Medical emergencies score 5 points, Food needs 4 points
- Location density bonus (+1 per report in same area)
- Severity bonus (+1 for HIGH severity)
- No AI/ML required - fully deterministic

### 3. 🧩 Micro-Task System
- Break down large reports into small, actionable tasks
- Examples: "Deliver 5 meals", "Teach 2-hour session"
- Claim tasks instantly with one click
- Real-time status updates (Available → Claimed → In Progress → Completed)

### 4. 🗺️ Location-Based Heatmap
- Groups reports by location automatically
- Color-coded urgency (Red = Critical, Orange = High, Green = Normal)
- Progress bars show priority levels
- Click any location to see filtered reports

### 5. 👤 Volunteer Profile Management
- Profile picture upload (saved locally)
- Multi-select skills (Medical Aid, Teaching, Logistics)
- Preferred location setting
- Profile completion tracker

### 6. 📱 Dual-Role System
- **Reporters (NGOs)**: Submit community needs, track priorities
- **Volunteers**: Browse tasks, claim assignments, track impact

---

## 🌐 Live Demo

| Environment | URL | Status |
|-------------|-----|--------|
| **Production** | https://sparklesquadhelplink.vercel.app | ✅ Live |
| **Development** | http://localhost:3000 | Local only |

### Demo Credentials
- **Google Sign In** - Use your own Google account
- **Email/Password** - Create an account via /register

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.0.7 | React framework with App Router |
| TypeScript | 5.6.3 | Type safety |
| Tailwind CSS | 3.4.14 | Utility-first styling |
| shadcn/ui | Latest | Accessible components |
| Lucide React | 0.460.0 | Icons |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js API Routes | 15.0.7 | Serverless API endpoints |
| Prisma ORM | 5.22.0 | Database management |
| NextAuth.js | 4.24.8 | Authentication |
| bcryptjs | 2.4.3 | Password hashing |

### Authentication

| Provider | Status |
|----------|--------|
| Google OAuth | ✅ Fully working |
| Email/Password | ✅ Fully working |

### Database

| Environment | Database | Purpose |
|-------------|----------|---------|
| Development | SQLite | Local development |
| Production | PostgreSQL (Neon) | Cloud database |

### Deployment

| Platform | Purpose |
|----------|---------|
| Vercel | Hosting |
| Neon | PostgreSQL hosting |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                      │
│                   (Google Sign In / Email Login)            │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js (Vercel Hosting)                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Frontend   │  │  API Routes │  │  Authentication     │  │
│  │   Pages     │◄─┤  (Serverless│  │  (NextAuth.js)      │  │
│  │             │  │   Functions)│  │  - Google OAuth     │  │
│  └─────────────┘  └─────────────┘  │  - Credentials      │  │
│                                    └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Prisma ORM Layer                       │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────────┐
│   SQLite (Development)  │     │  PostgreSQL (Production)    │
└─────────────────────────┘     └─────────────────────────────┘
```

---

## 🗄️ Database Schema

### Models

**User**
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| email | String | Unique login email |
| password | String | bcrypt-hashed (empty for Google users) |
| name | String | Display name |
| role | String | VOLUNTEER or REPORTER |

**Report**
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| problemtype | String | MEDICAL, FOOD, EDUCATION, etc. |
| location | String | City/area name |
| description | Text | Detailed description |
| severity | String | LOW, MEDIUM, HIGH |
| priorityscore | Int | Calculated score (1-10+) |

**MicroTask**
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| title | String | Task name |
| description | Text | Task details |
| status | String | AVAILABLE, CLAIMED, COMPLETED |
| location | String | Where task is needed |

**VolunteerProfile**
| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| userid | String | FK to User |
| skills | String | Comma-separated skills |
| preferredLocation | String | City/area preference |

---

## 📊 Priority Scoring Algorithm

### Formula

```
Priority Score = BaseScore + LocationBonus + SeverityBonus
```

### Base Scores

| Problem Type | Base Score |
|--------------|------------|
| MEDICAL | 5 |
| FOOD | 4 |
| EDUCATION | 3 |
| SHELTER | 3 |
| SANITATION | 2 |
| OTHER | 1 |

### Bonuses

| Bonus | Condition | Value |
|-------|-----------|-------|
| LocationBonus | Reports in same location | +1 per report |
| SeverityBonus | Severity = HIGH | +1 |

### Priority Tiers

| Score | Priority | Color |
|-------|----------|-------|
| 7-10+ | Critical | 🔴 Red |
| 4-6 | High | 🟠 Orange |
| 1-3 | Normal | 🟢 Green |

---

## 🔧 Installation & Setup

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/pragga9876/HelpLink.git
cd HelpLink
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Set Up Environment Variables

Create `.env` file:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### Step 4: Set Up the Database

```bash
npx prisma generate
npx prisma db push
node prisma/seed.js
```

### Step 5: Run the Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| DATABASE_URL | Database connection string | ✅ Yes |
| NEXTAUTH_SECRET | JWT encryption secret | ✅ Yes |
| NEXTAUTH_URL | Application URL | ✅ Yes |
| GOOGLE_CLIENT_ID | Google OAuth Client ID | ❌ Optional |
| GOOGLE_CLIENT_SECRET | Google OAuth Client Secret | ❌ Optional |

### For Production (Vercel + Neon)

| Variable | Value |
|----------|-------|
| DATABASE_URL | Neon PostgreSQL connection string |
| NEXTAUTH_SECRET | Generated secret (32+ characters) |
| NEXTAUTH_URL | https://your-app.vercel.app |
| GOOGLE_CLIENT_ID | From Google Cloud Console |
| GOOGLE_CLIENT_SECRET | From Google Cloud Console |

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Create new user | ❌ |
| POST | /api/auth/callback/credentials | Email login | ❌ |
| POST | /api/auth/callback/google | Google login | ❌ |
| GET | /api/reports | Get all reports | ✅ |
| POST | /api/reports | Create new report | ✅ |
| GET | /api/microtasks | Get all tasks | ✅ |
| POST | /api/microtasks/[id]/claim | Claim a task | ✅ |
| GET | /api/profile | Get volunteer profile | ✅ |
| POST | /api/profile | Update profile | ✅ |

---

## 🧪 Testing Accounts

### Demo Accounts (Pre-seeded)

| Role | Email | Password |
|------|-------|----------|
| Reporter (NGO) | ngo1@example.com | password123 |
| Volunteer | volunteer1@example.com | password123 |

### Google Sign In

Use your own Google account - it will be automatically registered!

---

## ⚠️ Caveats & Limitations

| Limitation | Status |
|------------|--------|
| Real-time updates | ⏳ Planned |
| File uploads | ⏳ Planned |
| Email notifications | ⏳ Planned |
| Mobile app | ⏳ Planned |
| Password reset | ⏳ Planned |

### Technical Constraints

| Environment | Constraint |
|-------------|------------|
| Vercel | Serverless functions (10s timeout) |
| Neon Free Tier | 1GB storage |
| SQLite | Local development only |

---

## 🔮 Future Improvements

### Short-term
- [x] Google OAuth login
- [x] Profile picture upload
- [x] Location heatmap
- [ ] Email notifications
- [ ] Task completion verification

### Medium-term
- [ ] Real-time updates (WebSockets)
- [ ] Interactive map
- [ ] Volunteer impact badges

### Long-term
- [ ] Mobile app (React Native)
- [ ] AI-assisted task breakdown
- [ ] Impact analytics dashboard

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Use functional components with hooks
- Write meaningful commit messages

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

### Database Architecture

| Environment | Database |
|-------------|----------|
| Local Development | SQLite |
| Production | PostgreSQL (Neon) |

---

<div align="center">
  <strong>Built with ❤️ for the Google Solution Challenge 2026</strong>
  <br />
  <sub>Making social impact accessible to everyone, one micro-task at a time.</sub>
</div>
```
git commit -m "docs: Update README with latest features"
git push origin main
```
