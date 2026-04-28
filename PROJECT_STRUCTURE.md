helplink/
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── dev.db
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/
│   │   │   │   └── route.ts
│   │   │   ├── reports/
│   │   │   │   └── route.ts
│   │   │   └── microtasks/
│   │   │       └── route.ts
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── reports/
│   │   │   ├── page.tsx
│   │   │   └── new/
│   │   │       └── page.tsx
│   │   ├── microtasks/
│   │   │   └── page.tsx
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── select.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── badge.tsx
│   │   │   └── toast.tsx
│   │   ├── Navbar.tsx
│   │   ├── ReportForm.tsx
│   │   ├── PriorityBadge.tsx
│   │   ├── PriorityHeatmap.tsx
│   │   ├── MicroTaskList.tsx
│   │   └── Providers.tsx
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── priority-scoring.ts
│   │   └── utils.ts
│   ├── hooks/
│   │   └── use-toast.ts
│   └── types/
│       └── index.ts
├── public/
│   └── favicon.ico
├── package.json
├── package-lock.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.js
├── .env.example
├── .gitignore
└── README.md