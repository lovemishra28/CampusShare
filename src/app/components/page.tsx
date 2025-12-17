"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ComponentItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: "GIVE" | "TAKE";
  status: "AVAILABLE" | "SOLD";
  userId: {
    _id: string; // Added _id here to check ownership
    name: string;
    branch: string;
    year: number;
    reputationScore: number;
  };
  createdAt: string;
}

export default function MarketplacePage() {
  const router = useRouter();
  const [components, setComponents] = useState<ComponentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<"GIVE" | "TAKE">("GIVE");
  const [requestingId, setRequestingId] = useState<string | null>(null);

  useEffect(() => {
    fetchComponents();
  }, []);

  const fetchComponents = async () => {
    try {
      const res = await fetch("/api/components");
      if (res.ok) {
        const data = await res.json();
        setComponents(data);
      }
    } catch (error) {
      console.error("Failed to fetch components", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (componentId: string) => {
    if (!confirm("Are you sure you want to initiate this request?")) return;

    setRequestingId(componentId);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ componentId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Something went wrong");
      } else {
        alert("Request sent successfully! Check your dashboard.");
        // Optional: Refresh list or redirect
        router.refresh(); 
      }
    } catch (error) {
      alert("Failed to send request");
    } finally {
      setRequestingId(null);
    }
  };

  // Filter the list based on the selected tab
  const filteredComponents = components.filter((c) => c.type === filterType);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Component Marketplace
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Borrow parts from peers or ask for what you need.
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/components/add"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            + List Item / Request
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setFilterType("GIVE")}
            className={`${
              filterType === "GIVE"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Available (GIVE)
          </button>
          <button
            onClick={() => setFilterType("TAKE")}
            className={`${
              filterType === "TAKE"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Requests (TAKE)
          </button>
        </nav>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="text-center py-10">Loading...</div>
      ) : filteredComponents.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map((item) => (
            <div
              key={item._id}
              className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.status === "AVAILABLE"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-500">{item.category}</span>
                </div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center pt-4 border-t border-gray-100">
                  <div className="shrink-0">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                      {item.userId?.name?.charAt(0) || "U"}
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      {item.userId?.name || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.userId?.branch} • Score: {item.userId?.reputationScore}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-4 sm:px-6">
                <button 
                  onClick={() => handleRequest(item._id)}
                  disabled={requestingId === item._id || item.status !== 'AVAILABLE'}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none disabled:opacity-50"
                >
                  {requestingId === item._id ? "Processing..." : 
                   filterType === "GIVE" ? "Request to Borrow" : "I Have This"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}