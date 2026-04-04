import { lazy } from "react";
import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import {
  RequireAuth,
  RequireEnterprisePlan,
  RequireProfessionalPlan,
} from "./components/RouteGuards";

const LandingPage = lazy(() =>
  import("./components/LandingPage").then((module) => ({ default: module.LandingPage })),
);
const PricingPage = lazy(() =>
  import("./components/PricingPage").then((module) => ({ default: module.PricingPage })),
);
const AccountPage = lazy(() =>
  import("./components/AccountPage").then((module) => ({ default: module.AccountPage })),
);
const LegalPage = lazy(() =>
  import("./components/LegalPage").then((module) => ({ default: module.LegalPage })),
);
const LoginPage = lazy(() =>
  import("./components/LoginPage").then((module) => ({ default: module.LoginPage })),
);

const AppLayout = lazy(() =>
  import("./components/app/AppLayout").then((module) => ({ default: module.AppLayout })),
);
const AppDashboard = lazy(() =>
  import("./components/app/AppDashboard").then((module) => ({ default: module.AppDashboard })),
);
const AppSchedule = lazy(() =>
  import("./components/app/AppSchedule").then((module) => ({ default: module.AppSchedule })),
);
const AppAudio = lazy(() =>
  import("./components/app/AppAudio").then((module) => ({ default: module.AppAudio })),
);
const AppAdhan = lazy(() =>
  import("./components/app/AppAdhan").then((module) => ({ default: module.AppAdhan })),
);
const AppAnalytics = lazy(() =>
  import("./components/app/AppAnalytics").then((module) => ({ default: module.AppAnalytics })),
);
const AppSettings = lazy(() =>
  import("./components/app/AppSettings").then((module) => ({ default: module.AppSettings })),
);
const AppAdmin = lazy(() =>
  import("./components/app/AppAdmin").then((module) => ({ default: module.AppAdmin })),
);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: LandingPage },
      { path: "pricing", Component: PricingPage },
      { path: "account", Component: AccountPage },
      { path: "legal", Component: LegalPage },
      { path: "login", Component: LoginPage },
    ],
  },
  {
    path: "/app",
    Component: RequireAuth,
    children: [
      {
        Component: AppLayout,
        children: [
          { index: true, Component: AppDashboard },
          { path: "schedule", Component: AppSchedule },
          { path: "audio", Component: AppAudio },
          { path: "adhan", Component: AppAdhan },
          { path: "settings", Component: AppSettings },
          {
            Component: RequireProfessionalPlan,
            children: [{ path: "analytics", Component: AppAnalytics }],
          },
          {
            Component: RequireEnterprisePlan,
            children: [{ path: "admin", Component: AppAdmin }],
          },
        ],
      },
    ],
  },
]);
