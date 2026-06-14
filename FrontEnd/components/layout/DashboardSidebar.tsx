"use client";

import {
  Package,
  User,
  Store,
  Tag,
  ClipboardList,
  Shield,
} from "lucide-react";
import type { Role } from "@/types/auth";
import { Sidebar, type SidebarItem } from "./Sidebar";

export function DashboardSidebar({ role }: { role: Role | null }) {
  const items: SidebarItem[] = [
    { href: "/dashboard", label: "Profile", icon: User },
    { href: "/dashboard/orders", label: "My orders", icon: Package },
  ];

  if (role === "Seller") {
    items.push(
      { href: "/dashboard/products", label: "My Products", icon: Tag },
      { href: "/dashboard/store-orders", label: "Store Orders", icon: ClipboardList },
    );
  } else if (role === "Admin") {
    items.push({ href: "/admin", label: "Admin Panel", icon: Shield });
  } else {
    items.push({ href: "/dashboard/become-seller", label: "Become a seller", icon: Store });
  }

  return <Sidebar items={items} title="Account" />;
}
