import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth, hasPlanAccess } from "./AuthContext";
import type { PlanTier } from "../types/domain";

function LoadingScreen({ label }: { label: string }) {
  return (
    <div className="min-h-screen bg-[#0a1a1f] text-[#8ba4a8] flex items-center justify-center">
      {label}
    </div>
  );
}

export function RequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <LoadingScreen label="Loading session..." />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

function RequirePlan({ minimumPlan }: { minimumPlan: PlanTier }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) return <LoadingScreen label="Loading access policy..." />;

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!hasPlanAccess(user.plan, minimumPlan)) {
    return <Navigate to="/pricing" replace />;
  }

  return <Outlet />;
}

export function RequireProfessionalPlan() {
  return <RequirePlan minimumPlan="professional" />;
}

export function RequireEnterprisePlan() {
  return <RequirePlan minimumPlan="enterprise" />;
}
