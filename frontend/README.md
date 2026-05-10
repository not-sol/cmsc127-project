# Faculty Accomplishment Tracker

A structured reporting tool designed to streamline the recording, organization, and documentation of faculty achievements. This system acts as a bridge between the existing ISIP system and the PBMS, eliminating the need for department chairs to manually re-encode faculty data by providing customizable, PBMS-compatible data exports.

## Key Features
* **Streamlined Submissions:** Faculty can easily input monthly accomplishments (teaching, research, extension) and upload supporting documents.
* **Approval Workflow:** Centralized dashboard for department chairs to review, validate, and approve reports.
* **PBMS Integration:** Export validated faculty data directly into PBMS-compatible CSV or Excel (XLS) formats.

## Frontend Tech Stack
* **Framework:** React
* **State Management:** Zustand
* **Data Fetching:** TanStack Query (React Query)
* **Routing:** React Router
* **Forms & Validation:** React Hook Form + Zod
* **UI Components:** shadcn/ui

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16 or higher), `npm`, and the [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started) installed.

### Local Supabase + Frontend setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cmsc127-project
   ```

2. **Start and reset local Supabase**
   ```bash
   supabase start
   supabase db reset
   ```

3. **Get local API URL and anon key**
   ```bash
   supabase status
   ```
   Copy the API URL and anon key from the command output.

4. **Configure frontend environment**
   ```bash
   cd frontend
   cp .env.example .env.local
   ```
   Update `.env.local` values from `supabase status` if they differ from your local output.

5. **Install dependencies and start the app**
   ```bash
   npm install
   npm run dev
   ```

6. **Open the app**

   Open your browser and navigate to:
   ```text
   http://localhost:5173
   ```
