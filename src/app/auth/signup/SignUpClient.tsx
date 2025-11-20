"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";

export default function SignUpClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { supabase } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const origin = window.location.origin;
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || "Registration failed");
      return;
    }

    router.push("/auth/signin?registered=1");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-20">
      <div className="relative w-full max-w-md overflow-hidden border-2 border-white/10 bg-black p-8 shadow-[0_0_50px_rgba(0,0,0,0.5)] sm:p-12 animate-fade-up">
        <div className="relative">
          <h1 className="font-display text-4xl font-bold uppercase italic tracking-tighter text-white sm:text-5xl">
            Create <span className="text-accent">Account</span>
          </h1>
          <p className="mt-4 text-sm font-medium uppercase tracking-wide text-white/60">
            Join StreamFinder to track what you love and discover what&apos;s next.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-accent">
                Name
              </label>
              <input
                type="text"
                placeholder="ALEX DOE"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border-2 border-white/20 bg-white/5 px-4 py-4 text-sm font-bold uppercase tracking-wider text-white placeholder:text-white/20 focus:border-accent focus:outline-none transition-colors"
              />
            </div>
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
                placeholder="AT LEAST 6 CHARACTERS"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
              disabled={loading}
              className="w-full bg-white px-6 py-4 text-sm font-bold uppercase tracking-widest text-black transition-transform hover:scale-[1.02] hover:bg-accent hover:text-white disabled:opacity-60"
            >
              {loading ? "Creating account…" : "Sign Up"}
            </button>
          </form>

          <div className="mt-8 text-center text-xs font-bold uppercase tracking-widest text-white/60">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-white hover:text-accent transition-colors border-b border-transparent hover:border-accent"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
