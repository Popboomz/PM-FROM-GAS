import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-xl font-medium transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200",
    secondary: "bg-orange-500 text-white hover:bg-orange-600 shadow-md shadow-orange-200",
    outline: "border-2 border-gray-200 text-gray-700 hover:bg-gray-50",
    ghost: "text-blue-600 hover:bg-blue-50"
  };

  const sizes = "px-6 py-3.5 text-base";
  const width = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes} ${width} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};