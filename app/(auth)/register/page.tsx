import { RegisterForm } from "@/components/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register",
  description:
    "Create a new account to start tracking your activities and messaging your training partners.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Register() {
  return (
    <div className="flex items-center justify-center">
      <RegisterForm />
    </div>
  );
}
