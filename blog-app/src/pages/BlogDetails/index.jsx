import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axiosClient from '../../components/services/api/axiosClient';

export default function BlogDetails() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPostDetail = async () => {
            try {
                const response = await axiosClient.get(`/posts/${id}`);
                setPost(response.data || response);
            } catch (error) {
                toast.error('Không thể tải chi tiết bài viết!');
                console.error('Lỗi fetch post details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPostDetail();
    }, [id]);

    // Giao diện Spinner khi đang fetch data
    if (loading) {
        return (
            <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Xử lý khi bài viết không tồn tại
    if (!post) {
        return (
            <div className="text-center py-20 bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] mt-10">
                <h2 className="text-2xl font-bold text-[var(--text-main)]">Không tìm thấy bài viết</h2>
                <Link to="/" className="text-blue-600 hover:text-blue-800 font-medium mt-4 inline-block">
                    &larr; Quay lại trang chủ
                </Link>
            </div>
        );
    }

    // Format ngày tháng theo chuẩn "Month DD, YYYY" (ví dụ: May 26, 2026)
    const formattedDate = new Date(post.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <article className="max-w-4xl mx-auto bg-[var(--bg-main)] py-10 md:py-16 px-4 sm:px-6 lg:px-8">

            {/* Header bài viết (Căn giữa theo ảnh) */}
            <header className="mb-10 text-center max-w-3xl mx-auto flex flex-col items-center">

                {/* Ngày đăng */}
                <div className="text-[#5A52F6] text-base font-medium mb-4">
                    Published on {formattedDate}
                </div>

                {/* Tiêu đề bài viết */}
                <h1 className="text-4xl md:text-[44px] leading-[1.2] font-bold text-[var(--text-main)] mb-8">
                    {post.title}
                </h1>

                {/* Tên tác giả (Dạng Badge) */}
                <div className="inline-flex items-center justify-center px-6 py-1.5 rounded-full border border-[var(--border-color)] text-[#5A52F6] font-medium text-sm">
                    {post.author?.username || 'Ẩn danh'}
                </div>

            </header>

            {/* Ảnh Cover */}
            {post.image && (
                <div className="mb-12 rounded-t-3xl overflow-hidden">
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-auto object-cover max-h-[600px]"
                    />
                </div>
            )}

            {/* Nội dung bài viết */}
            <div
                className="blog-content text-[var(--text-main)] leading-relaxed max-w-3xl mx-auto text-lg"
                dangerouslySetInnerHTML={{ __html: post.content }}
            />

        </article>
    );
}