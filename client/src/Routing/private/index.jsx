import PrivateLayout from "../../components/PrivateLayout";
import EmployeeRoutes from "./EmployeeRoutes";
import AdminRoutes from "./Admin";
import { Spinner } from "../../components/Spinner";
import ManagerRoutes from "./Manager";
import { lazy } from "react";
const Page404 = lazy(() => import("../../pages/404"));

const AllPrivateRoutes = ({ account }) => {
  const validUser = account?.isAuth;
  const validating = account?.loading;
  let userRole = Number(account?.details?.role?.type || 0);

  let validRole = [2, 3, 1].includes(userRole);
  if (validating) {
    return <Spinner />;
  }
  return (
    <>
      {validUser && validRole ? (
        <>
          {/* Private routes based on user role */}
          {userRole === 1 && (
            <PrivateLayout>
              <AdminRoutes role={userRole} />
            </PrivateLayout>
          )}
          {userRole === 2 && (
            <ManagerRoutes account={account} role={userRole} />
          )}
          {userRole === 3 && (
            <EmployeeRoutes account={account} role={userRole} />
          )}
        </>
      ) : (
        <Page404 />
      )}
    </>
  );
};

export default AllPrivateRoutes;
