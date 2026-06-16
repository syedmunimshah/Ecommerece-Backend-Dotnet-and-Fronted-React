import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FAQ_ITEMS } from "@/lib/content";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = { title: "FAQ" };

export default function FAQPage() {
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: "FAQ" }]} />
      <h1 className="mb-2 text-3xl font-bold">Frequently Asked Questions</h1>
      <p className="mb-10 text-muted">Find answers to common questions about shopping on EdgeCart</p>
      <div className="mx-auto max-w-3xl space-y-4">
        {FAQ_ITEMS.map((item) => (
          <Card key={item.q} className="p-6">
            <h2 className="font-semibold">{item.q}</h2>
            <p className="mt-2 text-sm text-foreground/80">{item.a}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
