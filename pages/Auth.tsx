import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Button, Input, Select } from '../components/ui';
import { Role } from '../types';
import { AlertCircle, Car, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

const Auth: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === '/login';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: Role.OWNER
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [longLoading, setLongLoading] = useState(false);

  // Effect to track long loading times (server wake up)
  useEffect(() => {
    let timer: any;
    if (loading) {
      timer = setTimeout(() => setLongLoading(true), 3000); // If loading > 3s
    } else {
      setLongLoading(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSuccess = (response: any) => {
      // 1. Check for valid token immediately (Auto-login or Login success)
      if (response.token) {
          const userRole = response.role || (isLogin ? null : formData.role);
          
          if (!userRole) {
              setError("Authentication successful but role is missing.");
              return;
          }

          localStorage.setItem('token', response.token);
          localStorage.setItem('role', userRole);
          
          if (response.user) {
            localStorage.setItem('user', JSON.stringify(response.user));
          } else {
             // Fallback for user name if missing in response
             localStorage.setItem('user', JSON.stringify({ name: formData.name || 'User', email: formData.email }));
          }
          
          // Redirect based on role
          if (userRole === Role.OWNER) navigate('/owner');
          else if (userRole === Role.DEALER) navigate('/dealer');
          else if (userRole === Role.ADMIN) navigate('/admin');
          else navigate('/');
          return;
      }

      // 2. If no token, but it was a Registration attempt (and axios didn't throw error)
      // We assume registration was successful and redirect to login.
      if (!isLogin) {
          // Use a small timeout to let the UI update or simply redirect
          alert("Account created successfully! Please sign in with your credentials.");
          navigate('/login');
          return;
      }

      // 3. Login attempt with no token = Error
      setError("Server returned an invalid response (missing access token).");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Clear any existing stale tokens before attempting new auth
    localStorage.clear();

    try {
      let response;
      if (isLogin) {
        response = await authService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        response = await authService.register(formData);
      }

      // Check if response exists
      if (response) {
        // Some backends might return success: false for logic errors
        if (response.success === false) {
           setError(response.message || 'Operation failed');
        } else {
           handleSuccess(response);
        }
      } else {
         setError('Empty response from server.');
      }
    } catch (err: any) {
      console.error("Auth Error:", err);
      
      let errorMsg = 'Authentication failed.';

      if (err.response) {
          // The server responded with a status code that falls out of the range of 2xx
          const data = err.response.data;
          
          // Handle case where data is a string (html error or plain text) vs object
          if (typeof data === 'string') {
              errorMsg = data;
          } else if (data && data.message) {
              errorMsg = data.message;
          } else if (data && data.error) {
              errorMsg = data.error;
          } else {
              errorMsg = `Server Error (${err.response.status})`;
          }
      } else if (err.request) {
          // The request was made but no response was received
          errorMsg = 'No response from server. Please check your internet connection.';
      } else {
          // Something happened in setting up the request
          errorMsg = err.message || 'An unexpected error occurred.';
      }
      
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary-600 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 to-primary-900"></div>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
        
        <div className="relative z-10 max-w-lg px-8 text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
            <Car className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            {isLogin ? 'Welcome Back!' : 'Join ReCarma Today'}
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed mb-8">
            The smartest way to manage end-of-life vehicles. Connect with authorized dealers and ensure responsible recycling.
          </p>
          <div className="flex flex-col gap-4 items-start mx-auto w-fit">
             <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Instant Valuation</span>
             </div>
             <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Authorized Dealers Only</span>
             </div>
             <div className="flex items-center gap-3 text-white/90">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
                <span>Hassle-free Pickup</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-md">
          <div className="lg:hidden mb-8 text-center">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-600 mb-4">
                <Car className="w-6 h-6 text-white" />
             </div>
             <h2 className="text-3xl font-bold text-slate-900">ReCarma</h2>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Link to={isLogin ? '/register' : '/login'} className="font-semibold text-primary-600 hover:text-primary-500 hover:underline transition-all">
                {isLogin ? 'Sign up for free' : 'Sign in'}
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-bold text-red-800">Authentication Error</h3>
                      <p className="text-sm font-medium text-red-700 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {longLoading && !error && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 animate-in fade-in">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-700">
                        Connecting to backend server...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {!isLogin && (
                <Input
                  label="Full Name"
                  name="name"
                  type="text"
                  required={!isLogin}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Alex Johnson"
                />
              )}

              <Input
                label="Email Address"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
              />

              <Input
                label="Password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              {!isLogin && (
                <Select label="I am a" name="role" value={formData.role} onChange={handleChange}>
                  <option value={Role.OWNER}>Vehicle Owner</option>
                  <option value={Role.DEALER}>Authorized Dealer</option>
                </Select>
              )}

              <Button
                type="submit"
                className="w-full py-3 text-base shadow-lg shadow-primary-500/30"
                isLoading={loading}
              >
                {isLogin ? 'Sign in' : 'Create Account'} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;