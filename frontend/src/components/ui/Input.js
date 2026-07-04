import React from "react";

const Input = ({
  label,
  error,
  className = "",
  ...props
}) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm text-gray-600 mb-1.5 font-medium">
          {label}
        </label>
      )}

      <input
        className={`w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition ${
          error
            ? "border-red-400 focus:ring-red-300"
            : "border-gray-200"
        }`}
        {...props}
      />

      {error && (
        <p className="text-red-500 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};

export default Input;
