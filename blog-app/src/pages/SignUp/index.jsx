import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../components/context/authContext';
import { Hexagon } from 'lucide-react';

export default function SignUp() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !password) return;

        setIsSubmitting(true);
        try {
            await register(username, email, password);
        } catch (error) { //Lỗi được xử lý trong context, nên không cần toast ở đây
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-950 via-blue-700 to-cyan-400 p-4">
            <div className="bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg shadow-2xl w-full max-w-md p-8 transition-colors">

                <div className="flex justify-center mb-8">
                    <Hexagon className="w-16 h-16 text-blue-800 fill-current" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <div>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 border border-[var(--border-color)] bg-[var(--bg-main)] text-[var(--text-main)] rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 bg-[#5A52F6] hover:bg-indigo-600 text-white text-sm font-semibold rounded transition-colors flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed mt-2"
                    >
                        {isSubmitting ? (
                            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-[var(--text-muted)] transition-colors">
                    Already have an account?{' '}
                    <Link to="/login" className="text-[#5A52F6] hover:underline">
                        Login
                    </Link>
                </div>

            </div>
        </div>
    );
}