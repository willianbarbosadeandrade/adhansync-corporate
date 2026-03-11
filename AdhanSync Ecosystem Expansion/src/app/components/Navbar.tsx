import { Link, useLocation, useNavigate } from "react-router";
import { Menu, X, LogIn, LogOut, User, Crown, Zap, Building2, AppWindow } from "lucide-react";
import { useState } from "react";
import { useAuth } from "./AuthContext";

const planIcons = {
  personal: <Zap size={14} />,
  professional: <Crown size={14} />,
  enterprise: <Building2 size={14} />,
};

const planColors = {
  personal: { text: "text-[#10b981]", bg: "bg-[rgba(16,185,129,0.1)]", border: "border-[rgba(16,185,129,0.15)]" },
  professional: { text: "text-[#c9a84c]", bg: "bg-[rgba(201,168,76,0.1)]", border: "border-[rgba(201,168,76,0.2)]" },
  enterprise: { text: "text-[#10b981]", bg: "bg-[rgba(16,185,129,0.1)]", border: "border-[rgba(16,185,129,0.15)]" },
};

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const links = [
    { path: "/", label: "Home" },
    { path: "/pricing", label: "Pricing" },
    ...(isAuthenticated ? [{ path: "/account", label: "Account" }] : []),
    { path: "/legal", label: "Legal" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setMobileOpen(false);
  };

  const pc = user ? planColors[user.plan] : null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[rgba(10,26,31,0.85)] border-b border-[rgba(16,185,129,0.1)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#0d7a56] flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <span className="text-white" style={{ fontFamily: "'Playfair Display', serif", fontSize: "14px" }}>A</span>
            </div>
            <span style={{ fontFamily: "'Playfair Display', serif" }} className="text-[#e8ece9] tracking-wide">
              Adhan<span className="text-[#10b981]">Sync</span>
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? "text-[#10b981] bg-[rgba(16,185,129,0.1)]"
                    : "text-[#8ba4a8] hover:text-[#e8ece9] hover:bg-[rgba(16,38,44,0.5)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* Plan badge */}
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${pc!.bg} border ${pc!.border}`}>
                  <span className={pc!.text}>{planIcons[user.plan]}</span>
                  <span className={`text-[0.72rem] ${pc!.text} tracking-wider uppercase`}>{user.planLabel}</span>
                </div>

                {/* Open App button */}
                <Link
                  to="/app"
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  <AppWindow size={15} />
                  <span className="text-[0.82rem]">Open App</span>
                </Link>

                {/* User menu */}
                <Link
                  to="/account"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-[rgba(16,38,44,0.5)] transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#10b981] to-[#0d7a56] flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <span className="text-[#e8ece9] text-[0.82rem] max-w-[120px] truncate">{user.name.split(" ")[0]}</span>
                </Link>

                <button
                  onClick={() => { void handleLogout(); }}
                  className="p-2 rounded-lg text-[#8ba4a8] hover:text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-all"
                  title="Sign Out"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#8ba4a8] hover:text-[#e8ece9] hover:bg-[rgba(16,38,44,0.5)] transition-all"
                >
                  <LogIn size={16} />
                  <span className="text-[0.85rem]">Sign In</span>
                </Link>
                <Link
                  to="/pricing"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white transition-all duration-200 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[#8ba4a8] hover:text-[#e8ece9]"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[rgba(10,26,31,0.95)] backdrop-blur-xl border-b border-[rgba(16,185,129,0.1)] px-4 pb-4">
          {isAuthenticated && user && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-[rgba(16,38,44,0.4)] border border-[rgba(16,185,129,0.08)]">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#10b981] to-[#0d7a56] flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#e8ece9] text-[0.85rem] truncate">{user.name}</p>
                <div className="flex items-center gap-1.5">
                  <span className={`${pc!.text}`}>{planIcons[user.plan]}</span>
                  <span className={`text-[0.72rem] ${pc!.text} tracking-wider uppercase`}>{user.planLabel} Plan</span>
                </div>
              </div>
            </div>
          )}

          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-lg my-1 ${
                isActive(link.path)
                  ? "text-[#10b981] bg-[rgba(16,185,129,0.1)]"
                  : "text-[#8ba4a8]"
              }`}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                to="/app"
                onClick={() => setMobileOpen(false)}
                className="block text-center mt-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white"
              >
                Open App
              </Link>
              <button
                onClick={() => { void handleLogout(); }}
                className="w-full text-left block px-4 py-3 rounded-lg my-1 text-[#f87171] hover:bg-[rgba(239,68,68,0.08)] transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 rounded-lg my-1 text-[#8ba4a8]"
              >
                Sign In
              </Link>
              <Link
                to="/pricing"
                onClick={() => setMobileOpen(false)}
                className="block text-center mt-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#10b981] to-[#0d7a56] text-white"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
