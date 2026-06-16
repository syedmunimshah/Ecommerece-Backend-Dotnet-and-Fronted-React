import { Card } from "@/components/ui/Card";

interface AdminPlaceholderProps {
  title: string;
  description: string;
}

export function AdminPlaceholder({ title, description }: AdminPlaceholderProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="mt-1 text-muted">{description}</p>
      </div>
      <Card className="p-8 text-center">
        <p className="text-sm text-muted">
          This section is ready for backend API integration. Connect your .NET admin endpoints to enable full management.
        </p>
      </Card>
    </div>
  );
}
