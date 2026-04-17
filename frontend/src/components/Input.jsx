import React, { forwardRef } from 'react';

const Input = forwardRef(({ label, icon: Icon, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label className="text-sm font-semibold text-slate-700 mb-1.5 ml-1">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all duration-300 shadow-sm ${Icon ? 'pl-10' : ''} ${error ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' : ''}`}
          {...props}
        />
      </div>
      {error && <span className="text-xs text-red-500 mt-1.5 ml-1">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
