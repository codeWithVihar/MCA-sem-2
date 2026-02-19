import React, { useEffect, useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    API.get("/audit")
      .then((res) => setLogs(res.data))
      .catch((err) => {
        console.log(err);
        alert("Failed to load audit logs");
      });
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">Audit Logs</h2>

      <div className="bg-white rounded-xl shadow-md overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">Action</th>
              <th className="p-4">Performed By</th>
              <th className="p-4">Entity</th>
              <th className="p-4">Details</th>
              <th className="p-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="p-4 font-medium">{log.action}</td>
                <td className="p-4">
                  {log.performedBy?.name} ({log.performedBy?.role})
                </td>
                <td className="p-4">{log.entityType}</td>
                <td className="p-4">
                  {log.details?.invoiceNumber ||
                    log.details?.productName ||
                    JSON.stringify(log.details)}
                </td>
                <td className="p-4">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default AuditLogs;
