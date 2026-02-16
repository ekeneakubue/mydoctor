"use client";

import { Search, Plus, UserCog, Trash2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreateUserModal } from "@/components/admin/create-user-modal";
import { EditUserModal } from "@/components/admin/edit-user-modal";
import { deleteUser } from "@/app/actions/user-actions";
import { User, Role } from "@prisma/client";

interface UsersClientProps {
    initialUsers: User[];
}

export function UsersClient({ initialUsers }: UsersClientProps) {
    const router = useRouter();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [deleteConfirmUser, setDeleteConfirmUser] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleDeleteClick = (user: User) => {
        setDeleteConfirmUser(user);
    };

    const handleDeleteConfirm = async () => {
        if (!deleteConfirmUser) return;

        setIsDeleting(true);
        const result = await deleteUser(deleteConfirmUser.id);
        setIsDeleting(false);

        if (result.success) {
            setDeleteConfirmUser(null);
            router.refresh();
        } else {
            alert(result.error || "Failed to delete user");
        }
    };

    const handleSuccess = () => {
        router.refresh();
    };

    const filteredUsers = initialUsers.filter((user) => {
        const matchesSearch =
            (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "ALL" || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-slate-900">Users</h1>
                    <p className="mt-1 text-slate-500">Manage system users and access roles</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-violet-700"
                >
                    <Plus size={18} />
                    Add User
                </button>
            </div>

            <CreateUserModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {selectedUser && (
                <EditUserModal
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setSelectedUser(null);
                    }}
                    user={selectedUser}
                    onSuccess={handleSuccess}
                />
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirmUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                                    <Trash2 className="text-red-600" size={24} />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Delete User</h2>
                                    <p className="text-sm text-gray-500">This action cannot be undone</p>
                                </div>
                            </div>
                            <p className="text-gray-700 mb-6">
                                Are you sure you want to delete <strong>{deleteConfirmUser.name || deleteConfirmUser.email}</strong>? This will permanently remove the user from the system.
                            </p>
                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setDeleteConfirmUser(null)}
                                    disabled={isDeleting}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDeleteConfirm}
                                    disabled={isDeleting}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="animate-spin" size={16} />
                                            Deleting...
                                        </>
                                    ) : (
                                        "Delete User"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-4 border-b border-slate-200 p-4 sm:flex-row">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search users by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full rounded-xl border border-slate-300 py-2 pl-10 pr-4 text-slate-700 outline-none transition-all focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                        />
                    </div>
                    <div className="flex gap-3">
                        <select
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value as Role | "ALL")}
                            className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-slate-600 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-200"
                        >
                            <option value="ALL">All Roles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="STAFF">Staff</option>
                            <option value="PATIENT">Patient</option>
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-500">
                        <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Role</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold">Last Active</th>
                                <th className="px-6 py-4 text-right font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="group transition-colors hover:bg-slate-50">
                                        <td className="flex items-center gap-3 whitespace-nowrap px-6 py-4 font-semibold text-slate-900">
                                            {user.image ? (
                                                <img src={user.image} alt={user.name || "User"} className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                                            ) : (
                                                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-sm font-bold text-slate-600 shadow-sm">
                                                    <UserCog size={16} />
                                                </div>
                                            )}
                                            {user.name || "System User"}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                                    user.role === "ADMIN"
                                                        ? "bg-purple-100 text-purple-800 border-purple-200"
                                                        : user.role === "STAFF"
                                                        ? "bg-blue-100 text-blue-800 border-blue-200"
                                                        : "bg-green-100 text-green-800 border-green-200"
                                                }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap" suppressHydrationWarning>
                                            {new Date(user.updatedAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-3">
                                                <button 
                                                    onClick={() => handleEdit(user)}
                                                    className="text-sm font-semibold text-violet-700 transition-colors hover:text-violet-800 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteClick(user)}
                                                    className="text-sm font-semibold text-red-600 transition-colors hover:text-red-800 hover:underline"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination - Simplified for now since we're loading all users */}
                <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/70 p-4 text-sm text-slate-500">
                    <span>Showing {filteredUsers.length} users</span>
                    {/* Add pagination logic if needed later */}
                </div>
            </div>
        </div>
    );
}
