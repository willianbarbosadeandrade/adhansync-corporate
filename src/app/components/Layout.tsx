import { Outlet, useLocation } from "react-router";
import { useEffect } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Toaster } from "sonner";

export function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#0a1a1f] text-[#e8ece9]">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
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