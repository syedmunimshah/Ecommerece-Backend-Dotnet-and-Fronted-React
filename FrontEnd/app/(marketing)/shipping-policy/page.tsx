import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { POLICY_CONTENT } from "@/lib/content";

export const metadata: Metadata = { title: "Shipping Policy" };

export default function ShippingPolicyPage() {
  const policy = POLICY_CONTENT.shipping;
  return (
    <div className="container-page py-10">
      <Breadcrumb items={[{ label: policy.title }]} />
      <h1 className="mb-8 text-3xl font-bold">{policy.title}</h1>
      <div className="mx-auto max-w-3xl space-y-8">
        {policy.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="mb-3 text-xl font-semibold">{s.heading}</h2>
            <p className="leading-relaxed text-foreground/80">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
