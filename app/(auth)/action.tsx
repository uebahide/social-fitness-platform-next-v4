"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import z from "zod";

const schema = z
  .object({
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
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
    first_name?: string[];
    last_name?: string[];
    email?: string[];
    password?: string[];
    password_confirmation?: string[];
  };
  error?: string;
  success: string;
  data: {
    first_name?: string;
    last_name?: string;
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
  const first_name = String(formData.get("first_name") ?? "");
  const last_name = String(formData.get("last_name") ?? "");
  const display_name = first_name + " " + last_name;
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const password_confirmation = String(
    formData.get("password_confirmation") ?? "",
  );

  //validate fields
  const validatedFields = schema.safeParse({
    first_name,
    last_name,
    email,
    password,
    password_confirmation,
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      error: "",
      success: "",
      data: {
        first_name,
        last_name,
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
      success: "",
      data: {
        first_name,
        last_name,
        email,
        password,
        password_confirmation,
      },
    };
  }

  //check if profile already exists
  const { data: profile_check, error: profile_check_error } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email);
  if (profile_check_error) {
    return {
      errors: {},
      error: profile_check_error.message ?? "An unknown error occurred",
      success: "",
      data: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
    };
  }

  //if profile already exists, return error message instead of creating new profile
  if (profile_check.length > 0) {
    return {
      errors: {},
      error: "This email is already in use.",
      success: "",
      data: {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        password_confirmation: "",
      },
    };
  }

  //insert profile into database
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .insert({
      first_name,
      last_name,
      display_name,
      email,
      user_id: data.user?.id,
    })
    .select()
    .single();

  if (profileError) {
    return {
      errors: {},
      error: profileError.message ?? "An unknown error occurred",
      success: "",
      data: {
        first_name,
        last_name,
        email,
        password,
        password_confirmation,
      },
    };
  }

  return {
    errors: {},
    error: "",
    success: "Please check your email for verification.",
    data: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
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
