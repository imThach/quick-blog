import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import axiosClient from '../../components/services/api/axiosClient';
import CloudinaryUpload from '../../components/CloudinaryUpload';
import { useAuth } from '../../components/context/authContext';

export default function CreateBlog() {
    const navigate = useNavigate();
    const editorRef = useRef(null);
    const { user } = useAuth();

    // States quản lý dữ liệu form
    const [title, setTitle] = useState('');
    const [image, setImage] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [tags, setTags] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Logic thêm Tag
    const handleAddTag = (e) => {
        e?.preventDefault();
        const trimmedTag = tagInput.trim();
        if (!trimmedTag) return;

        if (tags.includes(trimmedTag)) {
            toast.error('Tag này đã tồn tại!');
            return;
        }

        setTags([...tags, trimmedTag]);
        setTagInput('');
    };

    // Nút Enter cũng thêm Tag
    const handleKeyDownTag = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    // Logic xóa Tag
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    // Logic Submit Form
    const handleSubmit = async (e) => {
        e.preventDefault();
        const content = editorRef.current ? editorRef.current.getContent() : '';

        if (!title.trim() || !image || !content.trim() || tags.length === 0) {
            return toast.error('Vui lòng điền đầy đủ thông tin (Tiêu đề, Ảnh, Nội dung, Tags)!');
        }

        setIsSubmitting(true);
        try {
            await axiosClient.post('/posts', {
                title,
                content,
                tags,
                image
            });

            toast.success('Tạo bài viết thành công!');
            navigate('/');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi tạo bài viết!');
            console.error('Lỗi tạo blog:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">

            {/* Tiêu đề trang */}
            <div className="text-center mb-12">
                <h1 className="text-3xl sm:text-6xl font-semibold text-[#5A52F6] flex items-center justify-center gap-3">
                    <span className="text-6xl">📝</span> Create a New Blog
                </h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. Blog Image */}
                <div>
                    <label className="block text-[15px] font-semibold text-[var(--text-main)] mb-2 transition-colors">Blog Image</label>
                    <CloudinaryUpload value={image} onChange={setImage} />
                </div>

                {/* 2. Blog Title */}
                <div>
                    <label className="block text-[15px] font-semibold text-[var(--text-main)] mb-2 transition-colors">Blog Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter blog title"
                        className="w-full px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#5A52F6] focus:border-[#5A52F6] transition-colors"
                    />
                </div>

                {/* 3. Blog Content (TinyMCE) */}
                <div>
                    <label className="block text-[15px] font-semibold text-[var(--text-main)] mb-2 transition-colors">Blog Content</label>
                    <div className="border border-[var(--border-color)] rounded-md overflow-hidden transition-colors">
                        <Editor
                            apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
                            onInit={(evt, editor) => editorRef.current = editor}
                            init={{
                                height: 450,
                                menubar: true,
                                plugins: [
                                    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                    'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                ],
                                toolbar: 'undo redo | blocks | ' +
                                    'bold italic forecolor | alignleft aligncenter ' +
                                    'alignright alignjustify | bullist numlist outdent indent | ' +
                                    'removeformat',
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:15px; }',
                                branding: false, // Ẩn logo TinyMCE để giao diện sạch hơn
                                statusbar: true
                            }}
                        />
                    </div>
                </div>

                {/* 4. Blog Tag */}
                <div>
                    <label className="block text-[15px] font-semibold text-[var(--text-main)] mb-2 transition-colors">Blog Tag</label>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyDown={handleKeyDownTag}
                            placeholder="Enter blog tag"
                            className="flex-1 px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#5A52F6] focus:border-[#5A52F6] transition-colors"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="px-8 py-3 bg-[#5A52F6] hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors whitespace-nowrap"
                        >
                            Add Tag
                        </button>
                    </div>

                    {/* Hiển thị Tags đã thêm */}
                    {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#5A52F6]/10 text-[#5A52F6] text-sm font-medium rounded"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:bg-blue-200 p-0.5 rounded transition-colors"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* 5. Nút Create Blog */}
                <div className="flex justify-center pt-8">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-10 py-3 bg-[#5A52F6] hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors flex items-center justify-center min-w-[160px] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            'Create Blog'
                        )}
                    </button>
                </div>

            </form>
        </div>
    );
}