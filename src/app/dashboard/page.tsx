"use client";

import { useEffect, useState } from "react";

interface Transaction {
  _id: string;
  componentId: { title: string; category: string; type: "GIVE" | "TAKE" }; // Added type here
  lenderId: { _id: string; name: string; email: string };
  borrowerId: { _id: string; name: string; email: string };
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [loading, setLoading] = useState(true);

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

  const handleStatusUpdate = async (transactionId: string, newStatus: string) => {
    if (!confirm("Confirm this action?")) return;

    try {
      const res = await fetch(`/api/transactions/${transactionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert("Success!");
        fetchDashboard();
      } else {
        alert("Failed to update status.");
      }
    } catch (error) {
      alert("Something went wrong.");
    }
  };

  // --- LOGIC FIX START ---

  // 1. Action Required (Pending approvals)
  // Show if: (I am Lender AND Item was GIVE) OR (I am Borrower AND Item was TAKE/Request)
  const actionRequired = transactions.filter((t) => {
    if (t.status !== "PENDING") return false;

    const isMyGiveItem = t.lenderId._id === userId && t.componentId.type === "GIVE";
    const isMyTakeRequest = t.borrowerId._id === userId && t.componentId.type === "TAKE";
    
    return isMyGiveItem || isMyTakeRequest;
  });

  // 2. Pending on Others (I am waiting for them)
  const pendingOnOthers = transactions.filter((t) => {
    if (t.status !== "PENDING") return false;
    
    // Inverse of above
    const iRequestedTheirItem = t.borrowerId._id === userId && t.componentId.type === "GIVE";
    const iOfferedMyItem = t.lenderId._id === userId && t.componentId.type === "TAKE";

    return iRequestedTheirItem || iOfferedMyItem;
  });

  // 3. Active Loans (Items I am currently lending to others)
  const activeLending = transactions.filter(
    (t) => t.lenderId._id === userId && t.status === "ACTIVE"
  );

  // 4. Active Borrowing (Items I currently have from others)
  const activeBorrowing = transactions.filter(
    (t) => t.borrowerId._id === userId && t.status === "ACTIVE"
  );

  // --- LOGIC FIX END ---

  if (loading) return <div className="text-center py-10">Loading Dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

      {/* SECTION 1: ACTION REQUIRED */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2 border-red-200">
          ⚠️ Action Required (Approve/Reject)
        </h2>
        {actionRequired.length === 0 ? (
          <p className="text-gray-500 italic">You are all caught up.</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md border-l-4 border-red-400">
            <ul className="divide-y divide-gray-200">
              {actionRequired.map((t) => (
                <li key={t._id} className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div>
                    <p className="font-medium text-gray-900">
                      {t.componentId.type === "GIVE" 
                        ? `${t.borrowerId.name} wants your ${t.componentId.title}`
                        : `${t.lenderId.name} says they have the ${t.componentId.title} you need`}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleStatusUpdate(t._id, "ACTIVE")}
                      className="bg-green-600 text-white px-4 py-2 rounded text-sm hover:bg-green-700"
                    >
                      Approve & Connect
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(t._id, "REJECTED")}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm hover:bg-red-200"
                    >
                      Decline
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* SECTION 2: WAITING ON OTHERS */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          ⏳ Waiting for Approval
        </h2>
        {pendingOnOthers.length === 0 ? (
          <p className="text-gray-500 italic">No pending requests sent.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {pendingOnOthers.map((t) => (
              <div key={t._id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <p className="font-medium text-gray-700">{t.componentId.title}</p>
                <p className="text-sm text-gray-500">
                  Waiting for {t.componentId.type === "GIVE" ? t.lenderId.name : t.borrowerId.name} to approve.
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 3: ACTIVE LOANS */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          📤 Items I Lent (To Get Back)
        </h2>
        {activeLending.length === 0 ? (
          <p className="text-gray-500 italic">No items currently lent out.</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {activeLending.map((t) => (
                <li key={t._id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{t.componentId.title}</p>
                    <p className="text-sm text-gray-500">With: {t.borrowerId.name}</p>
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

       {/* SECTION 4: ACTIVE BORROWING */}
       <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          📥 Items I Borrowed (To Return)
        </h2>
        {activeBorrowing.length === 0 ? (
          <p className="text-gray-500 italic">You aren't borrowing anything.</p>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {activeBorrowing.map((t) => (
                <li key={t._id} className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-medium">{t.componentId.title}</p>
                    <p className="text-sm text-gray-500">From: {t.lenderId.name}</p>
                  </div>
                  <span className="text-green-600 text-sm font-bold bg-green-100 px-3 py-1 rounded-full">
                    Active
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}