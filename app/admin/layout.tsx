import { Sidebar } from "@/components/admin/sidebar";
import { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar />
            {/* Main content with left padding to account for fixed sidebar */}
            <main className="lg:pl-64 min-h-screen bg-gray-50">
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
