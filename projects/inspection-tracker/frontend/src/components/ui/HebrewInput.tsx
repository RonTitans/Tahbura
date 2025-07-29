import React, { forwardRef } from 'react';

interface HebrewInputProps {
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password' | 'date' | 'datetime-local' | 'time';
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name?: string;
}

const cn = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const HebrewInput = forwardRef<HTMLInputElement, HebrewInputProps>(({
  label,
  placeholder,
  error,
  required = false,
  type = 'text',
  className,
  inputClassName,
  disabled = false,
  value,
  onChange,
  name,
  ...props
}, ref) => {
  return (
    <div className={cn('rtl-container', className)}>
      <label className="block text-sm font-medium text-gray-700 hebrew-font mb-1">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      
      <input
        ref={ref}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm hebrew-font',
          'placeholder-gray-400 text-right',
          'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500',
          inputClassName
        )}
        {...props}
      />
      
      {error && (
        <p className="mt-1 text-sm text-red-600 hebrew-font text-right">
          {error}
        </p>
      )}
    </div>
  );
});

HebrewInput.displayName = 'HebrewInput';