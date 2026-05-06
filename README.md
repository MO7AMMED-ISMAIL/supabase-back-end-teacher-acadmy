# Backend API Structure

This is a scalable and structured backend API built with Express, TypeScript, and Supabase.

## Features
- **Clean Architecture:** Separated into Controllers, Services, Models, and Routes.
- **Middleware:**
  - `authMiddleware`: JWT-based authentication.
  - `errorMiddleware`: Global error handling.
  - `validatorMiddleware`: Request validation using `express-validator`.
- **Database:** Supabase integration with a Repository/Model pattern.
- **Validation:** Type-safe request validation.

## Folder Structure
```
├── migrations/          # Database migrations
├── src/
│   ├── config/         # Configuration files (DB, etc.)
│   ├── controllers/    # Request handlers
│   ├── middleware/     # Express middlewares
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── types/          # TypeScript interfaces
│   ├── utils/          # Utility functions
│   ├── validator/      # Request validators
│   └── app.ts          # Entry point
├── .env                # Environment variables
├── package.json        # Dependencies and scripts
└── tsconfig.json       # TypeScript configuration
```

## Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the root and add:
   ```env
   PORT=3000
   SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
   JWT_SECRET=your_jwt_secret
   ```

3. **Run in Development:**
   ```bash
   npm run dev
   ```

4. **Build for Production:**
   ```bash
   npm run build
   ```

## API Endpoints
- `GET /api/v1/users` - Get all users (Protected)
- `GET /api/v1/users/:id` - Get user by ID (Protected)
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/:id` - Update user (Protected)
- `DELETE /api/v1/users/:id` - Delete user (Protected)
