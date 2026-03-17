"use client";

import { register } from "@/app/(auth)/action";
import { useActionState } from "react";
import { SubmitButton } from "./buttons/SubmitButton";
import Link from "next/link";
import { AuthForm } from "./form/AuthForm";
import { FormRow } from "./form/FormRow";
import { Input } from "./form/Input";
import { ErrorMessage } from "./form/ErrorMessage";

const initialState = {
  errors: {},
  message: "",
  data: {
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  },
};

export const RegisterForm = () => {
  const [state, formAction] = useActionState(register, initialState);
  return (
    <AuthForm
      action={formAction}
      title="Create new account"
      footerText={
        <div className="mb-3 text-center">
          <p>
            Have an account?{" "}
            <Link href="/login" className="text-brand-secondary-500">
              Sign in
            </Link>
          </p>
        </div>
      }
    >
      <FormRow>
        <label htmlFor="name">Name</label>
        <Input
          defaultValue={state.data.name}
          type="text"
          id="name"
          name="name"
          required
        />
        <ErrorMessage>{state.errors["name"]}</ErrorMessage>
      </FormRow>

      <FormRow>
        <label htmlFor="email">Email</label>
        <Input
          defaultValue={state.data.email}
          type="email"
          id="email"
          name="email"
          required
        />
        <ErrorMessage>{state.errors["email"]}</ErrorMessage>
      </FormRow>

      <FormRow>
        <label htmlFor="password">Password</label>
        <Input
          defaultValue={state.data.password}
          type="password"
          id="password"
          name="password"
          required
        />
        <ErrorMessage>{state.errors["password"]}</ErrorMessage>
      </FormRow>

      <FormRow>
        <label htmlFor="password_confirmation">Password Confirmation</label>
        <Input
          defaultValue={state.data.password_confirmation}
          type="password"
          id="password_confirmation"
          name="password_confirmation"
          required
        />
        <ErrorMessage>{state.errors["password_confirmation"]}</ErrorMessage>
      </FormRow>

      <SubmitButton className="mt-10 mb-5 w-full">Register</SubmitButton>
    </AuthForm>
  );
};
