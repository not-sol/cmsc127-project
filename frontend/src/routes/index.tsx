import { createBrowserRouter, Navigate } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import ProfilePage from "@/pages/ProfilePage";
import ReportsPage from "@/pages/ReportsPage";
import NewEntryPage from "@/pages/NewentryPage";
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
import ProtectedRoute from "@/components/protected-route";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/profile",
        element: <ProfilePage />,
      },
      {
        path: "/reports",
        element: <ReportsPage />,
      },
      {
        path: "/reports/new",
        element: <NewEntryPage />,
      },
      {
        path: "/test-form",
        element: <TestForm />,
      },
      {
        path: "/form-k",
        element: <FormKOtherPage />,
      },
      {
        path: "/form-j",
        element: <FormJAuthorshipPage />,
      },
      {
        path: "/form-i",
        element: <FormIPartnershipPage />,
      },
      {
        path: "/form-g",
        element: <FormGPage />,
      },
      {
        path: "/form-h",
        element: <FormHPage />,
      },
      {
        path: "/form-e",
        element: <FormEPage />,
      },
      {
        path: "/form-f",
        element: <FormFPage />,
      },
      {
        path: "/form-a",
        element: <FormAPublicationsPage />,
      },
      {
        path: "/form-b",
        element: <FormBGrantsAndFellowshipsPage />,
      },
      {
        path: "/form-c",
        element: <FormCOralOrPosterPage />,
      },
      {
        path: "/form-d",
        element: <FormDPage />,
      },
    ],
  },
  {
    path: "/",
    element: <Navigate to="/reports" replace />,
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
