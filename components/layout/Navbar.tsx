'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiMenu, FiX, FiUser, FiLogOut, FiHome, FiFileText, FiSettings, FiSun, FiMoon, FiBook } from 'react-icons/fi';
import { isAuthenticated, isStaff, getUser, clearTokens } from '@/lib/auth';
import { authAPI } from '@/lib/api';
import { useTheme } from '@/contexts/ThemeContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [staff, setStaff] = useState(false);
  const [username, setUsername] = useState('');
  const router = useRouter();
  const { isDarkMode, toggleTheme } = useTheme();

  // Fonction pour mettre à jour l'état d'authentification
  const updateAuthState = () => {
    const isAuth = isAuthenticated();
    const isStaffUser = isStaff();
    const user = getUser();
    
    setAuthenticated(isAuth);
    setStaff(isStaffUser);
    setUsername(user?.username || '');
  };

  useEffect(() => {
    // Vérifier l'état initial
    updateAuthState();

    // Écouter les changements de pathname (navigation)
    updateAuthState();

    // Vérifier périodiquement (toutes les secondes)
    const interval = setInterval(() => {
      updateAuthState();
    }, 1000);

    // Écouter les changements de storage (connexion/déconnexion dans un autre onglet)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'access_token' || e.key === 'user') {
        updateAuthState();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await authAPI.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearTokens();
      setAuthenticated(false);
      setStaff(false);
      router.push('/');
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50 transition-colors duration-300">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              OC
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">My World</span>
          </Link>

          {/* Desktop Navigation */}
                 <div className="hidden md:flex items-center space-x-6">
                   <Link href="/" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
                     <FiHome />
                     <span>Home</span>
                   </Link>
                   <Link href="/blog" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
                     <FiFileText />
                     <span>Blog</span>
                   </Link>
                  <Link href="/academy" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Academy</span>
                  </Link>
                  <Link href="/docs" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
                    <FiBook />
                    <span>Docs</span>
                  </Link>

           {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FiSun className="text-yellow-500" size={20} />
              ) : (
                <FiMoon className="text-gray-700" size={20} />
              )}
            </button>
            
            {authenticated ? (
              <>
                {staff && (
                  <Link href="/admin" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
                    <FiSettings />
                    <span>Admin</span>
                  </Link>
                )}
                <div className="flex items-center space-x-4">
                  <Link href="/profile" className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
                    <FiUser />
                    <span>{username}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition"
                  >
                    <FiLogOut />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button & Dark mode toggle */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <FiSun className="text-yellow-500" size={20} />
              ) : (
                <FiMoon className="text-gray-700" size={20} />
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {isOpen ? (
                <FiX size={24} className="text-gray-900 dark:text-white" />
              ) : (
                <FiMenu size={24} className="text-gray-900 dark:text-white" />
              )}
            </button>
          </div>
        </div>

               {/* Mobile Navigation */}
               {isOpen && (
                 <div className="md:hidden pb-4 space-y-2">
                   <Link
                     href="/"
                     className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition"
                     onClick={() => setIsOpen(false)}
                   >
                     Home
                   </Link>
                   <Link
                     href="/blog"
                     className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition"
                     onClick={() => setIsOpen(false)}
                   >
                     Blog
                   </Link>
                  <Link
                    href="/academy"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Academy
                  </Link>
                  <Link
                    href="/docs"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    📚 Docs
                  </Link>
           
           {authenticated ? (
              <>
                {staff && (
                  <Link
                    href="/admin"
                    className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition"
                  onClick={() => setIsOpen(false)}
                >
                  Profile ({username})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="block px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition"
                  onClick={() => setIsOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition text-center"
                  onClick={() => setIsOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

