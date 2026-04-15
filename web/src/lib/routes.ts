import { Home, CreditCard, Tag, PieChart, Users, type LucideIcon } from "lucide-react";

export interface RouteConfig {
  path: string;
  label: string;
  icon: LucideIcon;
  showInHeader: boolean;
  showInSidebar: boolean;
}

/**
 * Centralized route configuration for the application.
 * Used by Header and Sidebar components to ensure consistency.
 */
export const ROUTES: RouteConfig[] = [
  { path: "/", label: "Dashboard", icon: Home, showInHeader: true, showInSidebar: true },
  { path: "/transacoes", label: "Transações", icon: CreditCard, showInHeader: true, showInSidebar: true },
  { path: "/categorias", label: "Categorias", icon: Tag, showInHeader: true, showInSidebar: true },
  { path: "/pessoas", label: "Pessoas", icon: Users, showInHeader: false, showInSidebar: true },
  { path: "/totais", label: "Relatórios", icon: PieChart, showInHeader: true, showInSidebar: true },
] as const;

/**
 * Get routes that should be displayed in the header navigation
 */
export function getHeaderRoutes(): RouteConfig[] {
  return ROUTES.filter((route) => route.showInHeader);
}

/**
 * Get routes that should be displayed in the sidebar navigation
 */
export function getSidebarRoutes(): RouteConfig[] {
  return ROUTES.filter((route) => route.showInSidebar);
}
