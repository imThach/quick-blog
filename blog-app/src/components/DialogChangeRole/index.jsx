import { useState, useEffect } from 'react';
import { X, User as UserIcon, Loader2 } from 'lucide-react';

export default function DialogChangeRole({
    isOpen,
    onClose,
    onConfirm,
    isLoading,
    userToEdit
}) {
    const [selectedRole, setSelectedRole] = useState('user');

    useEffect(() => {
        if (isOpen && userToEdit) {
            // Đảm bảo chữ cái đầu được viết hoa (User/Admin) nếu cần, hoặc giữ nguyên value thường
            setSelectedRole(userToEdit.role?.toLowerCase() || 'user');
        }
    }, [isOpen, userToEdit]);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onConfirm(selectedRole);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">

                {/* Header Dialog */}
                <div className="px-6 pt-6 pb-2 flex items-start justify-between">
                    <h3 className="text-xl font-semibold text-[var(--text-main)] transition-colors">Change User Role</h3>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nội dung Dialog */}
                <div className="px-6 pb-6">
                    <p className="text-[var(--text-muted)] text-[15px] mb-6 leading-relaxed transition-colors">
                        Select the new role for this user. This action will take effect immediately.
                    </p>

                    <div className="space-y-2">
                        <label className="block text-[15px] font-bold text-[var(--text-main)] transition-colors">Select Role</label>

                        {/* Custom Select với Icon bên trong */}
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                <UserIcon className="h-5 w-5 text-[var(--text-muted)] transition-colors" />
                            </div>
                            <select
                                value={selectedRole}
                                onChange={(e) => setSelectedRole(e.target.value)}
                                className="w-full pl-11 pr-10 py-2.5 border border-[var(--border-color)] rounded-lg text-[15px] text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#5A52F6]/20 focus:border-[#5A52F6] bg-[var(--bg-main)] transition-all appearance-none cursor-pointer"
                                disabled={isLoading}
                            >
                                <option value="user">User</option>
                                <option value="admin">Admin</option>
                            </select>
                            {/* Icon mũi tên xổ xuống (tùy chọn, vì appearance-none đã ẩn đi mặc định) */}
                            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-5 py-2.5 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] text-[15px] font-semibold rounded-lg hover:bg-[var(--bg-secondary)] transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading || selectedRole === userToEdit?.role?.toLowerCase()}
                        className="px-5 py-2.5 bg-[#5A52F6] text-white text-[15px] font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[130px] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save changes'}
                    </button>
                </div>

            </div>
        </div>
    );
}