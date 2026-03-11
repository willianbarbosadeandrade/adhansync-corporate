import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { LandingPage } from "./components/LandingPage";
import { PricingPage } from "./components/PricingPage";
import { AccountPage } from "./components/AccountPage";
import { LegalPage } from "./components/LegalPage";
import { LoginPage } from "./components/LoginPage";
import { AppLayout } from "./components/app/AppLayout";
import { AppDashboard } from "./components/app/AppDashboard";
import { AppSchedule } from "./components/app/AppSchedule";
import { AppAudio } from "./components/app/AppAudio";
import { AppAdhan } from "./components/app/AppAdhan";
import { AppAnalytics } from "./components/app/AppAnalytics";
import { AppSettings } from "./components/app/AppSettings";
import { AppAdmin } from "./components/app/AppAdmin";
import {
  RequireAuth,
  RequireEnterprisePlan,
  RequireProfessionalPlan,
} from "./components/RouteGuards";

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
