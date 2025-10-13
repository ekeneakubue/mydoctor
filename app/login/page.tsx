import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="relative min-h-[100vh] flex items-center justify-center px-4 py-16 bg-[url('/images/4.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-black/10 dark:border-white/10 bg-background/80 p-8 shadow-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-sm text-black/70 dark:text-white/70">Sign in to continue to CityCare</p>
        </div>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input
              id="email"
              type="email"
              required
              placeholder="you@example.com"
              className="h-11 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/40"
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">Password</label>
            <input
              id="password"
              type="password"
              required
              placeholder="••••••••"
              className="h-11 rounded-md border border-black/10 dark:border-white/15 bg-transparent px-3 outline-none focus:ring-2 focus:ring-foreground/40"
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 select-none">
              <input type="checkbox" className="h-4 w-4 accent-current" />
              Remember me
            </label>
            <Link href="#" className="hover:underline underline-offset-4">Forgot password?</Link>
          </div>
          <button type="submit" className="mt-2 inline-flex h-11 items-center justify-center rounded-md bg-foreground text-background font-semibold hover:opacity-90 transition">Sign in</button>
        </form>
        <p className="mt-6 text-center text-sm text-black/70 dark:text-white/70">
          Don&apos;t have an account? <Link href="/signup" className="font-medium hover:underline underline-offset-4">Sign up</Link>
        </p>
      </div>
    </main>
  );
}


