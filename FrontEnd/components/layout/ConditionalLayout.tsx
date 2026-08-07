"use client";

import { usePathname } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageTransition } from "@/components/motion/PageTransition";
import { ChatWidget } from "@/components/chat/ChatWidget";

const AUTH_PATHS = new Set(["/login", "/register", "/forgot-password", "/reset-password"]);

function isAuthRoute(pathname: string) {
  return AUTH_PATHS.has(pathname);
}

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const authPage = isAuthRoute(pathname);

  if (authPage) {
    return <main className="flex min-h-screen flex-1 flex-col">{children}</main>;
  }

  return (
    <>
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
      <BottomNav />
      <ChatWidget />
    </>
  );
}
