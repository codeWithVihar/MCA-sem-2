import React, { useEffect, useState } from "react";
import CustomerLayout from "../components/CustomerLayout";
import API from "../services/api";
import { 
  User, 
  Phone, 
  Package, 
  Receipt, 
  Check, 
  Truck, 
  Clock, 
  Box,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import LoadingBox from "../components/ui/LoadingBox";

/* ================= STATUS LOGIC ================= */
const steps = [
  { label: "Placed", status: "PENDING", icon: Clock },
  { label: "Dispatched", status: "DISPATCHED", icon: Truck },
  { label: "Completed", status: "COMPLETED", icon: Check },
];

const getStepIndex = (status) => {
  if (status === "COMPLETED") return 2;
  if (status === "DISPATCHED") return 1;
  return 0; // Default to PENDING
};

/* ================= TIMELINE UI ================= */
const Timeline = ({ status }) => {
  const currentStepIndex = getStepIndex(status);

  return (
    <div className="relative flex items-center justify-between mt-8 mb-4 w-full max-w-lg mx-auto">
      {/* Background Line */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0" />
      
      {/* Progress Line */}
      <div 
        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-600 rounded-full z-0 transition-all duration-500 ease-in-out" 
        style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
      />

      {/* Steps */}
      {steps.map((step, index) => {
        const isCompleted = index <= currentStepIndex;
        const isActive = index === currentStepIndex;
        const StepIcon = step.icon;

        return (
          <div key={step.label} className="relative z-10 flex flex-col items-center group">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-4 border-white shadow-sm transition-colors duration-300 ${
                isCompleted ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"
              } ${isActive ? "ring-4 ring-blue-100" : ""}`}
            >
              <StepIcon size={18} strokeWidth={2.5} />
            </div>
            <p className={`absolute -bottom-7 text-xs font-medium whitespace-nowrap ${
              isCompleted ? "text-gray-800" : "text-gray-400"
            }`}>
              {step.label}
            </p>
          </div>
        );
      })}
    </div>
  );
};

const CustomerProfile = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // NEW: State to toggle between latest order and all orders
  const [showAllOrders, setShowAllOrders] = useState(false);

  // Safely parse customer data
  const customer = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("customer")) || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!customer?.phone) {
      setIsLoading(false);
      return;
    }

    API.get(`/orders/customer/${customer.phone}`)
      .then((res) => {
        // Assuming your backend returns orders sorted newest-first.
        // If not, you can sort them here: res.data.sort((a, b) => new Date(b.date) - new Date(a.date))
        setOrders(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load your orders. Please try again later.");
        setIsLoading(false);
      });
  }, [customer?.phone]);

  // NEW: Determine which orders to show based on the toggle state
  const displayedOrders = showAllOrders ? orders : orders.slice(0, 1);

  /* ================= UI ================= */
  return (
    <CustomerLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        
        {/* PROFILE SECTION */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {customer?.name || "Guest User"}
              </h2>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Phone size={16} />
                <span>{customer?.phone || "No phone provided"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ORDERS SECTION */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 border-b border-gray-50 pb-4">
            <Package className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Order History</h2>
          </div>

          {/* LOADING STATE */}
          {isLoading && <LoadingBox text="Loading orders..." />}

          {/* ERROR STATE */}
          {!isLoading && error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !error && orders.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Box className="text-gray-300" size={40} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No orders yet</h3>
              <p className="text-gray-500">When you place an order, it will appear here.</p>
            </div>
          )}

          {/* ORDER LIST */}
          {!isLoading && !error && orders.length > 0 && (
            <div className="space-y-6">
              
              {/* Map through the sliced or full array */}
              {displayedOrders.map((order, index) => (
                <div
                  key={order._id}
                  className={`border p-6 rounded-xl transition-shadow duration-200 ${
                    index === 0 && !showAllOrders 
                      ? "border-blue-100 bg-blue-50/20 shadow-sm" // Highlight the latest order slightly
                      : "border-gray-200 bg-gray-50/30 hover:shadow-md"
                  }`}
                >
                  {/* HEADER */}
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        {index === 0 && (
                          <span className="bg-blue-100 text-blue-700 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                            Latest
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{order.totalAmount?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* ITEMS LIST */}
                  <div className="bg-white border border-gray-100 rounded-lg p-4 mb-6">
                    <ul className="divide-y divide-gray-50">
                      {order.items.map((i, idx) => (
                        <li key={idx} className="py-2 flex justify-between items-center first:pt-0 last:pb-0 text-sm">
                          <span className="text-gray-700 font-medium">
                            {i.product?.productName || "Unknown Product"}
                          </span>
                          <span className="text-gray-500 bg-gray-100 px-2 py-1 rounded-md text-xs">
                            Qty: {i.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* TIMELINE */}
                  <div className="py-4">
                    <Timeline status={order.status} />
                  </div>

                  {/* ACTION */}
                  {order.sale && (
                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => window.open(`/invoice/${order.sale}`, "_blank")}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors text-sm font-semibold shadow-sm"
                      >
                        <Receipt size={16} />
                        View Invoice
                      </button>
                    </div>
                  )}
                </div>
              ))}

              {/* TOGGLE PREVIOUS ORDERS BUTTON */}
              {orders.length > 1 && (
                <div className="flex justify-center mt-6 pt-4">
                  <button
                    onClick={() => setShowAllOrders(!showAllOrders)}
                    className="flex items-center gap-2 bg-gray-50 text-blue-600 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 transition-colors px-6 py-2.5 rounded-full text-sm font-semibold shadow-sm"
                  >
                    {showAllOrders ? (
                      <>
                        Show Less
                        <ChevronUp size={16} strokeWidth={2.5} />
                      </>
                    ) : (
                      <>
                        View Previous Orders ({orders.length - 1})
                        <ChevronDown size={16} strokeWidth={2.5} />
                      </>
                    )}
                  </button>
                </div>
              )}

            </div>
          )}
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerProfile;