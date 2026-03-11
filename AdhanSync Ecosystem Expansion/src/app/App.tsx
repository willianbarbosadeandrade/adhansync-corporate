import { Suspense } from "react";
import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "./components/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#0a1a1f] text-[#8ba4a8] flex items-center justify-center">
            Loading page...
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </AuthProvider>
  );
}
