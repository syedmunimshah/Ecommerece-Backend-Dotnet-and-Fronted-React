"use client";

import { Users, Store, Package, Tag, LayoutDashboard } from "lucide-react";
import { Sidebar, type SidebarItem } from "./Sidebar";

const items: SidebarItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/sellers", label: "Seller approvals", icon: Store },
  { href: "/admin/orders", label: "All orders", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Tag },
];

export function AdminSidebar() {
  return <Sidebar items={items} title="Admin" />;
}
