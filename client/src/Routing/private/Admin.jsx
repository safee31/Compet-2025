import { Suspense, lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SpinnerMd } from "../../components/Spinner";
import { VITE_SMP_ACCESS } from "../../constants";

const Home = lazy(() => import("../../pages/Private/Home"));
const Surveys = lazy(() => import("../../pages/Private/Survey/SurveysPage"));
const Companies = lazy(() => import("../../pages/Private/Companies/Page"));
const Managers = lazy(() => import("../../pages/Private/Managers/Page"));
const Employees = lazy(() => import("../../pages/Private/Employees/Page"));
const BPMeetings = lazy(() => import("../../pages/Private/Meetings/Page"));
const Policies = lazy(() => import("../../pages/Private/Policies/Page"));
const NewsLetters = lazy(() => import("../../pages/Private/NewsLetters/Page"));
const Books = lazy(() => import("../../pages/Private/Books/Page"));
const Page404 = lazy(() => import("../../pages/Private/404"));
const Voting = lazy(() => import("../../pages/Private/Voting/Page"));
const Settings = lazy(() => import("../../pages/Private/Settings/Page"));
const OnboardingQA = lazy(() =>
  import("../../pages/Private/Onboarding-QA/Page")
);
const Departments = lazy(() => import("../../pages/Private/Department/Page"));
const ViolationCodes = lazy(() => import("../../pages/Private/SSMP/Page"));
const SMPTasks = lazy(() => import("../../pages/Private/SMPTasks/Page"));

const AdminRoutes = ({ role }) => {
  return (
    <Suspense fallback={<SpinnerMd />}>
      <Routes>
        <Route path="/admin/home" element={<Home />} />
        <Route path="/admin/surveys" element={<Surveys />} />
        <Route path="/admin/companies" element={<Companies />} />
        <Route path="/admin/departments" element={<Departments />} />
        <Route path="/admin/managers" element={<Managers />} />
        <Route path="/admin/employees" element={<Employees />} />
        <Route path="/admin/meetings" element={<BPMeetings />} />
        <Route path="/admin/policies" element={<Policies />} />
        <Route path="/admin/newsletter" element={<NewsLetters />} />
        <Route path="/admin/books" element={<Books />} />
        <Route path="/admin/voting" element={<Voting />} />
        <Route
          path="/admin/violation-codes"
          element={VITE_SMP_ACCESS ? <ViolationCodes /> : <Page404 />}
        />
        <Route
          path="/admin/smp-tasks"
          element={VITE_SMP_ACCESS ? <SMPTasks /> : <Page404 />}
        />
        <Route path="/admin/onboarding-qa" element={<OnboardingQA />} />
        <Route path="/admin/settings" element={<Settings />} />

        <Route
          path="/"
          element={<Navigate to={"/admin/home"} replace={true} />}
        />
        <Route
          path="/*"
          element={<Navigate to={"/admin/home"} replace={true} />}
        />
        <Route path="/admin/*" element={<Page404 />} />
        <Route
          path="/admin/"
          element={<Navigate to={"/admin/home"} replace={true} />}
        />
      </Routes>
    </Suspense>
  );
};

export default AdminRoutes;
