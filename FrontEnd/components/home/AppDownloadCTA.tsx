import { Smartphone, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AnimateIn } from "@/components/ui/AnimateIn";

export function AppDownloadCTA() {
  return (
    <AnimateIn as="section" className="container-page py-12" variant="fade-up">
      <div className="card flex flex-col items-center gap-6 overflow-hidden p-8 sm:flex-row sm:p-10 motion-safe:transition-all motion-safe:duration-500 hover:shadow-glow-lg">
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-primary/15 motion-safe:animate-float">
          <Smartphone className="h-10 w-10 text-accent" />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold">Shop on the go</h2>
          <p className="mt-2 text-muted">
            Download the EdgeCart app for exclusive mobile deals, faster checkout, and order tracking.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> App Store
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" /> Google Play
          </Button>
        </div>
      </div>
    </AnimateIn>
  );
}
