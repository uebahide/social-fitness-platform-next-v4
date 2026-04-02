import { getCategoryIdByName } from "@/lib/server/getCategoryIdByName";
import { createClient } from "@/lib/supabase/server";
import { CategoryType } from "@/types/api/category";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const rawCategoryFilter = searchParams.get("categoryFilter");
  const categoryFilter =
    rawCategoryFilter &&
    rawCategoryFilter !== "null" &&
    rawCategoryFilter !== "undefined"
      ? rawCategoryFilter
      : null;
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  const supabase = await createClient();

  if (categoryFilter) {
    const categoryId = await getCategoryIdByName(
      categoryFilter as CategoryType,
    );
    const { count: categoryCount, error: categoryError } = await supabase
      .from("activities")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("category_id", categoryId);
    if (categoryError) {
      return NextResponse.json(
        { error: categoryError.message },
        { status: 500 },
      );
    }
    return NextResponse.json(categoryCount);
  }

  const { count: allCount, error: allError } = await supabase
    .from("activities")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  if (allError) {
    return NextResponse.json({ error: allError.message }, { status: 500 });
  }
  return NextResponse.json(allCount);
}
