import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-black/10 dark:border-white/10 bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-3">
            <Image src="/vercel.svg" alt="CityCare logo" width={28} height={28} className="dark:invert" />
            <span className="text-lg font-semibold tracking-tight">CityCare Hospital</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#home" className="hover:underline underline-offset-4">Home</Link>
            <Link href="#about" className="hover:underline underline-offset-4">About</Link>
            <Link href="#services" className="hover:underline underline-offset-4">Services</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="inline-flex items-center rounded-md border border-black/10 dark:border-white/15 px-4 py-2 text-sm font-medium hover:bg-black/5 dark:hover:bg-white/10 transition">Login</Link>
            <Link href="#about" className="md:hidden inline-flex items-center rounded-md bg-foreground text-background px-3 py-2 text-sm font-medium">Get Started</Link>
          </div>
        </div>
      </header>

      <main id="home" className="flex-1">
        {/* Hero - full width background carousel with overlay and content */}
        <section className="relative w-full h-[70vh] sm:h-[80vh] overflow-hidden">
          {/* Sliding images background */}
          <div className="absolute inset-0 flex w-[100%] cc-carousel-track">
            <div className="relative w-full shrink-0 grow-0">
              <Image src="/images/1.jpeg" alt="Telemedicine" fill className="object-cover" />
            </div>
            <div className="relative w-full shrink-0 grow-0">
              <Image src="/images/2.jpg" alt="Global access" fill className="object-cover" />
            </div>
            <div className="relative w-full shrink-0 grow-0">
              <Image src="/images/3.avif" alt="Records management" fill className="object-cover" />
            </div>
          </div>

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

          {/* Content */}
          <div className="relative z-10 mx-auto max-w-6xl h-full px-4 flex items-center">
            <div className="max-w-2xl text-white">
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Your Health, Our Priority</h1>
              <p className="mt-4 text-base/7 text-white/80">Connect with certified doctors, book online consultations, and manage records securely in one place.</p>
              <div className="mt-8 flex items-center gap-4">
                <Link id="get-started" href="#about" className="inline-flex items-center rounded-md bg-white text-black px-5 py-3 text-sm font-semibold hover:opacity-90 transition">Get Started</Link>
                <Link href="#services" className="inline-flex items-center rounded-md border border-white/30 text-white px-5 py-3 text-sm font-semibold hover:bg-white/10 transition">Explore Services</Link>
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="border-t border-black/10 dark:border-white/10 bg-black/[.02] dark:bg-white/[.03]">
          <div className="mx-auto max-w-6xl px-4 py-16">
            <div className="max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">About CityCare</h2>
              <p className="mt-4 text-black/70 dark:text-white/70">CityCare is a modern health consultation platform offering virtual visits, prescription refills, and specialist referrals. Our mission is to make quality healthcare accessible and convenient.</p>
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Our Services</h2>
          <p className="mt-2 text-black/70 dark:text-white/70 max-w-2xl">Comprehensive care tailored to your needs. Connect with experienced professionals anytime, anywhere.</p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Online Doctor Consultation", desc: "Video calls with licensed physicians for primary care and advice." },
              { title: "Specialist Referrals", desc: "Get referred to the right specialist quickly and seamlessly." },
              { title: "Prescription Refills", desc: "Request and manage prescriptions with ease and security." },
              { title: "Lab Test Booking", desc: "Schedule lab tests and receive results digitally." },
              { title: "Mental Health Support", desc: "Access therapy and counseling from certified professionals." },
              { title: "Health Records", desc: "Centralized, secure storage for your medical history." },
            ].map((card) => (
              <div key={card.title} className="rounded-xl border border-black/10 dark:border-white/15 p-6 bg-background/80">
                <div className="flex items-start gap-3">
                  <Image src="/file.svg" alt="Service icon" width={20} height={20} className="mt-1 dark:invert" />
                  <div>
                    <h3 className="text-base font-semibold">{card.title}</h3>
                    <p className="mt-2 text-sm text-black/70 dark:text-white/70">{card.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-black/10 dark:border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
          <p className="text-black/60 dark:text-white/60">© {new Date().getFullYear()} CityCare. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="#about" className="hover:underline underline-offset-4">About</Link>
            <Link href="#services" className="hover:underline underline-offset-4">Services</Link>
            <Link href="#home" className="hover:underline underline-offset-4">Home</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
