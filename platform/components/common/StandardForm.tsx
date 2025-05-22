"use client";

import React, { ReactNode } from 'react';
import { getInputClasses, getButtonClasses, getFormGroupClasses, getLabelClasses, getAlertClasses } from '@/lib/utils';

type FormProps = {
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
  loading?: boolean;
  errorMessage?: string;
  successMessage?: string;
  submitText?: string;
  loadingText?: string;
  className?: string;
};

type InputProps = {
  id: string;
  label: string; 
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  minLength?: number;
  maxLength?: number;
};

export const FormInput = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  className = '',
  minLength,
  maxLength,
}: InputProps) => {
  const hasError = !!error;

  return (
    <div className={getFormGroupClasses('md') + ' ' + className}>
      <label htmlFor={id} className={getLabelClasses()}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        minLength={minLength}
        maxLength={maxLength}
        className={getInputClasses('default', hasError)}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default function StandardForm({
  onSubmit,
  children,
  loading = false,
  errorMessage,
  successMessage,
  submitText = 'Submit',
  loadingText = 'Submitting...',
  className = '',
}: FormProps) {
  return (
    <form onSubmit={onSubmit} className={`w-full p-6 bg-black/30 rounded-lg border border-white/10 backdrop-blur-sm ${className}`}>
      {errorMessage && (
        <div className={getAlertClasses('error') + ' mb-4'}>
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className={getAlertClasses('success') + ' mb-4'}>
          {successMessage}
        </div>
      )}

      {children}

      <button
        type="submit"
        disabled={loading}
        className={getButtonClasses('primary', 'md', true)}
      >
        {loading ? loadingText : submitText}
      </button>
    </form>
  );
} 