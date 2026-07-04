/**
 * Format a number as Indian Rupee currency.
 * @param {number} num
 * @returns {string} e.g. "₹1,23,456.00"
 */
export const formatCurrency = (num) =>
  `₹${Number(num || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  })}`;

/**
 * Format a date string to locale date+time.
 * @param {string|Date} date
 * @returns {string}
 */
export const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleString();
};

/**
 * Get Tailwind CSS classes for a stock status badge.
 * @param {string} status - "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK"
 * @returns {string}
 */
export const getStockBadgeClass = (status) => {
  switch (status) {
    case "LOW_STOCK":
      return "bg-yellow-100 text-yellow-700";
    case "OUT_OF_STOCK":
      return "bg-red-100 text-red-700";
    default:
      return "bg-green-100 text-green-700";
  }
};

/**
 * Get Tailwind CSS classes for an order status badge.
 * @param {string} status - "PENDING" | "DISPATCHED" | "COMPLETED" | "REJECTED"
 * @returns {string}
 */
export const getOrderStatusClass = (status) => {
  const styles = {
    PENDING: "bg-yellow-100 text-yellow-700",
    DISPATCHED: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-green-100 text-green-700",
    REJECTED: "bg-red-100 text-red-700",
  };
  return styles[status] || "bg-gray-100 text-gray-700";
};
