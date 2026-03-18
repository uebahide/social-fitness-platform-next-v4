export type Category = {
  id: string;
  name: string;
  category: CategoryType;
};

type CategoryType = [
  "running",
  "cycling",
  "swimming",
  "walking",
  "gym",
  "boxing",
  "yoga",
  "hiking",
];
