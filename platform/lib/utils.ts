import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * A utility function for conditionally joining class names together
 * Combines clsx for conditional classes and tailwind-merge to handle Tailwind CSS class conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Button variant styling
 * 
 * @param variant - The button style variant
 * @returns Tailwind classes for the button
 */
export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'light' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  fullWidth: boolean = false,
) => {
  const baseClasses = "font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-60 disabled:cursor-not-allowed";
  const widthClass = fullWidth ? "w-full" : "";
  
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };
  
  
  const variantClasses = {
    primary: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-400",
    secondary: "bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-400",
    outline: "bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 hover:text-white focus:ring-gray-500",
    light: "bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400",
  };
  
  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass}`;
};

/**
 * Input field styling
 * 
 * @param variant - The input style variant
 * @returns Tailwind classes for input fields
 */
export const getInputClasses = (
  variant: 'default' | 'dark' | 'bordered' = 'default',
  hasError: boolean = false
) => {
  const baseClasses = "w-full rounded focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed";
  
  
  const variantClasses = {
    default: "p-2 bg-black/50 border border-white/20 text-white focus:border-purple-500",
    dark: "p-2 bg-gray-800 border border-gray-700 text-white focus:border-purple-500",
    bordered: "p-2 bg-transparent border border-gray-600 text-white focus:border-purple-500",
  };
  
  const errorClasses = hasError ? "border-red-500 focus:border-red-500" : "";
  
  return `${baseClasses} ${variantClasses[variant]} ${errorClasses}`;
};

/**
 * Form group wrapper styling
 * 
 * @returns Tailwind classes for form groups
 */
export const getFormGroupClasses = (
  marginBottom: 'sm' | 'md' | 'lg' = 'md',
) => {
  const marginClasses = {
    sm: "mb-2",
    md: "mb-4",
    lg: "mb-6",
  };
  
  return marginClasses[marginBottom];
};

/**
 * Form label styling
 * 
 * @returns Tailwind classes for form labels
 */
export const getLabelClasses = (
  size: 'sm' | 'md' = 'md',
) => {
  const baseClasses = "block text-gray-300 mb-1";
  
  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
  };
  
  return `${baseClasses} ${sizeClasses[size]}`;
};

/**
 * Card container styling
 * 
 * @param variant - The card style variant
 * @returns Tailwind classes for card containers
 */
export const getCardClasses = (
  variant: 'default' | 'dark' | 'gradient' = 'default',
  padding: 'sm' | 'md' | 'lg' = 'md',
) => {
  const baseClasses = "rounded-lg border";
  
  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };
  
  const variantClasses = {
    default: "bg-gray-800/50 border-gray-700",
    dark: "bg-gray-900/70 backdrop-blur-sm border-gray-800",
    gradient: "bg-gradient-to-br from-gray-900 to-gray-800 border-purple-500/30",
  };
  
  return `${baseClasses} ${paddingClasses[padding]} ${variantClasses[variant]}`;
};

/**
 * Alert/notification styling
 * 
 * @param type - The alert type
 * @returns Tailwind classes for alerts
 */
export const getAlertClasses = (
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
) => {
  const baseClasses = "p-3 rounded-lg border";
  
  const typeClasses = {
    info: "bg-blue-900/30 border-blue-800 text-blue-400",
    success: "bg-green-900/30 border-green-700 text-green-400",
    warning: "bg-yellow-900/30 border-yellow-700 text-yellow-400",
    error: "bg-red-900/30 border-red-800 text-red-400",
  };
  
  return `${baseClasses} ${typeClasses[type]}`;
};

