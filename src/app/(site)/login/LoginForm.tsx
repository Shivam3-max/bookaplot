"use client";

import { useActionState } from "react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { login } from "@/app/actions/auth";

export default function LoginForm() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <>
      <section className="grid-bg border-b border-line py-12">
        <div className="container-x text-center">
          <Reveal>
            <p className="eyebrow">Welcome back</p>
            <h1 className="mx-auto mt-3 max-w-2xl text-3xl font-black leading-tight sm:text-5xl">
              Sign In to Your Dashboard
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-graphite">
              Channel partners and investors — pick up right where you left off.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="container-x max-w-md py-10">
        <div className="card p-6 sm:p-8">
          <form action={action} className="grid gap-4">
            <div>
              <label className="label">Phone *</label>
              <input name="phone" required type="tel" className="input" placeholder="+91" />
              {state?.fieldErrors?.phone && (
                <p className="mt-1 text-xs font-semibold text-[var(--red)]">{state.fieldErrors.phone[0]}</p>
              )}
            </div>
            <div>
              <label className="label">Password *</label>
              <input name="password" required type="password" className="input" placeholder="••••••••" />
              {state?.fieldErrors?.password && (
                <p className="mt-1 text-xs font-semibold text-[var(--red)]">{state.fieldErrors.password[0]}</p>
              )}
            </div>
            {state?.error && (
              <p className="rounded-xl bg-[#faece9] px-3.5 py-2.5 text-xs font-semibold text-[var(--red)]">
                {state.error}
              </p>
            )}
            <button type="submit" disabled={pending} className="btn-gold justify-center disabled:opacity-60">
              {pending ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p className="mt-5 text-center text-xs text-graphite">
            New to Mondato? <Link href="/join" className="font-bold underline">Join the network</Link>
          </p>
        </div>
      </section>
    </>
  );
}
