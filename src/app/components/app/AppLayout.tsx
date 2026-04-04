import { Outlet, Link, useLocation, useNavigate, Navigate } from "react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Calendar, Volume2, Music, Settings, BarChart3,
  Building2, LogOut, ChevronLeft, ChevronRight, User, Zap, Crown, Menu, X
} from "lucide-react";
import { hasPlanAccess, useAuth } from "../AuthContext";
import type { PlanTier } from "../../types/domain";
import { IslamicPattern } from "../IslamicPattern";
import { Toaster } from "sonner";

interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
  minPlan?: PlanTier;
}

const navItems: NavItem[] = [
  { path: "/app", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
  { path: "/app/schedule", label: "Prayer Schedule", icon: <Calendar size={20} /> },
  { path: "/app/audio", label: "Audio Controls", icon: <Volume2 size={20} /> },
  { path: "/app/adhan", label: "Adhan Library", icon: <Music size={20} /> },
  { path: "/app/analytics", label: "Analytics", icon: <BarChart3 size={20} />, minPlan: "professional" },
  { path: "/app/settings", label: "Settings", icon: <Settings size={20} /> },
  { path: "/app/admin", label: "Admin Panel", icon: <Building2 size={20} />, minPlan: "enterprise" },
];

const planIcons: Record<PlanTier, ReactNode> = {
  personal: <Zap size={14} />,
  professional: <Crown size={14} />,
  enterprise: <Building2 size={14} />,
};

export function AppLayout() {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  const isActive = (path: string) =>
    path === "/app" ? location.pathname === "/app" : location.pathname.startsWith(path);

  const hasAccess = (item: NavItem) => hasPlanAccess(user.plan, item.minPlan);

  const isGold = user.plan === "professional";

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#0a1a1f] flex">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-screen z-40 transition-all duration-300 bg-[#081418] border-r border-[rgba(16,185,129,0.1)] ${
          collapsed ? "w-[72px]" : "w-[260px]"
        }`}
      >
        <IslamicPattern />

        {/* Logo */}
        <div className="relative flex items-center gap-2.5 px-5 h-16 border-b border-[rgba(16,185,129,0.08)] shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#0d7a56] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0">
              <span className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px" }}>A</span>
            </div>
            {!collapsed && (
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] tracking-wide">
                Adhan<span className="text-[#10b981]">Sync</span>
              </span>
            )}
          </Link>
        </div>

        {/* Nav Items */}
        <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const accessible = hasAccess(item);
            return (
              <Link
                key={item.path}
                to={accessible ? item.path : "#"}
                onClick={(e) => {
                  if (!accessible) e.preventDefault();
                }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative ${
                  isActive(item.path)
                    ? "bg-[rgba(16,185,129,0.12)] text-[#10b981]"
                    : accessible
                      ? "text-[#8ba4a8] hover:text-[#e8ece9] hover:bg-[rgba(16,38,44,0.5)]"
                      : "text-[#3a5558] cursor-not-allowed opacity-50"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="shrink-0">{item.icon}</span>
                {!collapsed && (
                  <>
                    <span className="text-[0.85rem]">{item.label}</span>
                    {!accessible && (
                      <span className="ml-auto text-[0.6rem] px-1.5 py-0.5 rounded-full bg-[rgba(201,168,76,0.15)] text-[#c9a84c] border border-[rgba(201,168,76,0.2)]">
                        {item.minPlan === "enterprise" ? "ENT" : "PRO"}
                      </span>
                    )}
                  </>
                )}
                {isActive(item.path) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-[#10b981]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="relative border-t border-[rgba(16,185,129,0.08)] px-3 py-3 shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-3 px-3 py-2 mb-2">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#10b981] to-[#0d7a56] flex items-center justify-center shrink-0">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#e8ece9] text-[0.82rem] truncate">{user.name}</p>
                <div className="flex items-center gap-1">
                  <span className={isGold ? "text-[#c9a84c]" : "text-[#10b981]"}>{planIcons[user.plan]}</span>
                  <span className={`text-[0.68rem] tracking-wider uppercase ${isGold ? "text-[#c9a84c]" : "text-[#10b981]"}`}>
                    {user.planLabel}
                  </span>
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => { void handleLogout(); }}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[#8ba4a8] hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.06)] transition-all"
            title="Sign Out"
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-[0.82rem]">Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-20 -right-3 w-6 h-6 rounded-full bg-[#081418] border border-[rgba(16,185,129,0.15)] flex items-center justify-center text-[#8ba4a8] hover:text-[#10b981] z-50 transition-colors"
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-[rgba(8,20,24,0.95)] backdrop-blur-xl border-b border-[rgba(16,185,129,0.1)] flex items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#10b981] to-[#0d7a56] flex items-center justify-center">
            <span className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "12px" }}>A</span>
          </div>
          <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] text-[0.9rem]">
            Adhan<span className="text-[#10b981]">Sync</span>
          </span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-[#8ba4a8] hover:text-[#e8ece9]"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#081418] border-r border-[rgba(16,185,129,0.1)] flex flex-col">
            <div className="h-14 flex items-center px-5 border-b border-[rgba(16,185,129,0.08)]">
              <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9]">
                Adhan<span className="text-[#10b981]">Sync</span>
              </span>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItems.map((item) => {
                const accessible = hasAccess(item);
                return (
                  <Link
                    key={item.path}
                    to={accessible ? item.path : "#"}
                    onClick={(e) => {
                      if (!accessible) e.preventDefault();
                      else setMobileOpen(false);
                    }}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive(item.path)
                        ? "bg-[rgba(16,185,129,0.12)] text-[#10b981]"
                        : accessible
                          ? "text-[#8ba4a8]"
                          : "text-[#3a5558] opacity-50"
                    }`}
                  >
                    {item.icon}
                    <span className="text-[0.85rem]">{item.label}</span>
                    {!accessible && (
                      <span className="ml-auto text-[0.6rem] px-1.5 py-0.5 rounded-full bg-[rgba(201,168,76,0.15)] text-[#c9a84c]">
                        {item.minPlan === "enterprise" ? "ENT" : "PRO"}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-[rgba(16,185,129,0.08)] px-3 py-3">
              <div className="flex items-center gap-3 px-3 py-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#10b981] to-[#0d7a56] flex items-center justify-center">
                  <User size={14} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#e8ece9] text-[0.82rem] truncate">{user.name}</p>
                  <span className={`text-[0.68rem] ${isGold ? "text-[#c9a84c]" : "text-[#10b981]"}`}>{user.planLabel}</span>
                </div>
              </div>
              <button
                onClick={() => { void handleLogout(); }}
                className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-[#8ba4a8] hover:text-[#f87171] transition-all"
              >
                <LogOut size={18} />
                <span className="text-[0.82rem]">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className={`flex-1 transition-all duration-300 ${collapsed ? "lg:ml-[72px]" : "lg:ml-[260px]"} mt-14 lg:mt-0`}>
        <div className="min-h-screen">
          <Outlet />
        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "rgba(16, 38, 44, 0.95)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            color: "#e8ece9",
            backdropFilter: "blur(12px)",
          },
        }}
      />
    </div>
  );
}
