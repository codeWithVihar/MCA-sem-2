import React from "react";

const presets = {
  IN_STOCK: "bg-green-100 text-green-700",
  LOW_STOCK: "bg-yellow-100 text-yellow-700",
  OUT_OF_STOCK: "bg-red-100 text-red-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  DISPATCHED: "bg-blue-100 text-blue-700",
  COMPLETED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  Active: "bg-green-100 text-green-700",
  Inactive: "bg-gray-100 text-gray-500",
  Discontinued: "bg-red-100 text-red-700",
};

const Badge = ({ status, className = "" }) => {
  const colorClass = presets[status] || "bg-gray-100 text-gray-700";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass} ${className}`}
    >
      {status}
    </span>
  );
};

export default Badge;
