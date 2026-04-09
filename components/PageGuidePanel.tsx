import Link from "next/link";
import { Card } from "@/components/Card";

type PageGuidePanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  primaryAction?: {
    href: string;
    label: string;
  };
  secondaryAction?: {
    href: string;
    label: string;
  };
  testId?: string;
};

export const PageGuidePanel = ({
  eyebrow,
  title,
  description,
  highlights,
  primaryAction,
  secondaryAction,
  testId,
}: PageGuidePanelProps) => {
  return (
    <Card
      className="flex relative h-[calc(100vh-92px)] flex-col justify-between overflow-hidden rounded-[28px] border-white/70 bg-gradient-to-br from-white via-white to-brand-secondary-50/70 p-6 shadow-sm"
      data-testid={testId}
    >
      <div className="absolute -right-10 top-0 h-36 w-36 rounded-full bg-brand-secondary-100/70 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-28 w-28 rounded-full bg-brand-primary-100/30 blur-3xl" />

      <div className="relative z-10 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gray-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
              {eyebrow}
            </p>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="max-w-md text-sm leading-6 text-gray-600">
              {description}
            </p>
          </div>
        </div>

        <ul className="space-y-4">
          {highlights.map((highlight) => (
            <li key={highlight} className="flex items-start gap-3">
              <span className="mt-2 h-2 w-2 rounded-full bg-brand-primary-400" />
              <p className="text-sm leading-6 text-gray-600">{highlight}</p>
            </li>
          ))}
        </ul>
      </div>

      {(primaryAction || secondaryAction) && (
        <div className="relative z-10 flex flex-wrap gap-3 pt-6">
          {primaryAction ? (
            <Link
              href={primaryAction.href}
              className="inline-flex items-center rounded-full bg-gray-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800"
            >
              {primaryAction.label}
            </Link>
          ) : null}
          {secondaryAction ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              {secondaryAction.label}
            </Link>
          ) : null}
        </div>
      )}
    </Card>
  );
};
