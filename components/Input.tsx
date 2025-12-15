import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full space-y-1">
      {label && <label className="block text-sm font-medium text-gray-700 ml-1">{label}</label>}
      <input
        className={`w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-gray-400 ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>
  );
};