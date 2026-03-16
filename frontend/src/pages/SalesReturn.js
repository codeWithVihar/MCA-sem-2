import React, { useState } from "react";
import API from "../services/api";
import Layout from "../components/Layout";

const SalesReturn = () => {

  const [invoiceId, setInvoiceId] = useState("");
  const [sale, setSale] = useState(null);
  const [returns, setReturns] = useState({});
  const [reason, setReason] = useState("");

  const fetchSale = async () => {

    try {

      const res = await API.get(`/sales/${invoiceId}`);

      setSale(res.data);

    } catch (error) {

      console.log(error);
      alert("Invoice not found");

    }

  };

  const handleQtyChange = (productId, qty) => {

    setReturns({
      ...returns,
      [productId]: qty
    });

  };

  const handleReturn = async () => {

    try {

      const items = Object.keys(returns).map((id) => ({
        productId: id,
        quantity: Number(returns[id])
      }));

      await API.post("/sales-return", {
        saleId: invoiceId,   // send invoice number
        items,
        reason
      });

      alert("Return processed successfully");

      setSale(null);
      setReturns({});
      setReason("");

    } catch (error) {

      console.log(error);
      alert("Return failed");

    }

  };

  return (

    <Layout>

      <h2 className="text-2xl font-semibold mb-6">
        Sales Return
      </h2>

      {/* Invoice Search */}

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <div className="flex gap-4">

          <input
            className="border p-3 rounded-lg flex-1"
            placeholder="Enter Invoice Number (Example: INV-123456)"
            value={invoiceId}
            onChange={(e) => setInvoiceId(e.target.value)}
          />

          <button
            onClick={fetchSale}
            className="bg-primary px-6 py-3 rounded-lg"
          >
            Load Invoice
          </button>

        </div>

      </div>

      {/* Sale Items */}

      {sale && (

        <div className="bg-white p-6 rounded-xl shadow">

          <h3 className="font-semibold mb-4">
            Invoice: {sale.invoiceNumber}
          </h3>

          <table className="w-full text-left">

            <thead className="bg-gray-100">

              <tr>
                <th className="p-3">Product</th>
                <th className="p-3">Sold Qty</th>
                <th className="p-3">Return Qty</th>
              </tr>

            </thead>

            <tbody>

              {sale.items.map((item) => {

  if (!item.product) return null;

  return (

    <tr key={item.product._id} className="border-b">

      <td className="p-3">
        {item.product?.productName}
      </td>

      <td className="p-3">
        {item.quantitySold}
      </td>

      <td className="p-3">

        <input
          type="number"
          min="0"
          max={item.quantitySold}
          className="border p-2 rounded w-24"
          onChange={(e) =>
            handleQtyChange(
              item.product._id,
              e.target.value
            )
          }
        />

      </td>

    </tr>

  );

})}

            </tbody>

          </table>

          {/* Reason */}

          <div className="mt-6">

            <textarea
              placeholder="Return reason"
              className="border p-3 rounded w-full"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

          </div>

          {/* Submit */}

          <button
            onClick={handleReturn}
            className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg"
          >
            Process Return
          </button>

        </div>

      )}

    </Layout>

  );

};

export default SalesReturn;