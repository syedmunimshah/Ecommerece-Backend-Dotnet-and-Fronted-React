import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { POLICY_CONTENT } from "@/lib/content";

type PolicyKey = keyof typeof POLICY_CONTENT;

interface PageProps {
  params?: never;
}

function PolicyPage({ policyKey }: { policyKey: PolicyKey }) {
  const policy = POLICY_CONTENT[policyKey];
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

export function makePolicyPage(policyKey: PolicyKey, title: string) {
  const Page = () => <PolicyPage policyKey={policyKey} />;
  return Page;
}

export const privacyMetadata: Metadata = { title: "Privacy Policy" };
export const termsMetadata: Metadata = { title: "Terms & Conditions" };
export const returnsMetadata: Metadata = { title: "Return Policy" };
export const shippingMetadata: Metadata = { title: "Shipping Policy" };
