import AddActivityButton from "@/components/AddActivityButton";
import { MyActivities } from "./MyActivities";
import { Suspense } from "react";

import { PaginationSimple } from "@/components/Pagination";

type PageProps = {
  searchParams: Promise<{
    page?: string;
  }>;
};

export default async function Activity({ searchParams }: PageProps) {
  const { page: pageNumber } = await searchParams;
  const page: number = parseInt(pageNumber ?? "1") || 1;

  return (
    <section className="grid grid-cols-[9fr_6fr] space-y-6 gap-x-10">
      <main className="space-y-6">
        <header className="flex items-center gap-3">
          <h2 className="">My Activity</h2>
          <AddActivityButton />
        </header>

        <MyActivities page={page} />
        <PaginationSimple page={page} />
      </main>

      <aside>
        <Suspense fallback={<div>Loading...</div>}>
          {/* <MyAnalytics token={token} /> */}
        </Suspense>
      </aside>
    </section>
  );
}
