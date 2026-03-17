"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

const schema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "This field should have the same value as password",
    path: ["password_confirmation"],
  });

export type signUpNewUserState = {
  errors: {
    name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
  };
  error?: string;
  data: {
    name?: string;
    email?: string;
    password?: string;
    password_confirmation?: string;
  };
};

export async function signUpNewUser(
  prevState: signUpNewUserState,
  formData: FormData,
) {
  const supabase = await createClient();
  const name = String(formData.get("name") ?? "");
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const password_confirmation = String(
    formData.get("password_confirmation") ?? "",
  );

  //validate fields
  const validatedFields = schema.safeParse({
    name,
    email,
    password,
    password_confirmation,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      error: "",
      data: {
        name,
        email,
        password,
        password_confirmation,
      },
    };
  }

  //sign up with supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: process.env.APP_URL,
    },
  });

  if (error) {
    return {
      errors: {},
      error: error.message ?? "An unknown error occurred",
      data: {
        name,
        email,
        password,
        password_confirmation,
      },
    };
  }

  //insert profile into database
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert({
      name,
      email,
      user_id: data.user?.id,
    })
    .select()
    .single();

  if (profileError) {
    return {
      errors: {},
      error: profileError.message ?? "An unknown error occurred",
      data: {
        name,
        email,
        password,
        password_confirmation,
      },
    };
  }

  return {
    errors: {},
    error: "",
    data: {
      name,
      email,
      password,
      password_confirmation,
    },
  };
}

export type signInWithEmailState = {
  errors: {
    email?: string[];
    password?: string[];
  };
  error: string;
  data: {
    email: string;
    password: string;
  };
};

export async function signInWithEmail(
  prevState: signInWithEmailState,
  formData: FormData,
) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      errors: {},
      error: error.message ?? "An unknown error occurred",
      data: {
        email,
        password,
      },
    };
  }

  redirect("/");

  return {
    errors: {},
    error: "",
    data: {
      email,
      password,
    },
  };
}

export type signOutState = {
  error: string;
};

export async function signOut(prevState: signOutState, formData?: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    return {
      error: error.message ?? "An unknown error occurred",
    };
  }
  redirect("/");
}
