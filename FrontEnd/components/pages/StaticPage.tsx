import { STATIC_PAGES } from "@/lib/content/static-pages";
import { Breadcrumb, PageHeader } from "@/components/layout/PageShell";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function StaticPage({ slug }: { slug: keyof typeof STATIC_PAGES }) {
  const page = STATIC_PAGES[slug];
  if (!page) return null;

  return (
    <div className="container-page py-10 sm:py-14">
      <Breadcrumb items={[{ label: page.title }]} />
      <AnimateIn>
        <PageHeader title={page.title} subtitle={page.subtitle} />
        <div className="max-w-3xl space-y-8">
          {page.sections.map((section, i) => (
            <div key={i} className="rounded-2xl border border-border bg-[var(--card-bg)] p-6 sm:p-8">
              {section.heading && (
                <h2 className="mb-3 text-lg font-semibold text-foreground">{section.heading}</h2>
              )}
              <div className="space-y-2 text-sm leading-relaxed text-muted">
                {section.body.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AnimateIn>
    </div>
  );
}
