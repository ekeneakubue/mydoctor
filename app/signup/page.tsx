"use client"

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { signup } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);

    if (result.success) {
      // Show success message
      setSuccess(true);
      setLoading(false);
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } else {
      setError(result.error || "An error occurred");
      setLoading(false);
    }
  }

  return (
    <main className="relative h-screen overflow-hidden flex items-center justify-center p-3 sm:p-4 bg-[url('/images/hero-team.svg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full md:w-1/2 max-w-3xl rounded-2xl border border-black/10 dark:border-white/10 bg-background/80 backdrop-blur-sm p-5 lg:p-6 shadow-sm">
        <div className="mb-4 text-center">
          <h1 className="text-xl font-bold tracking-tight">Create your account</h1>
          <p className="mt-1 text-sm text-black/70 dark:text-white/70">Join MyDoctor to manage your health online</p>
        </div>

        {error && (
          <div className="mb-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 text-sm text-red-800 dark:text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-800 dark:text-green-200">
            Account created successfully! Redirecting to login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-3 md:grid-cols-2">
          <div className="grid gap-1.5">
            <label htmlFor="firstName" className="text-sm font-medium">First name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              placeholder="Jane"
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-white/50 dark:bg-black/50 px-3 outline-none focus:ring-2 focus:ring-foreground/40"
              disabled={loading}
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="lastName" className="text-sm font-medium">Last name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              placeholder="Doe"
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-white/50 dark:bg-black/50 px-3 outline-none focus:ring-2 focus:ring-foreground/40"
              disabled={loading}
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-white/50 dark:bg-black/50 px-3 outline-none focus:ring-2 focus:ring-foreground/40"
              disabled={loading}
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              placeholder="+1 234 567 8900"
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-white/50 dark:bg-black/50 px-3 outline-none focus:ring-2 focus:ring-foreground/40"
              disabled={loading}
            />
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-white/50 dark:bg-black/50 px-3 outline-none focus:ring-2 focus:ring-foreground/40"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Must be at least 6 characters
            </p>
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-medium">Confirm password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={6}
              placeholder="••••••••"
              className="h-10 rounded-md border border-black/10 dark:border-white/15 bg-white/50 dark:bg-black/50 px-3 outline-none focus:ring-2 focus:ring-foreground/40"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Must match the password above
            </p>
          </div>
          <button 
            type="submit" 
            className="mt-1 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-foreground text-background font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed md:col-span-2"
            disabled={loading || success}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Creating account..." : success ? "Success!" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-black/70 dark:text-white/70">
          Already have an account? <Link href="/login" className="font-medium hover:underline underline-offset-4">Sign in</Link>
        </p>
      </div>
    </main>
  );
}


