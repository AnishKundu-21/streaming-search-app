"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUpClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/auth/signin?registered=1");
    } else {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
    }
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-card p-8 shadow-soft sm:p-10">
        <div className="relative">
          <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Join StreamFinder to track what you love and discover what&apos;s
            next.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Name
              </label>
              <input
                type="text"
                placeholder="Alex Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/10 bg-surface-muted px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-accent/60 focus:outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
              disabled={loading}
              className="w-full rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:shadow-lg disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="font-semibold text-accent hover:text-accent-strong"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
