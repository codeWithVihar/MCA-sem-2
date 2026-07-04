import React from "react";
import { Package } from "lucide-react";

const EmptyState = ({ icon: Icon = Package, title = "Nothing here", description = "", action }) => (
  <tr>
    <td colSpan="8" className="px-5 py-12 text-center">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <Icon size={28} className="text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
        {description && <p className="text-xs text-gray-400 mb-4">{description}</p>}
        {action}
      </div>
    </td>
  </tr>
);

export default EmptyState;
