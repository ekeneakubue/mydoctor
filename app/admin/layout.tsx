import { Sidebar } from "@/components/admin/sidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main className="min-h-screen lg:pl-72">
                <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
