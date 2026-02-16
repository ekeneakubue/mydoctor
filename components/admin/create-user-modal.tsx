"use client";

import { X, Upload, User, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createUser } from "@/app/actions/create-user";

interface CreateUserModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateUserModal({ isOpen, onClose }: CreateUserModalProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleClose = () => {
        setPreviewUrl(null);
        setError(null);
        setIsLoading(false);
        setShowPassword(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onClose();
    };

    if (!isOpen) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleRemoveImage = () => {
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full md:w-1/2 max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Add New User</h2>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-1 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form action={async (formData) => {
                    setIsLoading(true);
                    setError(null);

                    const result = await createUser(formData);
                    setIsLoading(false);

                    if (result.success) {
                        handleClose();
                        router.refresh();
                    } else {
                        setError(result.error || "Something went wrong");
                    }
                }} className="grid gap-4 p-6 md:grid-cols-2">

                    {/* Avatar Upload Section - First Field */}
                    <div className="flex flex-col items-center justify-center gap-4 md:col-span-2">
                        <div className="relative group">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center overflow-hidden border-2 ${previewUrl ? 'border-blue-500' : 'border-dashed border-gray-300 bg-gray-50'}`}>
                                {previewUrl ? (
                                    <Image
                                        src={previewUrl}
                                        alt="Avatar Preview"
                                        width={96}
                                        height={96}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <User size={40} className="text-gray-400" />
                                )}
                            </div>

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md"
                                title="Upload Image"
                            >
                                <Upload size={14} />
                            </button>

                            {previewUrl && (
                                <button
                                    type="button"
                                    onClick={handleRemoveImage}
                                    className="absolute top-0 right-0 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md transform translate-x-1/4 -translate-y-1/4"
                                    title="Remove Image"
                                >
                                    <Trash2 size={12} />
                                </button>
                            )}
                        </div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            name="image"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        <p className="text-xs text-gray-500 font-medium">
                            {previewUrl ? "Click pencil to change" : "Upload user avatar"}
                        </p>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500 md:col-span-2">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name</label>
                        <input
                            name="name"
                            type="text"
                            placeholder="e.g. John Doe"
                            required
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            placeholder="e.g. john@mydoctor.com"
                            required
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Phone</label>
                        <input
                            name="phone"
                            type="tel"
                            placeholder="e.g. +1234567890"
                            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                minLength={6}
                                className="w-full rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
                            >
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Role</label>
                        <select name="role" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                            <option value="PATIENT">Patient</option>
                            <option value="STAFF">Staff</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>

                    <div className="mt-2 flex items-center justify-end gap-3 border-t border-gray-100 pt-4 md:col-span-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={16} />
                                    Creating...
                                </>
                            ) : (
                                "Create User"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
