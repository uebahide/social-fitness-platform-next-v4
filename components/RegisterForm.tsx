"use client";

import { signUpNewUser, signUpNewUserState } from "@/app/(auth)/action";
import { useActionState } from "react";
import { SubmitButton } from "./buttons/SubmitButton";
import Link from "next/link";
import { AuthForm } from "./form/AuthForm";
import { FormRow } from "./form/FormRow";
import { Input } from "./form/Input";
import { ErrorMessage } from "./form/ErrorMessage";
import { SuccessMessage } from "./form/SuccessMessage";

const initialState: signUpNewUserState = {
  errors: {},
  error: "",
  success: "",
  data: {
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password_confirmation: "",
  },
};

export const RegisterForm = () => {
  const [state, formAction] = useActionState(signUpNewUser, initialState);
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
      <ErrorMessage>{state.error}</ErrorMessage>
      <SuccessMessage>{state.success}</SuccessMessage>
      <FormRow>
        <label htmlFor="name">First name</label>
        <Input
          defaultValue={state.data.first_name}
          type="text"
          id="first_name"
          name="first_name"
          required
        />
        <ErrorMessage>{state.errors["first_name"]}</ErrorMessage>
      </FormRow>

      <FormRow>
        <label htmlFor="name">Last name</label>
        <Input
          defaultValue={state.data.last_name}
          type="text"
          id="last_name"
          name="last_name"
          required
        />
        <ErrorMessage>{state.errors["last_name"]}</ErrorMessage>
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
