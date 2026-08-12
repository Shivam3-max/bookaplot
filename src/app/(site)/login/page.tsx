import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Mondato Channel Partner or Investor dashboard.",
};

export default function LoginPage() {
  return <LoginForm />;
}
