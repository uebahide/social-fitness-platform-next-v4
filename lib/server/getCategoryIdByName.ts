import { createClient } from "@/lib/supabase/server";
import { CategoryType } from "@/types/api/category";

export async function getCategoryIdByName(name: CategoryType) {
  const supabase = await createClient();
  const { data: category, error: categoryError } = await supabase
    .from("categories")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  if (!category) {
    throw new Error("Category not found");
  }

  return category.id;
}
