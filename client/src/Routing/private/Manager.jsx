import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpinnerMd } from "../../components/Spinner";
const PersonalInfo = lazy(() => import("../../pages/onboarding/PersonalInfo"));
const EmployeeInfo = lazy(() => import("../../pages/onboarding/EmployeeInfo"));
const EmployeeForms = lazy(() =>
  import("../../pages/onboarding/EmployeeForms")
);
const ManagerAnswers = lazy(() => import("../../pages/onboarding/Answers"));

import PrivateLayout from "../../components/PrivateLayout";
import OnboardingLayout from "../../components/OnboardingLaypout";
import { VITE_SMP_ACCESS } from "../../constants";
const Home = lazy(() => import("../../pages/Private/Home/ManagerHome"));
const BPMeetings = lazy(() => import("../../pages/Private/Meetings/Page"));
const Policies = lazy(() => import("../../pages/Private/Policies/Page"));
const NewsLetters = lazy(() => import("../../pages/Private/NewsLetters/Page"));
const Profile = lazy(() => import("../../pages/Private/Profile/Page"));
const Surveys = lazy(() => import("../../pages/Private/Survey/SurveysPage"));
const Employees = lazy(() => import("../../pages/Private/Employees/Page"));
const Page404 = lazy(() => import("../../pages/Private/404"));
const Voting = lazy(() => import("../../pages/Private/Voting/Page"));
const ViolationCodes = lazy(() => import("../../pages/Private/SSMP/Page"));
const SMPTasks = lazy(() => import("../../pages/Private/SMPTasks/Page"));
const ManagerBooks = lazy(() =>
  import("../../pages/Private/Employees/Books/Page")
);

const ManagerRoutes = ({ role, account = null }) => {
  const personalInfo = account?.details?.onboarding?.personalInfo;
  const workInfo = account?.details?.onboarding?.workInfo;
  const managerForms = account?.details?.onboarding?.forms;
  const userAnswers = account?.details?.onboarding?.answers;
  const managerAnswers = Array.isArray(userAnswers) && userAnswers?.length > 0;

  const isOnboarded = account?.isOnboarded;

  const isManager = role === 2;
  const isDepartmentAssigned = isManager && account?.details?.department;
  const hasAccessToSMPViolations = account?.details?.featureAccess
    ?.smp_violations?.canAccess
    ? true
    : false;

  const restrictedRoutes = ["employees", "meetings", "surveys", "voting"];
  const managerRestrictedRoutes = (path, Component) => {
    const routeName = path.replace(/^\/?manager\//, "").split("/")[0];
    return isManager &&
      !isDepartmentAssigned &&
      restrictedRoutes.includes(routeName) ? (
      <Page404 />
    ) : (
      Component
    );
  };

  return (
    <Suspense fallback={<SpinnerMd />}>
      {!isOnboarded ? (
        <Routes>
          <Route
            path="/*"
            element={<Navigate to={getRedirectPath()} replace />}
          />
        </Routes>
      ) : (
        <PrivateLayout>
          <Routes>
            <Route path="/manager/home" element={<Home />} />
            <Route
              path="/manager/meetings"
              element={managerRestrictedRoutes(
                "/manager/meetings",
                <BPMeetings />
              )}
            />
            <Route
              path="/manager/surveys"
              element={managerRestrictedRoutes("/manager/surveys", <Surveys />)}
            />
            <Route
              path="/manager/employees"
              element={managerRestrictedRoutes(
                "/manager/employees",
                <Employees />
              )}
            />
            <Route
              path="/manager/voting"
              element={managerRestrictedRoutes("/manager/voting", <Voting />)}
            />
            <Route
              path="/manager/smp-tasks"
              element={VITE_SMP_ACCESS ? <SMPTasks /> : <Page404 />}
            />
            <Route
              path="/manager/violation-codes"
              element={
                VITE_SMP_ACCESS && hasAccessToSMPViolations ? (
                  <ViolationCodes />
                ) : (
                  <Page404 />
                )
              }
            />
            <Route path="/manager/policies" element={<Policies />} />
            <Route path="/manager/profile" element={<Profile />} />
            <Route path="/manager/newsletter" element={<NewsLetters />} />
            <Route path="/manager/books" element={<ManagerBooks />} />

            <Route
              path="/"
              element={<Navigate to={"/manager/home"} />}
              replace={true}
            />
            <Route
              path="/*"
              element={<Navigate to={"/manager/home"} />}
              replace={true}
            />
            <Route path="/manager/*" element={<Page404 />} />
            <Route
              path="/manager/"
              element={<Navigate to={"/manager/home"} replace={true} />}
            />
          </Routes>
        </PrivateLayout>
      )}

      <Routes>
        <Route
          path="/onboarding/*"
          element={
            <OnboardingLayout>
              <Routes>
                <Route path="/personal-info" element={<PersonalInfo />} />
                <Route path="/work-info" element={<EmployeeInfo />} />
                <Route path="/forms" element={<EmployeeForms />} />
                <Route path="/answers" element={<ManagerAnswers />} />
                <Route
                  path="*"
                  element={<Navigate to={getRedirectPath()} replace />}
                />
              </Routes>
            </OnboardingLayout>
          }
        />
      </Routes>
    </Suspense>
  );

  function getRedirectPath() {
    // Return the first missing step of the onboarding process
    if (!personalInfo) return "/onboarding/personal-info";
    if (!workInfo) return "/onboarding/work-info";
    if (!managerForms) return "/onboarding/forms";
    if (!managerAnswers) return "/onboarding/answers";
    return "/manager/home";
  }
};

export default ManagerRoutes;
