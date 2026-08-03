import Link from "next/link";
import { Facebook, Instagram } from "lucide-react";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { FOOTER_LEGAL, FOOTER_LINKS, FOOTER_SOCIAL } from "@/lib/content/footer";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function SocialIcon({ type }: { type: "facebook" | "twitter" | "instagram" }) {
  const className = "h-4 w-4";
  if (type === "facebook") return <Facebook className={className} />;
  if (type === "instagram") return <Instagram className={className} />;
  return <TwitterIcon className={className} />;
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div>
      <h3 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-[var(--footer-bg)] pb-20 lg:pb-0">
      <div className="container-page py-10 sm:py-16">
        <div className="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Brand + newsletter */}
          <div className="lg:col-span-5">
            <Logo className="[&_span]:text-foreground [&_path]:fill-foreground [&_path:nth-child(2)]:fill-[var(--footer-bg)]" />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Elevating the commerce experience in Pakistan. Shop from trusted brands
              or start your own selling journey today.
            </p>
            <div className="mt-6 hidden max-w-sm lg:block">
              <NewsletterForm />
            </div>
          </div>

          {/* Link columns — stacked on mobile */}
          <div className="flex flex-col gap-8 sm:grid sm:grid-cols-3 lg:col-span-7">
            <FooterColumn title="Shop" links={FOOTER_LINKS.shop} />
            <FooterColumn title="Sell" links={FOOTER_LINKS.sell} />
            <FooterColumn title="Support" links={FOOTER_LINKS.support} />
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center gap-5 py-6 text-sm text-muted lg:flex-row lg:justify-between">
          <p className="text-center lg:text-left">
            © {year} EdgeCart Pakistan. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {FOOTER_LEGAL.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="transition-colors hover:text-foreground"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {FOOTER_SOCIAL.map(({ label, href, icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted transition-colors hover:text-foreground"
              >
                <SocialIcon type={icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
