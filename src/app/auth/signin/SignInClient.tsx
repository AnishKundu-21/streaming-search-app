"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignInClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  // Show banner if user just registered
  const [justRegistered, setJustRegistered] = useState(false);
  useEffect(() => {
    if (searchParams?.get("registered") === "1") {
      setJustRegistered(true);
    }
  }, [searchParams]);

  // Handle credentials login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid e-mail or password");
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-card p-8 shadow-soft sm:p-10">
        <div className="relative">
          {justRegistered && (
            <div className="mb-4 rounded-full border border-white/10 bg-surface-muted px-4 py-2 text-center text-xs font-semibold uppercase tracking-wide text-accent">
              Account created! Sign in to continue
            </div>
          )}

          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your credentials or continue with Google.
          </p>

          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="mt-8 flex w-full items-center justify-center gap-3 rounded-full border border-white/10 bg-surface-muted px-4 py-3 text-sm font-semibold text-foreground transition hover:border-accent/40 hover:text-accent"
            type="button"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.364h-18.2v7.273h10.491c-1.11 4.182-4.546 7.273-10.491 7.273-6.364 0-11.545-5.182-11.545-11.545S19.036 11.82 25.4 11.82c3.273 0 6.182 1.273 8.364 3.273l5.455-5.455C35.782 6.318 30.782 4 25.4 4 14.327 4 5.6 12.727 5.6 23.8s8.727 19.8 19.8 19.8c11.273 0 19.8-7.727 19.8-19.8 0-1.273-.127-2.545-.327-3.636z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 flex items-center gap-3">
            <span className="flex-1 border-t border-white/10" />
            <span className="text-xs uppercase tracking-wide text-muted-foreground">
              or use email
            </span>
            <span className="flex-1 border-t border-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-surface-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-surface-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>

            {error && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:shadow-lg"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-semibold text-accent hover:text-accent-strong"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
