import { useState, useEffect } from 'react';
import { Trash2, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosClient from '../../components/services/api/axiosClient';
import { useAuth } from '../../components/context/authContext';
import DialogConfirm from '../../components/DialogConfirm';
import DialogChangeRole from '../../components/DialogChangeRole';

export default function UserManagement() {
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [userToEdit, setUserToEdit] = useState(null);
    const [isUpdatingRole, setIsUpdatingRole] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/users');
            setUsers(response.items || response || []);
        } catch (error) {
            toast.error('Không thể tải danh sách người dùng!');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await axiosClient.delete(`/users/${userToDelete._id || userToDelete.id}`);
            toast.success('Xóa người dùng thành công!');
            setUsers(users.filter(u => (u._id || u.id) !== (userToDelete._id || userToDelete.id)));
            setIsDeleteOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi xóa người dùng!');
        } finally {
            setIsDeleting(false);
            setUserToDelete(null);
        }
    };

    const confirmRoleChange = async (newRole) => {
        if (!userToEdit) return;
        setIsUpdatingRole(true);
        try {
            const targetId = userToEdit._id || userToEdit.id;
            await axiosClient.put(`/users/${targetId}/role`, { role: newRole });
            toast.success('Cập nhật quyền thành công!');
            setUsers(users.map(u =>
                (u._id || u.id) === targetId ? { ...u, role: newRole } : u
            ));
            setIsRoleOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Lỗi khi cập nhật quyền!');
        } finally {
            setIsUpdatingRole(false);
            setUserToEdit(null);
        }
    };

    const capitalizeFirstLetter = (string) => {
        return string ? string.charAt(0).toUpperCase() + string.slice(1).toLowerCase() : '';
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">

            {/* Tiêu đề */}
            <div className="text-center mb-16">
                <h1 className="text-[40px] font-bold text-[#5A52F6] flex items-center justify-center gap-3">
                    <span className="text-4xl">🧩</span> User Management
                </h1>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-[#5A52F6] rounded-full animate-spin"></div>
                </div>
            ) : users.length === 0 ? (
                <div className="text-center py-16 text-[var(--text-muted)]">Chưa có người dùng nào.</div>
            ) : (
                <div className="w-full">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="pb-4 px-2 text-[13px] font-bold text-[var(--text-main)] w-[25%]">USERNAME</th>
                                <th className="pb-4 px-2 text-[13px] font-bold text-[var(--text-main)] w-[45%]">EMAIL</th>
                                <th className="pb-4 px-2 text-[13px] font-bold text-[var(--text-main)] w-[15%]">ROLE</th>
                                <th className="pb-4 px-2 text-[13px] font-bold text-[var(--text-main)]">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => {
                                const isMySelf = (u._id || u.id) === (currentUser?._id || currentUser?.id);

                                return (
                                    <tr key={u._id || u.id} className="group border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">

                                        <td className="py-4 px-2">
                                            <p className="text-[15px] text-[var(--text-main)] font-medium">
                                                {u.username} {isMySelf && <span className="text-[13px] text-[var(--text-muted)] font-normal ml-1">(Bạn)</span>}
                                            </p>
                                        </td>

                                        <td className="py-4 px-2">
                                            <p className="text-[15px] text-[var(--text-main)]">{u.email}</p>
                                        </td>

                                        <td className="py-4 px-2">
                                            <span className="inline-flex px-3 py-1 border border-[var(--border-color)] text-[var(--text-main)] text-[13px] font-medium rounded-full bg-[var(--bg-secondary)]">
                                                {capitalizeFirstLetter(u.role)}
                                            </span>
                                        </td>

                                        <td className="py-4 px-2">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => {
                                                        setUserToDelete(u);
                                                        setIsDeleteOpen(true);
                                                    }}
                                                    disabled={isMySelf}
                                                    className="p-1.5 bg-[#EF4444] hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Xóa User"
                                                >
                                                    <Trash2 className="w-[18px] h-[18px]" />
                                                </button>

                                                {/* Nút Đổi Role (Màu Tím Nhạt) */}
                                                <button
                                                    onClick={() => {
                                                        setUserToEdit(u);
                                                        setIsRoleOpen(true);
                                                    }}
                                                    disabled={isMySelf}
                                                    className="p-1.5 bg-[#EEECFF] text-[#5044E5] hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                    title="Thay đổi quyền"
                                                >
                                                    <KeyRound className="w-[18px] h-[18px]" />
                                                </button>
                                            </div>
                                        </td>

                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Dialog Xóa */}
            <DialogConfirm
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                isLoading={isDeleting}
                title="Xóa người dùng"
                message={`Hành động này sẽ xóa vĩnh viễn tài khoản "${userToDelete?.username}". Bạn có chắc chắn?`}
            />

            {/* Dialog Đổi Role */}
            <DialogChangeRole
                isOpen={isRoleOpen}
                onClose={() => setIsRoleOpen(false)}
                onConfirm={confirmRoleChange}
                isLoading={isUpdatingRole}
                userToEdit={userToEdit}
            />

        </div>
    );
}