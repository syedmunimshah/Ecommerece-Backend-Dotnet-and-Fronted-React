"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { readStorage } from "@/lib/localStorage";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateTime } from "@/lib/format";

interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Welcome to EdgeCart!", body: "Start shopping from verified sellers today.", date: new Date().toISOString(), read: false },
  { id: "2", title: "Order updates", body: "Track your orders from the dashboard.", date: new Date().toISOString(), read: true },
];

export default function NotificationsPage() {
  const [items, setItems] = useState<Notification[]>([]);

  useEffect(() => {
    setItems(readStorage<Notification[]>("edgecart_notifications", DEFAULT_NOTIFICATIONS));
  }, []);

  if (!items.length) {
    return <EmptyState icon={<Bell className="h-16 w-16" />} title="No notifications" />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Notifications</h1>
      <div className="space-y-3">
        {items.map((n) => (
          <Card key={n.id} className={`p-4 ${!n.read ? "border-primary/30 bg-primary/5" : ""}`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="mt-1 text-sm text-muted">{n.body}</p>
              </div>
              <span className="shrink-0 text-xs text-muted">{formatDateTime(n.date)}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
