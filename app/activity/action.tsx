"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function createActivity(prevState: any, formData: FormData) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  let res: Response;

  try {
    res = await fetch(`${process.env.API_URL}/api/activities`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (e) {
    throw new Error(`Network error while logout : ${String(e)}`);
  }

  if (!res.ok) {
    const resJson = await res.json();
    return {
      errors: resJson.errors,
      message: resJson.message,
      data: {},
      ok: false,
    };
  }

  revalidatePath("/activity", "layout");

  return {
    errors: {},
    message: "New activity was created successfully",
    data: {},
    ok: true,
  };
}

export async function deleteActivity(prevState: any, formData: FormData) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  let res: Response;

  const id = formData.get("id");
  if (!id) {
    return {
      errors: { id: "Id is required" },
      message: "Id is required",
      data: {},
      ok: false,
    };
  }

  try {
    res = await fetch(`${process.env.API_URL}/api/activities/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (e) {
    throw new Error(`Network error while logout : ${String(e)}`);
  }

  if (!res.ok) {
    const resJson = await res.json();
    return {
      errors: resJson.errors,
      message: resJson.message,
      data: {},
    };
  }

  revalidatePath("/activity", "layout");

  return {
    errors: {},
    message: "Activity was deleted successfully",
    data: {},
    ok: true,
  };
}

export async function updateActivity(prevState: any, formData: FormData) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  let res: Response;

  const data = {
    title: formData.get("title"),
    description: formData.get("description"),
    category: formData.get("category"),
    details: {
      distance: formData.get("distance"),
      duration: formData.get("duration"),
      location: formData.get("location") ?? null,
    },
  };

  const id = formData.get("id");
  if (!id) {
    return {
      errors: { id: "Id is required" },
      message: "Id is required",
      data: {},
      ok: false,
    };
  }

  try {
    res = await fetch(`${process.env.API_URL}/api/activities/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
      cache: "no-store",
    });
  } catch (e) {
    throw new Error(`Network error while logout : ${String(e)}`);
  }

  if (!res.ok) {
    const resJson = await res.json();
    return {
      errors: resJson.errors,
      message: resJson.message,
      data: {},
      ok: false,
    };
  }

  revalidatePath("/activity");

  return {
    errors: {},
    message: "Activity was updated successfully",
    data: {},
    ok: true,
  };
}
