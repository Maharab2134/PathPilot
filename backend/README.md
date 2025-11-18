# PathPilot Backend

Smart Career Quiz & Recommendation System Backend API built with Node.js, Express, TypeScript, and MongoDB.

## Features

- 🔐 JWT Authentication with refresh tokens
- 📊 Quiz system with random question selection
- 🎯 Career recommendations based on quiz scores
- 👥 User management and profiles
- 📈 Leaderboard system
- 🛠️ Admin panel for content management
- 📱 RESTful API design

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (Access + Refresh tokens)
- **File Upload**: Multer for avatar uploads
- **Validation**: Express Validator
- **Testing**: Jest + Supertest
- **Security**: Helmet, CORS, Rate Limiting

## Quick Start

### Prerequisites

- Node.js 16+ 
- MongoDB 4.4+
- npm or yarn

### Installation

1. **Clone and setup**
```bash
git clone <repository-url>
cd PathPilot/backend
npm install
```

### Seeding the database

This repository provides a TypeScript seeder at `scripts/seed.ts`. Node can't run TypeScript files directly, so there are three recommended ways to run the seeder:

- Use the project's npm script (recommended after installing devDependencies):

```bash
cd /home/dev/Documents/Dev_Projects/Pathpilot/backend
npm install
npm run seed
```

- Run with `npx` without installing devDependencies globally:

```bash
cd /home/dev/Documents/Dev_Projects/Pathpilot/backend
npx ts-node scripts/seed.ts
```

- Run the lightweight JS wrapper included for convenience (works if `ts-node` is available):

```bash
cd /home/dev/Documents/Dev_Projects/Pathpilot/backend
node scripts/seed.js
```

If you see an error about `ts-node` missing when using the wrapper, run `npm install` to install devDependencies or run via the `npx` command above.

The seeder will create an admin user (`admin@gmail.com` / `admin123`) and populate categories, questions, and career info.

---

If you'd like, I can replace the original `README.md` with this updated copy (or directly patch the existing file). Which do you prefer?