"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

export async function updateImage(prevState: any, formData: FormData) {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  let res: Response;

  try {
    res = await fetch(`${process.env.API_URL}/api/user/image/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (e) {
    throw new Error(`Network error while logout : ${String(e)}`);
  }

  const resJson = await res.json();

  if (!res.ok) {
    throw new Error(`${resJson.error}: ${res.status}, ${res.statusText}`);
  }

  revalidatePath("/profile", "layout");
  redirect("/profile");
}

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email"),
});

export async function updateProfile(prevState: any, formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const cookiesStore = await cookies();
  const token = cookiesStore.get("token")?.value;
  const validatedFields = schema.safeParse({ name, email });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "",
      data: { name, email },
    };
  }

  let res: Response;

  try {
    res = await fetch(`${process.env.API_URL}/api/user/update`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (e) {
    throw new Error(`Network error while logout : ${String(e)}`);
  }

  const resJson = await res.json();
  if (!res.ok) {
    return {
      errors: resJson.errors,
      message: resJson.message,
      data: { name, email },
    };
  }

  revalidatePath("/profile", "layout");

  return {
    errors: {},
    message: "Profile was updated successfully",
    data: {
      name: "",
      email: "",
    },
  };
}
