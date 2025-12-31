import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  isLoading, 
  className = '', 
  disabled,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center px-5 py-2.5 text-sm font-bold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm active:scale-95 tracking-wide";
  
  const variants = {
    primary: "border-transparent text-white bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 shadow-primary-500/20",
    secondary: "border-transparent text-primary-900 bg-primary-100 hover:bg-primary-200 focus:ring-primary-500",
    outline: "border-2 border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 focus:ring-slate-500",
    danger: "border-transparent text-white bg-red-600 hover:bg-red-700 focus:ring-red-500",
    ghost: "border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 shadow-none"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {children}
    </button>
  );
};

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="mb-5">
    {label && <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{label}</label>}
    <input
      className={`appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium shadow-sm ${className}`}
      {...props}
    />
  </div>
);

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }> = ({ label, children, className = '', ...props }) => (
  <div className="mb-5">
    {label && <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1">{label}</label>}
    <div className="relative">
      <select
        className={`appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium shadow-sm cursor-pointer ${className}`}
        {...props}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-600">
        <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

export const Card: React.FC<{ children: React.ReactNode; className?: string; title?: string }> = ({ children, className = '', title }) => (
  <div className={`bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-200 overflow-hidden ${className}`}>
    {title && (
      <div className="px-6 py-5 border-b border-slate-100 bg-white">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
      </div>
    )}
    <div className="p-6">{children}</div>
  </div>
);

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'blue' | 'yellow' | 'gray' | 'red' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    blue: 'bg-blue-100 text-blue-800 border border-blue-200',
    yellow: 'bg-amber-100 text-amber-800 border border-amber-200',
    gray: 'bg-slate-100 text-slate-800 border border-slate-200',
    red: 'bg-rose-100 text-rose-800 border border-rose-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${colors[color]}`}>
      {children}
    </span>
  );
};