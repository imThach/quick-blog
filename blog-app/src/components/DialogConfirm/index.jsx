import { AlertTriangle, Loader2, X } from 'lucide-react';

export default function DialogConfirm({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    isLoading
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 transition-colors">

                {/* Header Dialog */}
                <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between transition-colors">
                    <div className="flex items-center gap-2 text-red-500">
                        <AlertTriangle className="w-5 h-5" />
                        <h3 className="text-lg font-bold text-[var(--text-main)] transition-colors">{title || 'Xác nhận xóa'}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors disabled:opacity-50"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nội dung Dialog */}
                <div className="px-6 py-4">
                    <p className="text-[var(--text-muted)] text-sm transition-colors">
                        {message || 'Bạn có chắc chắn muốn thực hiện hành động này? Dữ liệu sẽ không thể khôi phục.'}
                    </p>
                </div>

                {/* Footer Buttons */}
                <div className="px-6 py-4 bg-[var(--bg-secondary)] flex justify-end gap-3 transition-colors">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="px-4 py-2 bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] text-sm font-medium rounded-md hover:bg-[var(--bg-secondary)] transition-colors disabled:opacity-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors flex items-center justify-center min-w-[80px] disabled:opacity-70"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xóa'}
                    </button>
                </div>

            </div>
        </div>
    );
}