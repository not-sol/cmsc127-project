# Faculty Accomplishment Tracker - Project State Summary

## Completed Features
- **User Management System (Admin Only):**
  - Department-centric view: Users are grouped by department in an expandable card-based layout.
  - Role Management: Admins can promote faculty to `department_chair` or demote chairs back to `faculty`.
  - Delete Users: Admins can remove users from the system.
  - Search & Filter: Search by name/email within the grouped view.
- **One Chair Per Department Rule:**
  - Enforced via backend partial unique index (`one_chair_per_dept` on `users(department_id)` where `role = 'department_chair'`).
  - Frontend validation blocks promotion if a chair already exists in the selected department.
- **Authentication & Authorization:**
  - Supabase Auth integration with custom `users` table.
  - Role-based protected routes and sidebar navigation.
  - Verified user profile ensuring (requires email confirmation).

## Architecture Decisions
- **Frontend:** React (TypeScript) with Vite, Tailwind CSS, Lucide icons, and shadcn/ui components.
- **State Management:** Zustand for auth state; TanStack Query (React Query) for server state/mutations.
- **Backend:** Supabase (PostgreSQL, Auth, RLS).
- **Security:** Row Level Security (RLS) policies enforce that only admins can read/update/delete from the `users` table globally, while users can manage their own profiles.

## Database / Schema Assumptions
- `public.users`: Linked to `auth.users` via `id`. Contains `role` ('faculty', 'department_chair', 'admin') and `department_id`.
- `public.departments`: Contains `department_id` and `department_name`.
- `public.is_admin()` and `public.is_department_chair()` helper functions in SQL for RLS policies.

## API Structure
- `api/auth.ts`: Authentication flows (login, register, logout, password reset).
- `api/admin.ts`: Administrative tasks (fetch all users with departments, fetch departments, update roles, delete users).
- `api/profile.ts`: User profile management (`ensureUserProfile`).

## Role Permissions
- **Admin:** Full access to User Management, can see all reports, can manage system configuration.
- **Department Chair:** Can review reports within their own department (to be fully implemented/refined).
- **Faculty:** Can create and manage their own accomplishment reports and entries.

## Pending Tasks / Next Steps
- [ ] Implement/Refine Department Chair's dashboard to review pending reports from their department.
- [ ] Add more granular RLS for accomplishment reports based on department links.
- [ ] Implement department-specific data exports.
- [ ] Add audit logs for administrative actions (role changes, deletions).
- [ ] Complete the integration of form types and validation schemas for all accomplishment forms (A through K).

## Known Issues
- None at the moment; system enforces one-chair rule and role-based access correctly.
