import { createClient } from "../supabase/server";
import { Category } from "@/types/api/category";

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data as Category[];
}
