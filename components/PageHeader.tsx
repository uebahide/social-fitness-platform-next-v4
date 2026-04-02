import React from "react";

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  badges?: string[];
};

export const PageHeader = ({
  eyebrow,
  title,
  description,
  badges = [],
}: PageHeaderProps) => {
  return (
    <header data-testid="page-header" className="px-1 py-2">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-gray-300" />
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-gray-500">
              {eyebrow}
            </p>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-gray-900 md:text-4xl">
              {title}
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-gray-600">
              {description}
            </p>
          </div>
        </div>

        {badges.length > 0 ? (
          <ul className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 lg:justify-end">
            {badges.map((badge) => (
              <li key={badge} className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-gray-400" />
                <span>{badge}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </header>
  );
};
