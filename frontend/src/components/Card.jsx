import React from 'react';

export default function Card({ children, className = '', hover = false }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm ${hover ? 'transition-all duration-300 hover:shadow-lg hover:scale-[1.02]' : ''} ${className}`}>
      {children}
    </div>
  );
}
