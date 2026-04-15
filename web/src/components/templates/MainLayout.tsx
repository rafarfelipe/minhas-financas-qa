import { Outlet } from "react-router-dom";
import { Header } from "@/components/organisms/Header";
import { Sidebar } from "@/components/organisms/Sidebar";

export function MainLayout() {
  return (
    <div className="min-h-screen app-root">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="main-root">
          <Outlet />
        </main>
      </div>
    </div>
  );
}