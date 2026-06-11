# FAT UPMin – Faculty Accomplishment Tracker

FAT UPMin (Faculty Accomplishment Tracker) is a full-stack web application designed to streamline the submission, management, review, and approval of faculty accomplishment reports. The system centralizes faculty records, supporting documents, and evaluation workflows into a single platform.

## Features

- Authentication and authorization using Supabase Auth
- Faculty accomplishment submission and management
- Role-based access control (Faculty, Reviewer, Admin)
- Dynamic form handling and validation
- File upload and supporting document management
- Approval and review workflow
- Real-time data synchronization
- Export reports to Excel (`.xlsx`)
- Responsive and accessible UI

## Tech Stack

### Frontend
- React
- TypeScript
- React Router
- TanStack Query
- React Hook Form
- Zod
- Zustand
- shadcn/ui
- Tailwind CSS

### Backend & Database
- Supabase
- PostgreSQL
- Supabase Auth
- Row-Level Security (RLS)

## Project Structure

```plaintext
src/
├── api/            # API and Supabase queries
├── components/     # Reusable UI components
├── hooks/          # Custom React hooks
├── pages/          # Route pages
├── routers/        # Application routing
├── schemas/        # Zod validation schemas
├── stores/         # Zustand state management
├── types/          # Shared TypeScript types
├── utils/          # Utility functions
└── lib/            # Shared configurations
```

## Installation

### Clone the repository

```bash
git clone <repository-url>
cd cmsc127-project
```

### Install dependencies

```bash
cd frontend
npm install
```

### Configure environment variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Run development server

```bash
npm run dev
```

## Database

Database schema and migrations are managed inside:

```plaintext
supabase/migrations
```

Apply migrations:

```bash
supabase db push
```

## Authentication Flow

- User signs up using Supabase Auth
- Application creates a corresponding record in `faculties`
- Session is managed globally
- Protected routes enforce access control

## Scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run typecheck
```

## Future Improvements

- Notifications and activity logs
- Dashboard analytics
- PDF export support
- Email-based approvals
- Advanced filtering and reporting

## License

This project is intended for academic and institutional use.
