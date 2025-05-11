# Fingerprint & Face Verification

A modern web application for secure, lightning-fast biometric verification using fingerprints and facial recognition. 
---

## Table of Contents

- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Project Structure](#project-structure)
- [Database Schema](#database-schema)
- [License](#license)

---


## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Framer Motion
- **Backend**: Next.js API routes, Supabase
- **ORM** : Prisma ORM
- **Database**: PostgreSQL (via Prisma)
- **Authentication**: NextAuth.js (Credential Provider)

---

## How It Works

1. **Capture**: Use your device camera or upload images to capture fingerprints and face photos.
2. **Review**: Preview and confirm the quality of captured images.
3. **Register**: Enter user details and submit biometric data for registration.
4. **Match & Verify**: Instantly search the database for matches and receive verification results.

---


## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- [pnpm](https://pnpm.io/) (or npm/yarn)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/fingerprint-face-verification.git
   cd fingerprint-face-verification
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your database and authentication credentials.

4. **Set up the database:**
   ```bash
   pnpm db:push
   ```

5. **Run the development server:**
   ```bash
   pnpm dev
   ```
   The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Supabase Setup

This project saves user information (including biometrics) in a Supabase table called `users`. You must create this table in your Supabase project before running the app.

**To create the table, run the following SQL in the [Supabase SQL Editor](https://app.supabase.com/project/_/sql):**

```sql
CREATE TABLE users (    
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT,
  last_name TEXT,
  address TEXT,
  additional_info TEXT,
  face_image TEXT,
  thumb_image TEXT,
  created_at TIMESTAMP DEFAULT timezone('utc'::text, now()),
  face_hash BIT(64),
  thumb_hash BIT(64),
  face_hash_bucket INT2,
  thumb_hash_bucket INT2
);
```

Be sure to set your Supabase credentials in the `.env` file as described above.

---

## Available Scripts

- `pnpm dev` — Start the development server
- `pnpm build` — Build the application for production
- `pnpm start` — Start the production server
- `pnpm lint` — Run ESLint
- `pnpm db:push` — Push Prisma schema to the database
- `pnpm db:migrate` — Run database migrations
- `pnpm db:studio` — Open Prisma Studio
- `pnpm test:generate` — Generate test data

---

## Project Structure

```
.
├── src/
│   ├── app/           # Next.js app directory (pages, API routes)
│   ├── components/    # Reusable React components
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Utility libraries
│   ├── types/         # TypeScript types
│   └── generated/     # Auto-generated code (e.g., Prisma client)
├── prisma/            # Prisma schema and migrations
├── public/            # Static assets
├── scripts/           # Utility scripts
├── package.json
└── README.md
```

---

## Database Schema

The core user model (see `prisma/schema.prisma`):

```prisma
model User {
  id        String   @id @default(cuid())
  name      String?
  email     String?  @unique
  password  String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

> **Note:** Biometric data (face and fingerprint images) are associated with user records and securely stored.

---


## License

This project is licensed under the MIT License.
