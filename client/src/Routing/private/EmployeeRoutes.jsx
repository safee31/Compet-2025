import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpinnerMd } from "../../components/Spinner";
import PrivateLayout from "../../components/PrivateLayout";
import OnboardingLayout from "../../components/OnboardingLaypout";
import { VITE_SMP_ACCESS } from "../../constants";
const Home = lazy(() => import("../../pages/Private/Home/EmployeeHome"));
const Page404 = lazy(() => import("../../pages/Private/404"));
const PersonalInfo = lazy(() => import("../../pages/onboarding/PersonalInfo"));
const EmployeeInfo = lazy(() => import("../../pages/onboarding/EmployeeInfo"));
const EmployeeForms = lazy(() =>
  import("../../pages/onboarding/EmployeeForms")
);
const EmployeeAnswers = lazy(() => import("../../pages/onboarding/Answers"));
const EmployeeBooks = lazy(() =>
  import("../../pages/Private/Employees/Books/Page")
);
const BPMeetings = lazy(() => import("../../pages/Private/Meetings/Page"));
const Policies = lazy(() => import("../../pages/Private/Policies/Page"));
const Profile = lazy(() => import("../../pages/Private/Profile/Page"));
const NewsLetters = lazy(() => import("../../pages/Private/NewsLetters/Page"));
const Voting = lazy(() => import("../../pages/Private/Employees/Voting/Page"));
const ViolationCodes = lazy(() => import("../../pages/Private/SSMP/Page"));
const SMPTasks = lazy(() => import("../../pages/Private/SMPTasks/Page"));

const EmployeeRoutes = ({ role, account = null }) => {
  const personalInfo = account?.details?.onboarding?.personalInfo;
  const workInfo = account?.details?.onboarding?.workInfo;
  const employeeForms = account?.details?.onboarding?.forms;
  const userAnswers = account?.details?.onboarding?.answers;
  const employeeAnswers = Array.isArray(userAnswers) && userAnswers?.length > 0;
  // Check if any onboarding step is incomplete
  const isOnboarded = account?.isOnboarded;
  const hasAccessToSMPViolations = account?.details?.featureAccess
    ?.smp_violations?.canAccess
    ? true
    : false;
  return (
    <Suspense fallback={<SpinnerMd />}>
      {/* If any onboarding step is incomplete, redirect to the first missing step */}
      {!isOnboarded ? (
        <Routes>
          <Route
            path="/*"
            element={<Navigate to={getRedirectPath()} replace />}
          />
        </Routes>
      ) : (
        // <Suspense fallback={<SpinnerMd />}>
        <PrivateLayout>
          <Routes>
            <Route path="/employee/home" element={<Home />} />
            <Route path="/employee/profile" element={<Profile />} />
            <Route path="/employee/meetings" element={<BPMeetings />} />
            <Route path="/employee/policies" element={<Policies />} />
            <Route path="/employee/newsletter" element={<NewsLetters />} />
            <Route path="/employee/books" element={<EmployeeBooks />} />
            <Route path="/employee/voting" element={<Voting />} />
            <Route
              path="/employee/smp-tasks"
              element={VITE_SMP_ACCESS ? <SMPTasks /> : <Page404 />}
            />
            <Route
              path="/employee/violation-codes"
              element={
                VITE_SMP_ACCESS && hasAccessToSMPViolations ? (
                  <ViolationCodes />
                ) : (
                  <Page404 />
                )
              }
            />

            <Route
              path="/"
              element={<Navigate to={"/employee/home"} />}
              replace={true}
            />
            <Route
              path="/*"
              element={<Navigate to={"/employee/home"} />}
              replace={true}
            />

            <Route path="/employee/*" element={<Page404 />} />
            <Route
              path="/employee/"
              element={<Navigate to={"/employee/home"} replace={true} />}
            />
          </Routes>
        </PrivateLayout>
        // </Suspense>
      )}

      {/* Onboarding routes (always available if the user hasn't completed onboarding) */}
      <Routes>
        <Route
          path="/onboarding/*"
          element={
            <OnboardingLayout>
              <Routes>
                <Route path="/personal-info" element={<PersonalInfo />} />
                <Route path="/work-info" element={<EmployeeInfo />} />
                <Route path="/forms" element={<EmployeeForms />} />
                <Route path="/answers" element={<EmployeeAnswers />} />
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
    if (!employeeForms) return "/onboarding/forms";
    if (!employeeAnswers) return "/onboarding/answers";
    return "/employee/home";
  }
};

export default EmployeeRoutes;
