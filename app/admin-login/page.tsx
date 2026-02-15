"use client"

import Link from "next/link";
import { Loader2, Shield, ArrowLeft } from "lucide-react";
import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result.success) {
      const userRole = (result as any).role;
      const userType = (result as any).userType;
      
      if (userRole === 'ADMIN' || userRole === 'STAFF') {
        router.push("/admin");
      } else if (userType === 'doctor') {
        router.push("/doctor/dashboard");
      } else {
        router.push("/");
      }
      router.refresh();
    } else {
      setError(result.error || "An error occurred");
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-[100vh] flex items-center justify-center px-4 py-16 bg-gradient-to-br from-purple-50 via-indigo-50 to-white">
      <Link 
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        <span className="font-medium">Back to Home</span>
      </Link>

      <div className="relative z-10 w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-xl">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Shield className="text-white" size={32} />
        </div>

        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Admin Login</h1>
          <p className="mt-2 text-sm text-gray-600">System administration and management</p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="admin@citycare.com"
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              disabled={loading}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="••••••••"
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="mt-2 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold hover:from-purple-700 hover:to-purple-800 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {loading ? "Signing in..." : "Sign in as Admin"}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2 border-t border-gray-100">
            <span>Login as:</span>
            <Link href="/patient/login" className="text-green-600 hover:underline font-medium">
              Patient
            </Link>
            <span>•</span>
            <Link href="/doctor/login" className="text-blue-600 hover:underline font-medium">
              Doctor
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
