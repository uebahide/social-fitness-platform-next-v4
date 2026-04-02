export type Category = {
  id: string;
  name: CategoryType;
};

export type CategoryType =
  | "running"
  | "cycling"
  | "swimming"
  | "walking"
  | "gym"
  | "boxing"
  | "yoga"
  | "hiking";
