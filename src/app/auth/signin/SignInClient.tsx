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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
        {/* Success banner */}
        {justRegistered && (
          <div className="mb-4 px-4 py-2 rounded-md bg-green-100 text-green-800 text-sm text-center">
            Account created! You can sign in now.
          </div>
        )}

        <h1 className="text-2xl font-bold mb-6 text-center">
          Sign in to StreamFinder
        </h1>

        {/* Google sign-in */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md mb-6"
        >
          {/* Simple “G” icon */}
          <svg className="w-5 h-5" viewBox="0 0 48 48">
            <path
              fill="#FFC107"
              d="M43.6 20.364h-18.2v7.273h10.491c-1.11 4.182-4.546 7.273-10.491 7.273-6.364 0-11.545-5.182-11.545-11.545S19.036 11.82 25.4 11.82c3.273 0 6.182 1.273 8.364 3.273l5.455-5.455C35.782 6.318 30.782 4 25.4 4 14.327 4 5.6 12.727 5.6 23.8s8.727 19.8 19.8 19.8c11.273 0 19.8-7.727 19.8-19.8 0-1.273-.127-2.545-.327-3.636z"
            />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center mb-6">
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-gray-300 dark:border-gray-600" />
        </div>

        {/* Credentials form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
          >
            Sign In
          </button>
        </form>

        {/* Sign-up link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold"
            >
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
