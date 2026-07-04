import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";
import { toast } from "react-toastify";
import { Activity, ClipboardList } from "lucide-react";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(50);

  useEffect(() => {
    API.get("/audit")
      .then((res) => setLogs(res.data))
      .catch((err) => {
        toast.error("Failed to load audit logs");
      });
  }, []);

  const getActionColor = (action) => {
    switch(action) {
      case "CREATE": return "bg-emerald-100 text-emerald-700";
      case "UPDATE": return "bg-blue-100 text-blue-700";
      case "DELETE": return "bg-rose-100 text-rose-700";
      case "LOGIN": return "bg-indigo-100 text-indigo-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const visibleLogs = logs.slice(0, visibleCount);
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
            <Activity size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Audit Logs</h2>
            <p className="text-sm text-gray-400 mt-1">Track system activity and user actions</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-card overflow-x-auto overflow-y-auto max-h-[calc(100vh-240px)] relative border border-gray-100">
          <table className="w-full text-left">
            <thead className="sticky top-0 z-10 bg-indigo-600 text-white shadow-sm">
              <tr>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">Action</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">Entity</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">Details</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">Performed By</th>
                <th className="px-5 py-4 text-xs font-semibold uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {visibleLogs.map((log) => (
                <tr key={log._id} className="hover:bg-gray-50 transition text-sm">
                  <td className="px-5 py-4 font-medium">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${getActionColor(log.action)}`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-gray-600 font-medium">{log.entityType}</td>
                  <td className="px-5 py-4 text-gray-500 max-w-xs truncate">
                    {log.details?.invoiceNumber || log.details?.productName || JSON.stringify(log.details)}
                  </td>
                  <td className="px-5 py-4">
                    {log.performedBy ? (
                      <div>
                        <div className="font-medium text-gray-800">{log.performedBy.name}</div>
                        <div className="text-xs text-gray-400">{log.performedBy.role}</div>
                      </div>
                    ) : (
                      <span className="text-gray-400 italic">System</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-gray-500 whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString(undefined, {
                      year: 'numeric', month: 'short', day: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr><td colSpan="5" className="px-5 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                      <ClipboardList size={28} className="text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">No activity logs found</p>
                    <p className="text-xs text-gray-400 mt-1">System actions and events will appear here</p>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
        {logs.length > visibleCount && (
          <div className="text-center py-4 border-t border-gray-100">
            <button
              onClick={() => setVisibleCount(prev => prev + 50)}
              className="text-indigo-600 text-sm font-medium hover:text-indigo-800 transition"
            >
              Load More ({logs.length - visibleCount} remaining)
            </button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AuditLogs;
