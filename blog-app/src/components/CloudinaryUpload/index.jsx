import { useState } from 'react';
import { UploadCloud, X, Loader2, RefreshCw, ArrowLeftRight, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CloudinaryUpload({ value, onChange }) {
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate định dạng và dung lượng (vd: tối đa 5MB)
        if (!file.type.includes('image/')) {
            return toast.error('Vui lòng chọn file hình ảnh!');
        }
        if (file.size > 5 * 1024 * 1024) {
            return toast.error('Kích thước ảnh tối đa là 5MB!');
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (data.secure_url) {
                onChange(data.secure_url); // Trả link ảnh về cho trang CreateBlog
                toast.success('Tải ảnh lên thành công!');
            } else {
                throw new Error('Upload failed');
            }
        } catch (error) {
            console.error('Lỗi upload ảnh:', error);
            toast.error('Lỗi khi tải ảnh lên. Vui lòng thử lại.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full">
            {value ? (
                <>
                    <div className="flex flex-col items-center justify-center w-full py-4 border-2 border-dashed border-[var(--border-color)] rounded-lg bg-[var(--bg-secondary)]">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-[var(--text-muted)] hover:text-blue-600 transition mb-4">
                            <ArrowLeftRight className="w-4 h-4" />
                            <span>Change image</span>
                            <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={handleUpload}
                                disabled={isUploading}
                            />
                        </label>

                        {/* Ảnh xem trước (Căn giữa, bo góc) */}
                        <div className="relative group rounded-xl overflow-hidden shadow-sm border border-[var(--border-color)]">
                            <img
                                src={value}
                                alt="Blog thumbnail"
                                className="w-[220px] h-[130px] object-cover"
                            />
                        </div>
                    </div>
                </>
            ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[var(--border-color)] rounded-lg cursor-pointer bg-[var(--bg-secondary)] hover:opacity-80 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {isUploading ? (
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-3" />
                        ) : (
                            <UploadCloud className="w-8 h-8 text-[var(--text-muted)] mb-3" />
                        )}
                        <p className="mb-2 text-sm text-[var(--text-muted)] font-medium">
                            {isUploading ? 'Đang tải lên...' : 'Click to upload image'}
                        </p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={isUploading}
                    />
                </label>
            )}
        </div>
    );
}