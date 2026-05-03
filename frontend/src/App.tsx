import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import ReportsPage from "./pages/ReportsPage";
import NewEntryPage from "./pages/NewentryPage";
import TestForm from "@/features/forms/form-k/form-k";
import FormKOtherPage from "@/pages/forms/FormKPage";
import FormIPage from "@/pages/forms/FormIPage";
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
        <Route path="/report" element={<ReportsPage />} />
        <Route path="/entry" element={<NewEntryPage />} />
        <Route path="/test-form" element={<TestForm />} />
        <Route path="/form-k-other" element={<FormKOtherPage />} />
        <Route path="/form-i" element={<FormIPage />} />
        {/* <Route path="/form-a" element={} /> */}
        {/* <Route path="/form-b" element={} /> */}
        {/* <Route path="/form-c" element={} /> */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
