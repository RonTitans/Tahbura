import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface HebrewSelectProps {
  label: string;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
}

const cn = (...classes: (string | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const HebrewSelect: React.FC<HebrewSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className,
  name
}) => {
  return (
    <div className={cn('rtl-container', className)}>
      <label className="block text-sm font-medium text-gray-700 hebrew-font mb-1">
        {label}
        {required && <span className="text-red-500 mr-1">*</span>}
      </label>
      
      <select
        name={name}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cn(
          'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm hebrew-font',
          'bg-white text-right',
          'focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500',
          'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
          error && 'border-red-300 focus:ring-red-500 focus:border-red-500'
        )}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 hebrew-font text-right">
          {error}
        </p>
      )}
    </div>
  );
};