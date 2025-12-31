import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Car } from 'lucide-react';
import { Role } from '../types';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role') as Role | null;
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  // Don't show navbar on auth pages for a cleaner look
  if (isAuthPage) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2.5 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <Car className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">ReCarma</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {token ? (
              <>
                <div className="hidden md:flex items-center gap-3 text-sm bg-slate-50 px-4 py-2 rounded-full border border-slate-200 shadow-sm">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary-700" />
                  </div>
                  <div className="flex flex-col leading-none">
                     <span className="font-semibold text-slate-900">{user?.name || 'User'}</span>
                     <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{role}</span>
                  </div>
                </div>
                
                {role === Role.ADMIN && (
                   <Link to="/admin" className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">Admin</Link>
                )}

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;