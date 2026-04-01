import { UserList } from "./UserList";
import { PageHeader } from "@/components/PageHeader";

export default async function SearchPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Connections"
        title="Search People"
        description="Look up other members by name, send requests, and discover new training partners."
      />
      <div className="grid grid-cols-[3fr_7fr] gap-4">
        <UserList />
        <article className="flex items-center justify-center">
          <p>Search for a user by name.</p>
        </article>
      </div>
    </section>
  );
}
