import { Link } from 'react-router-dom';
import { stripHtml } from '../../lib/utils';

export default function CardBlog({ post }) {
    const excerpt = stripHtml(post.content).substring(0, 120) + '...';

    return (
        <div className="bg-[var(--bg-main)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-md transition-all duration-300 flex flex-col h-full group hover:scale-[1.03] hover:shadow-xl hover:border-indigo-300/50 cursor-pointer">
            {/* Thumbnail */}
            <Link to={`/post/${post._id}`} className="overflow-hidden aspect-video relative">
                <img
                    src={post.image || 'https://placehold.co/600x400?text=No+Image'}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                />
            </Link>

            {/* Nội dung Card */}
            <div className="p-5 flex flex-col flex-1">
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags?.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-2.5 py-1 bg-[#5A52F6]/10 text-[#5A52F6] text-xs font-medium rounded-full transition-colors">
                            #{tag}
                        </span>
                    ))}
                </div>

                {/* Tiêu đề */}
                <Link to={`/post/${post._id}`}>
                    <h3 className="text-lg font-semibold text-[var(--text-main)] mb-2 line-clamp-1 hover:text-[#5A52F6] transition-colors">
                        {post.title}
                    </h3>
                </Link>

                {/* Nội dung rút gọn */}
                <p className="text-[var(--text-muted)] text-xs mb-4 line-clamp-3 flex-1 transition-colors">
                    {excerpt}
                </p>

            </div>
        </div>
    );
}