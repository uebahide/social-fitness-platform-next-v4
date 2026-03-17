"use client";

import { login } from "@/app/(auth)/action";
import { useActionState } from "react";
import { AuthForm } from "./form/Form";
import { SubmitButton } from "./buttons/SubmitButton";
import { ErrorMessage } from "./form/ErrorMessage";
import { FormRow } from "./form/FormRow";
import { Input } from "./form/Input";
import Link from "next/link";

const initialState = {
  error: "",
  data: {
    email: "",
    password: "",
  },
};

export const LoginForm = () => {
  const [state, formAction] = useActionState(login, initialState);

  return (
    <AuthForm
      action={formAction}
      title="Login"
      footerText={
        <div className="flex justify-center">
          <p>
            Have no account yet?
            <Link href="/register" className="text-brand-secondary-500">
              {" "}
              Sign up now!
            </Link>
          </p>
        </div>
      }
    >
      <ErrorMessage>{state.error}</ErrorMessage>
      <FormRow>
        <label htmlFor="email">Email</label>
        <Input
          defaultValue={state.data.email}
          type="email"
          id="email"
          name="email"
          required
        />
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
      </FormRow>
      <SubmitButton className="mt-10 mb-5 w-full">Login</SubmitButton>
    </AuthForm>
  );
};
