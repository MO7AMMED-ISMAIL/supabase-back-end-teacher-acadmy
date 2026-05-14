# API Structure Documentation

This document outlines the API endpoints for the Teacher Dashboard project. This structure can be used as a reference for recreating the API using Node.js, TypeScript, and Supabase.

## Base URL
`/api` (configured in `src/app.js` and `src/routes/index.js`)

---

## 1. Authentication (`/auth`)

| Method | Endpoint | Auth | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| POST | `/dashboard/login` | Public | Admin/Teacher login for dashboard | `{ email, password }` |
| POST | `/mobile/login` | Public | Student login for mobile app | `{ email, password }` |
| POST | `/create-admin` | Public | One-time admin creation (if none exists) | `{ name, email, password }` |
| POST | `/register` | Admin | Register new user (admin/teacher/student) | `{ name, email, password, role? }` |
| GET | `/me` | Any Auth | Get current logged-in user profile | None |
| POST | `/logout` | Any Auth | Logout user | None |

---

## 2. Teachers (`/teachers`)
*All routes require Admin role.*

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| GET | `/` | List all teachers | None |
| GET | `/:id` | Get teacher by ID | None |
| POST | `/` | Create new teacher | `{ name, email, password, subject, phone? }` |
| PUT | `/:id` | Update teacher | `{ name?, email?, password?, subject?, phone?, isActive? }` |
| DELETE | `/:id` | Delete teacher | None |

---

## 3. Subjects (`/subjects`)

| Method | Endpoint | Auth | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/` | Admin/Teacher | List all subjects | None |
| GET | `/:id` | Admin/Teacher | Get subject by ID | None |
| POST | `/` | Admin | Create new subject | `{ name, description? }` |
| PUT | `/:id` | Admin | Update subject | `{ name?, description?, isActive? }` |
| DELETE | `/:id` | Admin | Delete subject | None |

---

## 4. Teacher-Subject Assignments (`/teacher-subjects`)
*Assigns a specific teacher to a specific subject.*

| Method | Endpoint | Auth | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/` | Admin/Teacher | List all assignments | None |
| GET | `/:id` | Admin/Teacher | Get assignment by ID | None |
| POST | `/` | Admin | Create assignment | `{ teacher (ID), subject (ID) }` |
| PUT | `/:id` | Admin | Update assignment | `{ isActive? }` |
| DELETE | `/:id` | Admin | Delete assignment | None |

---

## 5. Enrollments (`/enrollments`)
*Enrolls a student into a Teacher-Subject assignment.*

| Method | Endpoint | Auth | Description | Request Body |
| :--- | :--- | :--- | :--- | :--- |
| GET | `/` | Admin/Teacher | List all enrollments | None |
| POST | `/` | Admin/Teacher | Create enrollment | `{ student (ID), teacherSubject (ID) }` |
| DELETE | `/:id` | Admin/Teacher | Delete enrollment | None |

---

## 6. Students (`/students`)
*All routes require Teacher role.*

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| GET | `/` | List all students | None |
| GET | `/:id` | Get student by ID | None |
| POST | `/` | Create new student | `{ fullName, address?, phone?, parentPhone?, notes? }` |
| PUT | `/:id` | Update student | `{ fullName?, address?, phone?, parentPhone?, notes?, isActive? }` |
| DELETE | `/:id` | Delete student | None |

---

## 7. Schedules (`/schedules`)
*All routes require Teacher role.*

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| GET | `/` | List all schedules | None |
| GET | `/:id` | Get schedule by ID | None |
| POST | `/` | Create new schedule | `{ teacherSubject (ID), dayOfWeek (0-6), startTime (HH:mm), endTime (HH:mm) }` |
| PUT | `/:id` | Update schedule | `{ teacherSubject?, dayOfWeek?, startTime?, endTime?, isActive? }` |
| DELETE | `/:id` | Delete schedule | None |

---

## 8. Attendance (`/attendance`)
*All routes require Teacher role.*

| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| GET | `/summary` | Get attendance summary stats | None |
| GET | `/` | List attendance records | None |
| GET | `/:id` | Get attendance record by ID | None |
| POST | `/` | Submit attendance | `{ teacherSubject (ID), date (ISO), records: [{ student (ID), status ('present'\|'absent'\|'late') }] }` |

---

## 9. Dashboards

| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| GET | `/dashboard/teacher` | Teacher | Get teacher-specific dashboard data |
| GET | `/admin/dashboard` | Admin | Get admin-specific dashboard data |

---

## Technical Notes for TypeScript & Supabase

1.  **Auth:** Use Supabase Auth for the Authentication endpoints. You can map `admin`, `teacher`, and `student` roles using Supabase Metadata or a separate `profiles` table.
2.  **Models:** Convert MongoIDs to UUIDs (standard in Supabase/PostgreSQL).
3.  **Relationships:**
    *   `TeacherSubject` is a junction table between `Teachers` and `Subjects`.
    *   `Enrollment` is a junction table between `Students` and `TeacherSubject`.
4.  **Validations:** Since you are using TypeScript, use `zod` or `yup` for schema validation instead of `express-validator`.
