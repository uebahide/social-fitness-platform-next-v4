import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const perPage = parseInt(searchParams.get("per_page") ?? "10");
  const userId = searchParams.get("userId");

  if (!page || !perPage || !userId) {
    return NextResponse.json(
      { error: "Page, per_page, and user_id are required" },
      { status: 400 },
    );
  }

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("activities")
    .select("*, user:user_id(*), category:category_id(name)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(perPage)
    .range((page - 1) * perPage, page * perPage - 1);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
