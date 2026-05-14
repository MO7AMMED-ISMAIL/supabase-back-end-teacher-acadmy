# Teacher Dashboard Backend API

This is a scalable and structured backend API built with Node.js, Express, TypeScript, and Supabase. It manages teachers, subjects, students, enrollments, schedules, and attendance.

## Features
- **Clean Architecture:** Separated into Controllers, Services, Models, and Routes.
- **Supabase Integration**: Uses Supabase Auth and PostgreSQL with Row Level Security (RLS).
- **Security**:
  - `authMiddleware`: Supabase-based authentication.
  - `requireRole`: Role-based access control (Admin, Teacher, Student).
  - `helmet`: Security headers.
  - Environment-specific **CORS** configuration.
- **Validation**: Strict route-level validation using `express-validator` (UUID support).
- **Environment Management**: distinct configurations for Development and Production.

## Folder Structure
```
├── supabase/
│   └── migrations/     # PostgreSQL schema and triggers
├── src/
│   ├── config/         # Supabase client and DB config
│   ├── controllers/    # API request handlers (inherit BaseController)
│   ├── middleware/     # Auth, Role, Error, and Validator middlewares
│   ├── models/         # Database models (inherit BaseModel)
│   ├── routes/         # Unified routing (v1)
│   ├── services/       # Business logic (inherit BaseService)
│   ├── types/          # Global TypeScript interfaces
│   ├── utils/          # Database helpers
│   ├── validations/    # express-validator rules
│   └── app.ts          # Express application entry point
├── Teacher-Dashboard.postman_collection.json # API Documentation
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
   NODE_ENV=development
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ALLOWED_ORIGINS=https://your-frontend-domain.com,http://localhost:5173
   ```

3. **Database Setup:**
   Apply the SQL migration found in `supabase/migrations/` to your Supabase project's SQL Editor.

## Running the Project

### Development Mode
Runs with `ts-node-dev` for auto-reloading. CORS allows all origins (`*`).
```bash
npm run dev
```

### Production Mode
Builds TypeScript to JavaScript and runs from the `dist/` folder. CORS strictly enforces `ALLOWED_ORIGINS`.
```bash
# Build and run
npm run prod

# Or separately
npm run build
npm run start
```

## API Documentation
Import `Teacher-Dashboard.postman_collection.json` into Postman to view all endpoints, request bodies, and automated test scripts.

## Key Changes & Breaking Changes
- **Auth**: Now uses Supabase Auth. Tokens are verified via Supabase.
- **IDs**: All models now use `UUID` instead of MongoDB `ObjectIDs`.
- **Attendance**: The `submitAttendance` endpoint now requires `teacherSubject` instead of `subject` and uses `student` IDs within the `records` array.
