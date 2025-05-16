import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import { Spinner } from "../components/Spinner";

// Lazy-loaded pages
const Login = lazy(() => import("../pages/auth/Signin2"));
const Signup = lazy(() => import("../pages/auth/Signup"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(
  () => import("../pages/auth/ForgotPassword/ResetPassword")
);
const Page404 = lazy(() => import("../pages/404"));
const PublicRoutes = ({ validUser }) => {
  return (
    <Suspense fallback={<Spinner />}>
      <PublicLayout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Navigate to={"/login"} replace={true} />} />
          {/* <Route path="/" element={<Dashboard />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/auth/resetPassword" element={<ResetPassword />} />
          <Route
            path="/*"
            element={
              !validUser ? (
                <Navigate to={"/login"} replace={true} />
              ) : (
                <Page404 />
              )
            }
          />
        </Routes>
      </PublicLayout>
    </Suspense>
  );
};

export default PublicRoutes;
