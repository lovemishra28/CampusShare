"use client";

import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  componentId: { title: string; category: string };
  lenderId: { _id: string; name: string; email: string };
  borrowerId: { _id: string; name: string; email: string };
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Fetch data on load
  const fetchDashboard = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions);
        setUserId(data.currentUser._id);
      }
    } catch (error) {
      console.error("Error fetching dashboard", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Function to update transaction status
  const handleStatusUpdate = async (transactionId: string, newStatus: string) => {
    const confirmMessage = newStatus === "ACTIVE" ? "Approve this request?" : 
                           newStatus === "REJECTED" ? "Reject this request?" : 
                           "Mark item as returned?";
                           
    if (!confirm(confirmMessage)) return;

    try {
      const res = await fetch(`/api/transactions/${transactionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert("Status updated successfully!");
        fetchDashboard(); // Refresh the list to show changes
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  // Filter: Requests sent to me (I am Lender)
  const incomingRequests = transactions.filter(
    (t) => t.lenderId._id === userId && t.status === "PENDING"
  );

  // Filter: Active Loans (I lent it out, waiting for return)
  const activeLending = transactions.filter(
    (t) => t.lenderId._id === userId && t.status === "ACTIVE"
  );

  // Filter: My Requests (I asked to borrow)
  const myRequests = transactions.filter(
    (t) => t.borrowerId._id === userId
  );

  if (loading) return <div className="text-center py-10">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

      {/* Section 1: Incoming Requests (Action Required) */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Incoming Requests (Action Required)
        </h2>
        {incomingRequests.length === 0 ? (
          <p className="text-gray-500 italic">No pending requests.</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {incomingRequests.map((t) => (
                <li key={t._id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      {t.borrowerId.name} wants your {t.componentId.title}
                    </p>
                    <p className="text-xs text-gray-500">Requested on {new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleStatusUpdate(t._id, "ACTIVE")}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(t._id, "REJECTED")}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section 2: Active Lending */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Items I Lent Out (Active)
        </h2>
        {activeLending.length === 0 ? (
          <p className="text-gray-500 italic">You aren't lending anything right now.</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {activeLending.map((t) => (
                <li key={t._id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {t.componentId.title} <span className="text-gray-500">given to</span> {t.borrowerId.name}
                    </p>
                    <p className="text-xs text-green-600 font-semibold">Active</p>
                  </div>
                  <button 
                    onClick={() => handleStatusUpdate(t._id, "COMPLETED")}
                    className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-900"
                  >
                    Mark Returned
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Section 3: My Requests */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          My Requests
        </h2>
        {myRequests.length === 0 ? (
          <p className="text-gray-500 italic">You haven't requested anything.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {myRequests.map((t) => (
              <div key={t._id} className="bg-white p-4 rounded-lg shadow border border-gray-100">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-900">{t.componentId.title}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    t.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                    t.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                    t.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {t.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">Owner: {t.lenderId.name}</p>
                <p className="text-xs text-gray-400 mt-2">
                  {new Date(t.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}