import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Suspense, useEffect } from "react";
import { Spinner } from "../components/Spinner";
// import PrivateRoute from "./PrivateRoute";
import PublicRoutes from "../Routing/Public";
import AllPrivateRoutes from "../Routing/private";
// import { useReadEmployeeQuery } from "../apis/Employee/auth";
import {
  authenticateEmployee,
  // resetAccountData,
  // setAccountData,
} from "../redux/Slices/Account";
// const Login = lazy(() => import("../Pages/auth/Signin2"));
// const Signup = lazy(() => import("../Pages/auth/Signup"));
// const ForgotPassword = lazy(() => import("../Pages/auth/ForgotPassword"));
// const Login = lazy(() => import("../pages/auth/Signin2"));
// const Signup = lazy(() => import("../pages/auth/Signup"));
// const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
// const ResetPassword = lazy(() =>
//   import("../pages/auth/ForgotPassword/ResetPassword")
// );
// const Page404 = lazy(() => import("../pages/404"));
function AppRoutes() {
  const dispatch = useDispatch();
  // const { isLoading, isFetching, data, error } = useReadEmployeeQuery(
  //   {},
  //   {
  //     refetchOnReconnect: true,
  //     refetchOnFocus: true,
  //     pollingInterval: 120000,
  //   }
  // );
  const account = useSelector((state) => state.account);
  const validating = account?.loading;
  const validUser = account?.isAuth;

  useEffect(() => {
    // if (!isLoading) {
    //   if (error?.status === 401) {
    //     dispatch(resetAccountData({}));

    //   } else {
    //     if (data) {
    //       dispatch(setAccountData(data));
    //     } else {
    //       dispatch(resetAccountData({}));
    //     }
    //   }
    // }
    dispatch(authenticateEmployee());
  }, [authenticateEmployee, dispatch]);

  if (validating) {
    return <Spinner size={32} />;
  }
  return (
    <Router>
      <Suspense fallback={<Spinner size={40} />}>
        <Routes>
          <Route
            path="/*"
            element={
              validUser ? (
                <AllPrivateRoutes account={account} />
              ) : (
                <PublicRoutes validUser={validUser} />
              )
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default AppRoutes;
