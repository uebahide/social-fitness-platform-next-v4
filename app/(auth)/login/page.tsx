import { LoginForm } from "@/components/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
  description:
    "Sign in to Social Fitness and continue tracking activity and messaging your training partners.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function Login() {
  return (
    <div className="flex items-center justify-center">
      <LoginForm />
    </div>
  );
}
