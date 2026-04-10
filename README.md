# Bloodline API

Backend REST API for the Bloodline family graph application.

## Tech Stack

- **Runtime**: Node.js (ESM)
- **Framework**: Express
- **Database**: PostgreSQL via Prisma ORM
- **Auth**: JWT (jsonwebtoken) + bcrypt
- **Validation**: Zod
- **Testing**: Vitest + Supertest

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Setup

```bash
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and JWT_SECRET
npx prisma migrate dev
npm run seed
npm run dev
```

## API Endpoints

### Auth
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/session` | Get current user (requires auth) |

### Families
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/families` | List user's families |
| GET | `/api/families/:familyId` | Get family detail with people |

### People
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/families/:familyId/people` | Add person to family |
| PATCH | `/api/families/:familyId/people/:personId` | Update person |

### Relationships
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/families/:familyId/marriages` | Add marriage |
| PATCH | `/api/families/:familyId/marriages/divorce` | Mark divorce |
| POST | `/api/families/:familyId/relationships/parents` | Add parent |
| POST | `/api/families/:familyId/relationships/step-parents` | Add step-parent |
| DELETE | `/api/families/:familyId/relationships/parents` | Remove parent |
| DELETE | `/api/families/:familyId/relationships/step-parents` | Remove step-parent |

## Scripts

```bash
npm run dev          # Start dev server with hot reload
npm test             # Run tests
npm run test:coverage # Run tests with coverage
npm run migrate      # Run DB migrations (dev)
npm run seed         # Seed the database
npm run studio       # Open Prisma Studio
```

## Environment Variables

See `.env.example` for all required environment variables.
