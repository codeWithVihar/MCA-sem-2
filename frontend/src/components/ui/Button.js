import React from "react";

const variants = {
  primary:
    "bg-primary text-gray-800 hover:bg-secondary hover:text-white transition",
  secondary:
    "bg-secondary text-white hover:bg-[#b6a4ff] transition",
  danger:
    "bg-red-500 text-white hover:bg-red-600 transition",
  success:
    "bg-green-500 text-white hover:bg-green-600 transition",
  ghost:
    "bg-gray-200 text-gray-700 hover:bg-gray-300 transition",
};

const sizes = {
  sm: "px-3 py-1 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-6 py-3 text-base rounded-xl",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`font-medium ${variants[variant]} ${sizes[size]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
