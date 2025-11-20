"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function SignInClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase } = useAuth();

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

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message || "Unable to sign in");
      return;
    }

    router.push("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="relative w-full max-w-md overflow-hidden border-2 border-white/10 bg-black p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] sm:p-12 animate-fade-up">
        <div className="relative">
          {justRegistered && (
            <div className="mb-8 border border-accent/20 bg-accent/10 px-4 py-3 text-center text-xs font-bold uppercase tracking-widest text-accent">
              Account created! Sign in to continue
            </div>
          )}

          <h1 className="font-display text-4xl font-bold uppercase italic tracking-tighter text-white sm:text-5xl">
            Welcome <span className="text-accent">Back</span>
          </h1>
          <p className="mt-4 text-sm font-medium uppercase tracking-wide text-white/60">
            Sign in with your credentials or continue with Google.
          </p>

          <button
            onClick={async () => {
              const origin = window.location.origin;
              await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                  redirectTo: `${origin}/auth/callback`,
                },
              });
            }}
            className="mt-10 flex w-full items-center justify-center gap-3 border-2 border-white/20 bg-white/5 px-6 py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:border-accent hover:bg-accent hover:text-white group"
            type="button"
          >
            <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 48 48">
              <path
                fill="#FFC107"
                d="M43.6 20.364h-18.2v7.273h10.491c-1.11 4.182-4.546 7.273-10.491 7.273-6.364 0-11.545-5.182-11.545-11.545S19.036 11.82 25.4 11.82c3.273 0 6.182 1.273 8.364 3.273l5.455-5.455C35.782 6.318 30.782 4 25.4 4 14.327 4 5.6 12.727 5.6 23.8s8.727 19.8 19.8 19.8c11.273 0 19.8-7.727 19.8-19.8 0-1.273-.127-2.545-.327-3.636z"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-10 flex items-center gap-4">
            <span className="flex-1 border-t border-white/10" />
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">
              or use email
            </span>
            <span className="flex-1 border-t border-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent">
                Email
              </label>
              <input
                type="email"
                placeholder="YOU@EXAMPLE.COM"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border-2 border-white/20 bg-white/5 px-4 py-4 text-sm font-bold uppercase tracking-wider text-white placeholder:text-white/20 focus:border-accent focus:outline-none transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border-2 border-white/20 bg-white/5 px-4 py-4 text-sm font-bold uppercase tracking-wider text-white placeholder:text-white/20 focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            {error && (
              <p className="border border-red-500/50 bg-red-500/10 px-4 py-3 text-center text-xs font-bold uppercase tracking-wide text-red-500">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-[1.02] hover:bg-accent hover:text-white"
            >
              Sign In
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-white/60">
            Don’t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-white hover:text-accent transition-colors border-b border-transparent hover:border-accent"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
