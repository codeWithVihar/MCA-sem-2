import React from "react";

const Table = ({ columns, children, className = "" }) => {
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden ${className}`}>
      <table className="w-full text-left">
        <thead className="bg-primary">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className={`p-4 text-sm font-semibold text-gray-700 ${col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};

export default Table;
