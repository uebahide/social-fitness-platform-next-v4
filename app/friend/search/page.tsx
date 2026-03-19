import { UserList } from "./UserList";

export default async function SearchPage() {
  return (
    <div className="grid grid-cols-[3fr_7fr] gap-4">
      <UserList />
      <article>
        <div>Image</div>
        <div>Name</div>
      </article>
    </div>
  );
}
