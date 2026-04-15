import { Link, useLocation } from "react-router-dom";
import { getSidebarRoutes } from "@/lib/routes";

export function Sidebar() {
  const location = useLocation();
  const sidebarRoutes = getSidebarRoutes();

  return (
    <aside className="sidebar">
      <nav>
        <ul className="space-y-2">
          {sidebarRoutes.map((route) => (
            <li key={route.path}>
              <Link
                to={route.path}
                className={`block px-4 py-2 rounded-md text-sm font-medium ${
                  location.pathname === route.path
                    ? "bg-[rgba(255,255,255,0.03)] text-white"
                    : "text-[rgba(230,238,248,0.85)] hover:bg-[rgba(255,255,255,0.01)]"
                }`}
              >
                {route.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
