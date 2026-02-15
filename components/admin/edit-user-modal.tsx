"use client";

import { X, Upload, User as UserIcon, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { updateUser } from "@/app/actions/user-actions";
import { User } from "@prisma/client";

interface EditUserModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: User;
    onSuccess: () => void;
}

export function EditUserModal({ isOpen, onClose, user, onSuccess }: EditUserModalProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(user.image || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPreviewUrl(user.image || null);
            setError(null);
            setShowPassword(false);
        }
    }, [isOpen, user.image]);

    const handleClose = () => {
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-lg font-semibold text-gray-900">Edit User</h2>
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

                    const result = await updateUser(user.id, formData);
                    setIsLoading(false);

                    if (result.success) {
                        onSuccess();
                        handleClose();
                    } else {
                        setError(result.error || "Something went wrong");
                    }
                }} className="p-6 space-y-5">

                    {/* Avatar Upload Section */}
                    <div className="flex flex-col items-center justify-center gap-4">
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
                                    <UserIcon size={40} className="text-gray-400" />
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
                        <div className="p-3 bg-red-50 text-red-500 text-sm rounded-lg">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                placeholder="e.g. John Doe"
                                defaultValue={user.name || ""}
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                placeholder="e.g. john@citycare.com"
                                defaultValue={user.email}
                                required
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Phone</label>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="e.g. +1234567890"
                                defaultValue={user.phone || ""}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Password
                                <span className="text-gray-400 font-normal ml-1">(leave blank to keep current)</span>
                            </label>
                            <div className="relative">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    minLength={6}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Role</label>
                            <select 
                                name="role" 
                                defaultValue={user.role}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm bg-white"
                            >
                                <option value="PATIENT">Patient</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100 mt-6">
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
                                    Updating...
                                </>
                            ) : (
                                "Update User"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
