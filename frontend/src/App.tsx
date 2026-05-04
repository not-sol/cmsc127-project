import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import NewEntryPage from "./pages/NewentryPage";
import TestForm from "@/features/forms/form-k/form-k";
import FormKOtherPage from "@/pages/forms/FormKPage";
import FormJAuthorshipPage from "@/pages/forms/FormJPage";
import FormIPartnershipPage from "@/pages/forms/FormIPage";
import FormGPage from "@/pages/forms/FormGPage";
import FormHPage from "@/pages/forms/FormHPage";
import FormEPage from "@/pages/forms/FormEPage";
import FormFPage from "@/pages/forms/FormFPage";
// import { useEffect } from 'react'
// import { useAuthStore } from '@/store/authStore'

export default function App() {
  // const init = useAuthStore((s) => s.init)
  //
  // useEffect(() => {
  //   init()
  // }, [init])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/reports/new" element={<NewEntryPage />} />
        <Route path="/test-form" element={<TestForm />} />
        <Route path="/form-k-other" element={<FormKOtherPage />} />
        <Route path="/form-j-authorship" element={<FormJAuthorshipPage />} />
        <Route path="/form-i-partnership" element={<FormIPartnershipPage />} />
        <Route path="/form-g" element={<FormGPage />} />
        <Route path="/form-h" element={<FormHPage />} />
        <Route path="/form-e" element={<FormEPage />} />
        <Route path="/form-f" element={<FormFPage />} />
        {/* <Route path="/form-a" element={} /> */}
        {/* <Route path="/form-b" element={} /> */}
        {/* <Route path="/form-c" element={} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

