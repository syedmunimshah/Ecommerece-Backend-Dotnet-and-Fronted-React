"use client";

import { useState, FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input, FormField } from "@/components/ui/Input";
import { useAppDispatch } from "@/lib/reduxStore";
import { pushToast } from "@/features/ui/uiSlice";

export default function ContactPage() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      dispatch(pushToast({ tone: "success", message: "Message sent! We'll reply within 24 hours." }));
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "Contact Us" }]} />
      <h1 className="mb-2 text-3xl font-bold">Contact Us</h1>
      <p className="mb-10 text-muted">We&apos;d love to hear from you. Send us a message and we&apos;ll respond promptly.</p>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-4">
          {[
            { icon: Mail, label: "Email", value: "support@edgecart.pk" },
            { icon: Phone, label: "Phone", value: "+92 300 1234567" },
            { icon: MapPin, label: "Address", value: "Karachi, Pakistan" },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label} className="flex items-start gap-4 p-4">
              <Icon className="mt-0.5 h-5 w-5 text-accent" />
              <div>
                <p className="text-xs font-medium uppercase text-muted">{label}</p>
                <p className="font-medium">{value}</p>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 lg:col-span-2">
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Full Name">
                <Input name="name" required placeholder="John Doe" />
              </FormField>
              <FormField label="Email">
                <Input name="email" type="email" required placeholder="john@example.com" />
              </FormField>
            </div>
            <FormField label="Subject">
              <Input name="subject" required placeholder="How can we help?" />
            </FormField>
            <FormField label="Message">
              <textarea
                name="message"
                required
                rows={5}
                className="input-base resize-none"
                placeholder="Your message..."
              />
            </FormField>
            <Button type="submit" loading={loading}>Send Message</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
