"use server";

import { getCurrentUserId } from "@/lib/server/getCurrentUserId";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import z from "zod";

const schema = z.object({
  title: z.string(),
  description: z.string(),
  category: z.string().min(1, "Category is required"),
  details: z.object({
    distance: z.number().optional(),
    duration: z.number().optional(),
    location: z.string().optional(),
  }),
});

export type CreateActivityState = {
  errors: {
    title?: string[];
    description?: string[];
    category?: string[];
    details?: string[];
  };
  error: string;
  message: string;
  data: {
    title?: string;
    description?: string;
    category?: string;
    details?: {
      distance?: number;
      duration?: number;
      location?: string;
    };
  };
  ok: boolean;
};

export async function createActivity(
  _prevState: CreateActivityState,
  formData: FormData,
) {
  const supabase = await createClient();
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const category = String(formData.get("category") ?? "");
  const details = {
    distance: formData.get("distance")
      ? Number(formData.get("distance"))
      : undefined,
    duration: formData.get("duration")
      ? Number(formData.get("duration"))
      : undefined,
    location: formData.get("location")
      ? String(formData.get("location"))
      : undefined,
  };
  const validatedFields = schema.safeParse({
    title,
    description,
    category,
    details,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error?.flatten().fieldErrors,
      error: "",
      message: "Invalid fields",
      data: {},
      ok: false,
    };
  }

  //get category id from category name
  const { data: category_data } = await supabase
    .from("categories")
    .select("*")
    .eq("name", category)
    .single();
  const category_id = category_data?.id;

  //get user id from auth user
  const user_id = await getCurrentUserId();

  //create activity in supabase
  const { data, error } = await supabase
    .from("activities")
    .insert([{ title, description, category_id, user_id }])
    .select()
    .single();

  if (error) {
    return {
      errors: {},
      error: error.message,
      message: error.message,
      data: {},
      ok: false,
    };
  }

  //create activity detail in supabase based on category
  const activity_detail_payload = buildActivityDetailPayload(
    category,
    details,
    data.id,
  );
  const { error: activity_detail_error } = await supabase
    .from("activity_details")
    .insert([activity_detail_payload])
    .select()
    .single();

  if (activity_detail_error) {
    return {
      errors: {},
      error: activity_detail_error?.message,
      message: activity_detail_error?.message,
      data: {},
      ok: false,
    };
  }

  revalidatePath("/activity", "layout");

  return {
    errors: {},
    error: "",
    message: "Activity was created successfully",
    data: {},
    ok: true,
  };
}

export async function deleteActivity(
  _prevState: CreateActivityState,
  formData: FormData,
) {
  const supabase = await createClient();
  const id = formData.get("id");
  if (!id) {
    return {
      errors: { id: "Id is required" },
      error: "",
      message: "Id is required",
      data: {},
      ok: false,
    };
  }

  const { error } = await supabase
    .from("activities")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      errors: {},
      error: error.message,
      message: error.message,
      data: {},
      ok: false,
    };
  }

  revalidatePath("/activity", "layout");

  return {
    errors: {},
    error: "",
    message: "Activity was deleted successfully",
    data: {},
    ok: true,
  };
}

export type UpdateActivityState = {
  errors: {
    title?: string[];
    description?: string[];
    category?: string[];
    details?: string[];
  };
  error: string;
  message: string;
  data: {
    title?: string;
    description?: string;
    category?: string;
    details?: {
      distance?: number;
      duration?: number;
      location?: string;
    };
  };
  ok: boolean;
};

export async function updateActivity(
  _prevState: CreateActivityState,
  formData: FormData,
) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "");
  const description = String(formData.get("description") ?? "");
  const category = String(formData.get("category") ?? "");
  const details = {
    distance: formData.get("distance")
      ? Number(formData.get("distance"))
      : undefined,
    duration: formData.get("duration")
      ? Number(formData.get("duration"))
      : undefined,
    location: formData.get("location")
      ? String(formData.get("location"))
      : undefined,
  };

  const validatedFields = schema.safeParse({
    title,
    description,
    category,
    details,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error?.flatten().fieldErrors,
      error: "",
      message: "Invalid fields",
      data: {},
      ok: false,
    };
  }

  //update activity in supabase
  const { data, error } = await supabase
    .from("activities")
    .update({ title, description })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return {
      errors: {},
      error: error.message,
      message: error.message,
      data: {},
      ok: false,
    };
  }

  //update activity detail in supabase based on category
  const activity_detail_payload = buildActivityDetailPayload(
    category,
    details,
    data.id,
  );
  const { error: activity_detail_error } = await supabase
    .from("activity_details")
    .update([activity_detail_payload])
    .eq("activity_id", data.id)
    .select()
    .single();
  if (activity_detail_error) {
    return {
      errors: {},
      error: activity_detail_error?.message,
      message: activity_detail_error?.message,
      data: {},
      ok: false,
    };
  }

  revalidatePath("/activity", "layout");

  return {
    errors: {},
    error: "",
    message: "Activity was updated successfully",
    data: {},
    ok: true,
  };
}

function buildActivityDetailPayload(
  category: string,
  details: {
    distance?: number;
    duration?: number;
    location?: string;
  },
  activityId: string,
) {
  switch (category) {
    case "running":
      return {
        activity_id: activityId,
        category,
        distance: details.distance,
        duration: details.duration,
      };

    case "walking":
      return {
        activity_id: activityId,
        category,
        distance: details.distance,
        duration: details.duration,
      };

    case "cycling":
      return {
        activity_id: activityId,
        category,
        distance: details.distance,
        duration: details.duration,
      };

    case "swimming":
      return {
        activity_id: activityId,
        category,
        distance: details.distance,
        duration: details.duration,
      };

    case "hiking":
      return {
        activity_id: activityId,
        category,
        location: details.location,
        duration: details.duration,
        distance: details.distance,
      };
    default:
      throw new Error("Invalid category");
  }
}
