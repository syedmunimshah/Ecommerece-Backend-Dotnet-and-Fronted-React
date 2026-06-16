"use client";

import {
  LayoutDashboard,
  Users,
  Store,
  Package,
  Tag,
  Boxes,
  Star,
  Ticket,
  Image,
  FileText,
  Shield,
  Settings,
  BarChart3,
  TrendingUp,
  DollarSign,
  Bell,
  Activity,
} from "lucide-react";
import { Sidebar, type SidebarItem } from "./Sidebar";

const items: SidebarItem[] = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Tag },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/brands", label: "Brands", icon: Store },
  { href: "/admin/inventory", label: "Inventory", icon: Boxes },
  { href: "/admin/orders", label: "Orders", icon: Package },
  { href: "/admin/users", label: "Customers", icon: Users },
  { href: "/admin/sellers", label: "Seller Approvals", icon: Store },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/coupons", label: "Coupons", icon: Ticket },
  { href: "/admin/banners", label: "Banners", icon: Image },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/roles", label: "Roles", icon: Shield },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/reports", label: "Reports", icon: BarChart3 },
  { href: "/admin/analytics", label: "Analytics", icon: TrendingUp },
  { href: "/admin/sales", label: "Sales Stats", icon: DollarSign },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/activity", label: "Activity Logs", icon: Activity },
];

export function AdminSidebar() {
  return <Sidebar items={items} title="Admin Panel" />;
}
