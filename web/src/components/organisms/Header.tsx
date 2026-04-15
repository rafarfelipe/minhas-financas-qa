import { Link, useLocation } from "react-router-dom";
import { getHeaderRoutes } from "@/lib/routes";

function labelFromSegment(seg: string) {
  if (!seg) return "";
  return seg.charAt(0).toUpperCase() + seg.slice(1);
}

export function Header() {
  const location = useLocation();
  const headerRoutes = getHeaderRoutes();

  const segments = location.pathname.split("/").filter(Boolean);
  const breadcrumbs = segments.map((seg, idx) => {
    const path = `/${segments.slice(0, idx + 1).join("/")}`;
    return { label: labelFromSegment(seg), path };
  });

  return (
    <header className="topbar">
      <div className="max-w-6xl flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3 mx-2">
          <div className="logo" style={{ width: 44, height: 44, borderRadius: 8, background: "linear-gradient(135deg,#3b6cff,#8fb1ff)", boxShadow: "0 6px 18px rgba(59,108,255,0.18)" }} />
          <div>
            <div className="brand-name font-semibold">Minhas Finanças</div>
            <div className="muted text-sm">Gerencie seu dinheiro</div>
          </div>
        </div>

        <nav className="nav hidden sm:flex space-x-4 mx-8" aria-label="Main navigation">
          {headerRoutes.map((route) => (
            <Link key={route.path} to={route.path} className={location.pathname === route.path ? "text-blue-600" : "text-gray-700 hover:text-gray-900"}>
              {route.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Breadcrumbs */}
      <div className="breadcrumbs">
        <div className="max-w-6xl mx-auto px-4 py-2 text-sm">
          <nav aria-label="breadcrumb">
            <ol className="flex space-x-2">
              <li>
                <Link to="/">Home</Link>
              </li>
              {breadcrumbs.map((b, i) => (
                <li key={b.path} className="flex items-center">
                  <span className="mx-2">/</span>
                  <Link to={b.path} className={i === breadcrumbs.length - 1 ? "font-medium" : "hover:underline"}>{b.label}</Link>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </header>
  );
}
