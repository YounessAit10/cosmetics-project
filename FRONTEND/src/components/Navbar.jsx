import { Link } from 'react-router-dom';
import { ShoppingCart, Moon, Sun, Menu, X, User, LogOut, Package, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useTheme, useLanguage, useCart } from '../hooks';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const { t } = useTranslation();
  const { isDark, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const { getTotalItems } = useCart();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const cartCount = getTotalItems();

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-accent">Serenity</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
            >
              {t('navbar.home')}
            </Link>
            <Link
              to="/products"
              className="text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
            >
              {t('navbar.products')}
            </Link>
            {isAuthenticated && (
              <Link
                to="/orders"
                className="text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
              >
                {t('navbar.orders')}
              </Link>
            )}
            {isAdmin && (
              <Link
                to="/admin/products"
                className="text-gray-700 dark:text-gray-300 hover:text-accent transition-colors font-medium"
              >
                {t('navbar.admin')}
              </Link>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <select
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              className="px-3 py-1 bg-primary dark:bg-gray-800 text-gray-800 dark:text-white rounded-lg text-sm font-medium cursor-pointer border border-gray-300 dark:border-gray-700"
            >
              <option value="en">EN</option>
              <option value="fr">FR</option>
              <option value="ar">AR</option>
            </select>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-primary dark:bg-gray-800 text-gray-800 dark:text-yellow-400 hover:bg-secondary dark:hover:bg-gray-700 transition-colors"
              aria-label="Toggle dark mode"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 rounded-lg bg-primary dark:bg-gray-800 text-gray-800 dark:text-white hover:bg-secondary dark:hover:bg-gray-700 transition-colors"
                >
                  <User size={20} />
                  <span className="hidden lg:inline text-sm font-medium">
                    {user?.firstName || user?.email?.split('@')[0]}
                  </span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User size={18} />
                      {t('navbar.profile')}
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Package size={18} />
                      {t('navbar.orders')}
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/products"
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings size={18} />
                        {t('navbar.admin')}
                      </Link>
                    )}
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <LogOut size={18} />
                      {t('navbar.logout')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                {t('auth.login')}
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
            >
              <ShoppingCart size={24} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-700 dark:text-gray-300"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/"
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navbar.home')}
            </Link>
            <Link
              to="/products"
              className="block py-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              {t('navbar.products')}
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/orders"
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navbar.orders')}
                </Link>
                <Link
                  to="/profile"
                  className="block py-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('navbar.profile')}
                </Link>
              </>
            )}
            {isAdmin && (
              <Link
                to="/admin/products"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-accent transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('navbar.admin')}
              </Link>
            )}
            {!isAuthenticated && (
              <Link
                to="/login"
                className="block py-2 text-accent font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {t('auth.login')}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
