import { Category } from "./category";
import { User } from "./user";

export type ActivityType = {
  id: string;
  category: Category;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  user: User;
  details: {
    distance?: number;
    duration?: number;
    location?: string;
  };
};
