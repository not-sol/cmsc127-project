import { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import NewEntryPage from "./pages/NewentryPage";
import TestForm from "@/features/forms/form-test/test-form";
import FormKOtherPage from "@/pages/forms/FormKPage";
import FormJAuthorshipPage from "@/pages/forms/FormJPage";
import FormIPartnershipPage from "@/pages/forms/FormIPage";
import FormGPage from "@/pages/forms/FormGPage";
import FormHPage from "@/pages/forms/FormHPage";
import FormEPage from "@/pages/forms/FormEPage";
import FormFPage from "@/pages/forms/FormFPage";
import FormAPublicationsPage from "@/pages/forms/FormAPage";
import FormBGrantsAndFellowshipsPage from "@/pages/forms/FormBPage";
import FormCOralOrPosterPage from "@/pages/forms/FormCPage";
import FormDPage from "@/pages/forms/FormDPage";
import { useAuthStore } from "@/store/auth-store";
import { supabase } from "@/lib/supabase/client";
import ProtectedRoute from "@/components/protected-route";

export default function App() {
  const { setUser, setSession, setLoading } = useAuthStore();

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setUser, setLoading]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/reports/new" element={<NewEntryPage report={undefined} onSaveDraft={() => {}} onSubmit={() => {}} onAddEntry={() => {}} onViewEntry={() => {}} onDeleteEntry={() => {}} />} />
          <Route path="/test-form" element={<TestForm />} />
          <Route path="/form-k" element={<FormKOtherPage />} />
          <Route path="/form-j" element={<FormJAuthorshipPage />} />
          <Route path="/form-i" element={<FormIPartnershipPage />} />
          <Route path="/form-g" element={<FormGPage />} />
          <Route path="/form-h" element={<FormHPage />} />
          <Route path="/form-e" element={<FormEPage />} />
          <Route path="/form-f" element={<FormFPage />} />
          <Route path="/form-a" element={<FormAPublicationsPage />} />
          <Route path="/form-b" element={<FormBGrantsAndFellowshipsPage />} />
          <Route path="/form-c" element={<FormCOralOrPosterPage />} />
          <Route path="/form-d" element={<FormDPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

