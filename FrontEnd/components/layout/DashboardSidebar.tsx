"use client";

import {
  LayoutDashboard,
  Package,
  User,
  Store,
  Tag,
  ClipboardList,
  Shield,
  Heart,
  MapPin,
  Bell,
  MessageSquare,
  Star,
  KeyRound,
} from "lucide-react";
import type { Role } from "@/types/auth";
import { Sidebar, type SidebarItem } from "./Sidebar";

export function DashboardSidebar({ role }: { role: Role | null }) {
  const items: SidebarItem[] = [
    { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard", label: "My Profile", icon: User },
    { href: "/dashboard/profile/edit", label: "Edit Profile", icon: User },
    { href: "/dashboard/change-password", label: "Change Password", icon: KeyRound },
    { href: "/dashboard/orders", label: "My Orders", icon: Package },
    { href: "/dashboard/wishlist", label: "My Wishlist", icon: Heart },
    { href: "/dashboard/addresses", label: "Saved Addresses", icon: MapPin },
    { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
    { href: "/dashboard/support", label: "Support Tickets", icon: MessageSquare },
    { href: "/dashboard/reviews", label: "My Reviews", icon: Star },
  ];

  if (role === "Seller") {
    items.push(
      { href: "/dashboard/products", label: "My Products", icon: Tag },
      { href: "/dashboard/store-orders", label: "Store Orders", icon: ClipboardList },
    );
  } else if (role === "Admin") {
    items.push({ href: "/admin", label: "Admin Panel", icon: Shield });
  } else if (role === "User") {
    items.push({ href: "/dashboard/become-seller", label: "Become a Seller", icon: Store });
  }

  return <Sidebar items={items} title="My Account" />;
}
