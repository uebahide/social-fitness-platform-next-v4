import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative min-h-screen overflow-hidden flex flex-col gap-6">
      <div className="pointer-events-none absolute inset-0">
        {/* <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-brand-secondary-100/60 blur-3xl" /> */}
        <div className="absolute right-16 top-16 h-64 w-64 rounded-full bg-brand-primary-100/35 blur-3xl" />
        <div className="absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-brand-secondary-50 blur-3xl" />
      </div>
      {children}
    </section>
  );
}
