import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Moon, Sun, NotepadText, SquareUserRound, LogOut, UserSquare } from 'lucide-react';
import { useAuth } from '../context/authContext';
import { useTheme } from '../context/ThemeContext';
import useAuthorization from '../../hooks/useAuthorization';
import logoImg from '../../assets/logo.png';

export default function Header() {
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isDarkMode, toggleTheme } = useTheme();
    const menuRef = useRef(null);

    const { isAdmin } = useAuthorization();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 w-full bg-[var(--bg-main)] transition-colors duration-300">
            <div className="container mx-auto px-4 sm:px-16 md:px-30 h-16 flex items-center justify-between">

                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 text-xl font-bold text-[var(--text-main)] transition-opacity hover:opacity-80">
                    <img src={logoImg} alt="Blog Logo" className="h-8 md:h-12 w-auto object-contain" />
                </Link>

                {/* Navigation & Actions */}
                <div className="flex items-center gap-2.5 sm:gap-4">

                    {/* Nút Create Blog */}
                    <Link
                        to="/create-blog"
                        className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2 bg-[#5044E5] text-white rounded-lg hover:bg-blue-700 transition-colors text-[13px] sm:text-sm font-medium whitespace-nowrap"
                    >
                        + Create Blog
                    </Link>
                    {/* Nút toggle Light/Dark Mode */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 text-[var(--text-muted)] hover:bg-[var(--bg-secondary)] rounded-full transition-colors" title="Đổi giao diện">
                        {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </button>

                    {/* User Menu */}
                    <div className="relative cursor-pointer" ref={menuRef}>
                        <div
                            className="p-2 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            <User className="h-5 w-5 text-[var(--text-muted)]" />

                        </div>

                        {/* Dropdown Menu */}
                        <div className={`absolute right-0 mt-2 w-48 bg-[var(--bg-main)] border border-[var(--border-color)] rounded-lg shadow-lg py-1 origin-top-right transition-all duration-200 ${isMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible pointer-events-none'}`}>
                            {!user ? (
                                <>
                                    <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)]">Đăng nhập</Link>
                                    <Link to="/signup" onClick={() => setIsMenuOpen(false)} className="block px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)]">Đăng ký</Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/my-posts" onClick={() => setIsMenuOpen(false)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
                                    >
                                        <NotepadText className="h-4 w-4" />
                                        My posts
                                    </Link>

                                    {isAdmin && (
                                        <Link to="/user-management" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)]">
                                            <UserSquare className="h-4 w-4" />
                                            User Management
                                        </Link>
                                    )}

                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-[var(--text-main)] hover:bg-[var(--bg-secondary)]"
                                    >
                                        <LogOut className="h-4 w-4" />
                                        Log out
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </header>
    );
}