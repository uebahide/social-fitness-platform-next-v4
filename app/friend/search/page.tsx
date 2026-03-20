import { UserList } from "./UserList";

export default async function SearchPage() {
  return (
    <div className="grid grid-cols-[3fr_7fr] gap-4">
      <UserList />
      <article className="flex justify-center items-center">
        <p>Search for a user by name.</p>
      </article>
    </div>
  );
}
