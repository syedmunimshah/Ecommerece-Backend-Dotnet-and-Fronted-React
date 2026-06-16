"use client";

import { useEffect, useState, FormEvent } from "react";
import { MessageSquare } from "lucide-react";
import { readStorage, writeStorage } from "@/lib/localStorage";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";
import { formatDateTime } from "@/lib/format";

interface Ticket {
  id: string;
  subject: string;
  message: string;
  status: "Open" | "Resolved";
  createdAt: string;
}

const KEY = "edgecart_tickets";

export default function SupportPage() {
  const dispatch = useAppDispatch();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTickets(readStorage<Ticket[]>(KEY, []));
  }, []);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const ticket: Ticket = {
      id: crypto.randomUUID(),
      subject: fd.get("subject") as string,
      message: fd.get("message") as string,
      status: "Open",
      createdAt: new Date().toISOString(),
    };
    const next = [ticket, ...tickets];
    setTickets(next);
    writeStorage(KEY, next);
    setShowForm(false);
    dispatch(pushToast({ tone: "success", message: "Support ticket submitted." }));
    e.currentTarget.reset();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Support Tickets</h1>
        <Button size="sm" onClick={() => setShowForm(true)}>New Ticket</Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <form onSubmit={onSubmit} className="space-y-4">
            <FormField label="Subject"><Input name="subject" required /></FormField>
            <FormField label="Message">
              <textarea name="message" required rows={4} className="input-base resize-none" />
            </FormField>
            <div className="flex gap-2">
              <Button type="submit">Submit</Button>
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </Card>
      )}

      {tickets.length === 0 ? (
        <EmptyState icon={<MessageSquare className="h-16 w-16" />} title="No support tickets" description="Need help? Create a new ticket." />
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Card key={t.id} className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium">{t.subject}</p>
                  <p className="mt-1 text-sm text-muted line-clamp-2">{t.message}</p>
                </div>
                <Badge tone={t.status === "Open" ? "warning" : "success"}>{t.status}</Badge>
              </div>
              <p className="mt-2 text-xs text-muted">{formatDateTime(t.createdAt)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
