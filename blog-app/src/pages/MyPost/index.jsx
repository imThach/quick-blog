import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Binoculars } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosClient from '../../components/services/api/axiosClient';
import { useAuth } from '../../components/context/authContext';
import useAuthorization from '../../hooks/useAuthorization';
import DialogConfirm from '../../components/DialogConfirm';
import LottieReact from 'lottie-react';
import emptyAnimation from '../../assets/animations/empty-state.json';
import { stripHtml } from '../../lib/utils';

const Lottie = LottieReact.default || LottieReact;

export default function MyPost() {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const { isAdmin, userId } = useAuthorization();

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const endpoint = isAdmin ? '/posts' : `/posts?userId=${userId}`;
                const response = await axiosClient.get(endpoint);
                let allPosts = response?.items || response?.data || response || [];
                if (!Array.isArray(allPosts)) allPosts = [];

                if (isAdmin) {
                    setPosts(allPosts);
                } else {
                    const myPosts = allPosts.filter(post => {
                        let authorId = post?.author?._id || post?.author?.id || post?.userId || post?.authorId;
                        if (typeof post?.author === 'string') authorId = post.author;
                        return authorId && String(authorId) === String(userId);
                    });
                    setPosts(myPosts);
                }
            } catch (error) {
                toast.error('Không thể tải danh sách bài viết!');
                console.error('Lỗi MyPost:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [user, isAdmin, userId]);

    const handleDeleteClick = (post) => {
        setPostToDelete(post);
        setIsDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!postToDelete) return;

        setIsDeleting(true);
        try {
            await axiosClient.delete(`/posts/${postToDelete._id}`);
            toast.success('Đã xóa bài viết thành công!');
            setPosts(posts.filter(p => p._id !== postToDelete._id));
            setIsDialogOpen(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Xóa thất bại!');
        } finally {
            setIsDeleting(false);
            setPostToDelete(null);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">

            {/* Tiêu đề */}
            <div className="text-center mb-16">
                <h1 className="text-[40px] font-bold text-[#5A52F6] flex items-center justify-center gap-3">
                    <span className="text-4xl">✍️</span> My Post
                </h1>
            </div>

            {/* Bảng dữ liệu */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-[#5A52F6] rounded-full animate-spin"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 bg-[var(--bg-main)] rounded-xl border border-dashed border-[var(--border-color)] transition-colors">
                    <div className="w-64 h-64 mx-auto mb-4">
                        <Lottie animationData={emptyAnimation} loop={true} />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-main)]">Chưa có bài viết nào</h2>
                    <p className="text-[var(--text-muted)] mt-2">
                        Hãy bắt đầu viết và chia sẻ câu chuyện đầu tiên của bạn!
                    </p>
                </div>
            ) : (
                <div className="w-full">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-[var(--border-color)] transition-colors">
                                <th className="pb-4 px-2 text-[13px] font-bold text-[var(--text-main)] w-[25%] transition-colors">TITLE</th>
                                <th className="pb-4 px-2 text-[13px] font-bold text-[var(--text-main)] w-[55%] transition-colors">CONTENT</th>
                                <th className="pb-4 px-2 text-[13px] font-bold text-[var(--text-main)] transition-colors">ACTION</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map((post) => (
                                <tr key={post._id} className="group border-b border-[var(--border-color)]/30 last:border-0 hover:bg-[var(--bg-secondary)] transition-colors">

                                    {/* TITLE */}
                                    <td className="py-5 px-2 align-top">
                                        <p className="text-[15px] text-[var(--text-main)] font-medium line-clamp-2 transition-colors">
                                            {post.title}
                                        </p>
                                    </td>

                                    {/* CONTENT */}
                                    <td className="py-5 px-2 align-top">
                                        <p className="text-[15px] text-[var(--text-muted)] line-clamp-2 transition-colors">
                                            {stripHtml(post.content)}...
                                        </p>
                                    </td>

                                    {/* ACTION */}
                                    <td className="py-5 px-2 align-top">
                                        <div className="flex items-center gap-2">
                                            {/* Nút View (Ống nhòm) */}
                                            <Link
                                                to={`/post/${post._id}`}
                                                className="p-2 bg-[#3B82F6] hover:bg-blue-600 text-white rounded-md transition-colors"
                                                title="Xem chi tiết"
                                            >
                                                <Binoculars className="w-[18px] h-[18px]" />
                                            </Link>

                                            {/* Nút Xóa (Thùng rác) */}
                                            <button
                                                onClick={() => handleDeleteClick(post)}
                                                className="p-2 bg-[#EF4444] hover:bg-red-600 text-white rounded-md transition-colors"
                                                title="Xóa bài viết"
                                            >
                                                <Trash2 className="w-[18px] h-[18px]" />
                                            </button>
                                        </div>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Dialog Xác nhận Xóa */}
            <DialogConfirm
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                isLoading={isDeleting}
                title="Xóa bài viết"
                message={`Bạn có chắc chắn muốn xóa bài viết "${postToDelete?.title}"?`}
            />

        </div>
    );
}