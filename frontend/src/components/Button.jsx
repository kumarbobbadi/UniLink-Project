import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:shadow-lg hover:scale-105",
    secondary: "bg-primary-100 text-primary-700 hover:bg-primary-200",
    outline: "border-2 border-primary-500 text-primary-600 hover:bg-primary-50",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
  };
  
  const styles = `${baseStyles} ${variants[variant]} px-5 py-2.5 ${className}`;
  
  return (
    <button className={styles} {...props}>
      {children}
    </button>
  );
}
