import { PatientSidebar } from "@/components/patient/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-slate-50">
            <PatientSidebar />
            <main className="flex-1 overflow-y-auto lg:ml-72">
                <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
