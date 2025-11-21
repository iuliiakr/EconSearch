import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = "px-6 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed border-2";
  
  const variants = {
    primary: "bg-academic-text text-white border-academic-text hover:bg-white hover:text-academic-text",
    secondary: "bg-gray-200 text-academic-text border-gray-200 hover:border-academic-text",
    outline: "bg-transparent text-academic-text border-academic-text hover:bg-academic-text hover:text-white"
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
