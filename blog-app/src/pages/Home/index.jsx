import { useState, useEffect, useMemo } from 'react';
import axiosClient from '../../components/services/api/axiosClient';
import CardBlog from '../../components/CardBlog';
import toast from 'react-hot-toast';
import LottieReact from 'lottie-react';
import emptyAnimation from '../../assets/animations/empty-state.json';

const Lottie = LottieReact.default || LottieReact;

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeSearch, setActiveSearch] = useState('');

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axiosClient.get('/posts');
                setPosts(response.items || []);
            } catch (error) {
                toast.error('Không thể tải danh sách bài viết!');
                console.error('Lỗi fetch posts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleSearch = () => {
        setActiveSearch(searchTerm);
    };

    const filteredPosts = useMemo(() => {
        return posts.filter(post =>
            post.title?.toLowerCase().includes(activeSearch.toLowerCase())
        );
    }, [posts, activeSearch]);

    return (
        <div className="space-y-12">
            {/* Banner & Search Section */}
            <div className="text-center max-w-3xl mx-auto pt-10 px-4">
                <h1 className="text-3xl md:text-6xl font-semibold text-[var(--text-main)] mb-6 tracking-tight transition-colors">
                    Your own <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">blogging</span> platform.
                </h1>
                <p className="text-md text-[var(--text-muted)] mb-8 leading-relaxed transition-colors">
                    This is your space to think out loud, to share what matters, and to write without filters. Whether it's one word or a thousand, your story starts right here.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-lg mx-auto">
                    <input
                        type="text"
                        placeholder="Enter search title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="w-full pl-4 pr-24 py-3 border border-[var(--border-color)] focus:outline-none bg-[var(--bg-main)] text-[var(--text-main)] rounded-md transition-colors"
                    />
                    <button
                        onClick={handleSearch}
                        className="absolute right-2 top-2 bottom-2 px-7 flex items-center justify-center bg-[#5A52F6] text-white border border-[#5A52F6] rounded hover:bg-indigo-600 transition-colors cursor-pointer text-sm font-medium"
                    >Search
                    </button>
                </div>
            </div>

            {/* Posts Section */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="rounded-xl border border-[var(--border-color)] overflow-hidden animate-pulse">
                            <div className="bg-[var(--bg-secondary)] aspect-video w-full"></div>
                            <div className="p-5 space-y-4">
                                <div className="h-4 bg-[var(--bg-secondary)] rounded w-1/3"></div>
                                <div className="h-6 bg-[var(--bg-secondary)] rounded w-3/4"></div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-[var(--bg-secondary)] rounded"></div>
                                    <div className="h-4 bg-[var(--bg-secondary)] rounded w-5/6"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="text-center py-20 bg-[var(--bg-main)] rounded-xl border border-dashed border-[var(--border-color)] transition-colors">
                    <div className="w-64 h-64 mx-auto mb-4">
                        <Lottie animationData={emptyAnimation} loop={true} />
                    </div>
                    <h2 className="text-xl font-semibold text-[var(--text-main)]">
                        {activeSearch ? 'We could not find any blog' : 'Chưa có bài viết nào'}
                    </h2>
                    <p className="text-[var(--text-muted)] mt-2">
                        {activeSearch ? 'Please try again with a different search query.' : 'Hãy trở thành người đầu tiên viết bài!'}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredPosts.map((post) => (
                        <CardBlog key={post._id} post={post} />
                    ))}
                </div>
            )}
        </div>
    );
}