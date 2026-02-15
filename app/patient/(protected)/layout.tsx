import { PatientSidebar } from "@/components/patient/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-gray-50/50">
            <PatientSidebar />
            <main className="flex-1 lg:ml-64 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
