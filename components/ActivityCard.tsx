"use client";

import { ActivityType } from "@/types/api/activity";
import { Avatar } from "./Avatar";
import {
  formatDate,
  formatTime,
  getTimeOfDay,
  getUnit,
  uppercaseFirstLetter,
} from "@/lib/utils";
import { CategoryIcon } from "./CategoryIcon";
import { DropdownMenuBasic, DropdownMenuItem } from "./DropdownMenuBasic";
import { Pencil, Trash2Icon } from "lucide-react";
import { useState } from "react";
import { DeleteActivityDialogForm } from "./DeleteActivityDialogForm";
import { UpdateActivityDialogForm } from "./UpdateActivityDialogForm";

export default function ActivityCard({
  activity,
  showMenu = true,
}: {
  activity: ActivityType;
  showMenu?: boolean;
}) {
  const created_user = activity.user;
  const details = activity.details;

  return (
    <article className="@container bg-card relative rounded-lg border border-gray-300 p-4 shadow-sm transition-shadow hover:shadow-md @md:p-5 @xl:p-7">
      {/*  menu button (delete, edit) */}
      {showMenu && (
        <div className="absolute right-3 top-3 @xl:right-7">
          <ActivityCardMenu activityId={activity.id} activity={activity} />
        </div>
      )}

      {/* activity card main content */}
      <main className="mb-8 grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 gap-y-4 pr-10 @md:gap-x-4 @xl:mb-10 @xl:grid-cols-[50px_minmax(0,1fr)] @xl:gap-x-6">
        <span className="flex shrink-0 justify-center pt-1">
          <Avatar user={created_user} size="xsmall" />
        </span>
        <header className="min-w-0">
          <p className="truncate text-sm font-medium">
            {created_user.display_name}
          </p>
          <p className="text-xs text-gray-400">
            {formatDate(activity.created_at) +
              " " +
              formatTime(activity.created_at)}
          </p>
        </header>

        <span className="flex shrink-0 justify-center pt-1">
          <CategoryIcon category={activity.category.name} />
        </span>
        <section className="min-w-0 space-y-3">
          <h2 className="text-xl font-medium leading-tight text-balance @md:text-2xl">
            {activity.title
              ? activity.title
              : getTimeOfDay(activity.created_at) +
                " " +
                uppercaseFirstLetter(activity.category.name)}
          </h2>
          <ul className="grid grid-cols-1 gap-2 @md:grid-cols-2 @xl:grid-cols-3">
            {details &&
              Object.entries(details).map(([key, value]) => {
                const unit = getUnit(key as "duration" | "distance");
                const displayValue = value?.toString() ?? "—";
                const isNumericMetric = unit !== "";

                return (
                  <li
                    className="flex min-w-0 flex-col rounded-xl border border-gray-100 bg-gray-50/70 px-3 py-3"
                    key={key}
                  >
                    <span className="text-sm text-gray-500">
                      {uppercaseFirstLetter(key)}
                    </span>
                    <p className="flex items-end gap-1 text-lg font-medium @md:text-xl">
                      {value !== null ? (
                        <>
                          <span
                            className={
                              isNumericMetric
                                ? "shrink-0 whitespace-nowrap"
                                : "break-words"
                            }
                          >
                            {displayValue}
                          </span>
                          {unit ? (
                            <span className="shrink-0 text-sm text-gray-500">
                              {unit}
                            </span>
                          ) : null}
                        </>
                      ) : (
                        <span className="text-lg text-gray-400">—</span>
                      )}
                    </p>
                  </li>
                );
              })}
          </ul>
        </section>
      </main>
      <hr />

      {/* activity card footer */}
      <footer className="mt-5 flex flex-col gap-2">
        <span className="text-sm text-gray-500">Description</span>
        <span className="break-words text-sm leading-6 text-gray-700 @md:text-base">
          {activity.description}
        </span>
      </footer>
    </article>
  );
}

const ActivityCardMenu = ({
  activityId,
  activity,
}: {
  activityId: string;
  activity: ActivityType;
}) => {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateOpen, setUpdateOpen] = useState(false);

  return (
    <>
      <DropdownMenuBasic buttonText="...">
        <div className="flex flex-col gap-1">
          <DropdownMenuItem
            className="space-x-1"
            onSelect={(e) => {
              e.preventDefault();
              setUpdateOpen(true);
            }}
          >
            <div className="flex items-center gap-2">
              <Pencil className="h-4 w-4" />
              <p>Edit</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="space-x-1"
            onSelect={(e) => {
              e.preventDefault();
              setDeleteOpen(true);
            }}
          >
            <div className="flex items-center gap-2">
              <Trash2Icon className="h-4 w-4" />
              Delete
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuBasic>

      <UpdateActivityDialogForm
        updateOpen={updateOpen}
        setUpdateOpen={setUpdateOpen}
        activity={activity}
      />

      <DeleteActivityDialogForm
        deleteOpen={deleteOpen}
        setDeleteOpen={setDeleteOpen}
        activityId={activityId}
      />
    </>
  );
};
