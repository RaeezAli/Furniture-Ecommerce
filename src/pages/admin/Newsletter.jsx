import React, { useState, useEffect, useMemo } from "react";
import { Search, Mail, Calendar, Download, Copy, CheckCircle, Users, XCircle, ToggleLeft, ToggleRight } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";
import { Toast } from "../../components/common/Toast";

const Shimmer = ({ className }) => (
  <div
    className={`animate-pulse rounded ${className}`}
    style={{ background: "linear-gradient(90deg,#F4F5F7 25%,#E5E7EB 50%,#F4F5F7 75%)", backgroundSize: "200% 100%" }}
  />
);

const Newsletter = () => {
  const { loading, fetchCollection, updateDocument } = useFirestore();
  const [subscribers, setSubscribers] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    loadSubscribers();
  }, []);

  const loadSubscribers = async () => {
    setPageLoading(true);
    const data = await fetchCollection("newsletter", "subscribedAt", "desc");
    setSubscribers(data);
    setPageLoading(false);
  };

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter(s =>
      (s.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [subscribers, searchTerm]);

  const activeSubscribers = useMemo(() => {
    return subscribers.filter(s => s.isActive !== false);
  }, [subscribers]);

  const handleExportEmails = () => {
    const emails = activeSubscribers.map(s => s.email).filter(Boolean).join(", ");
    navigator.clipboard.writeText(emails).then(() => {
      setCopied(true);
      showToast(`${activeSubscribers.length} emails copied to clipboard!`);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      showToast("Failed to copy emails.", "error");
    });
  };

  const handleToggleActive = async (subscriber) => {
    const newStatus = !subscriber.isActive;
    const success = await updateDocument("newsletter", subscriber.id, {
      isActive: newStatus,
    });
    if (success) {
      showToast(`Subscriber ${newStatus ? "activated" : "deactivated"}.`);
      loadSubscribers();
    } else {
      showToast("Failed to update subscriber.", "error");
    }
  };

  const formatDate = (ts) => {
    if (!ts) return "N/A";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3">
        <div>
          <h1 className="text-[22px] font-bold text-[#333333]">Newsletter Subscribers</h1>
          <p className="text-[#898989] text-[13px]">
            Manage email subscribers for your campaigns.
          </p>
        </div>
        <button
          onClick={handleExportEmails}
          disabled={activeSubscribers.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#B88E2F] text-white rounded-lg text-[13px] font-bold hover:bg-[#A47E2A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {copied ? <CheckCircle size={16} /> : <Copy size={16} />}
          {copied ? "Copied!" : "Copy All Emails"}
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#E6F1FB] flex items-center justify-center">
            <Users size={20} className="text-[#185FA5]" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#333333]">{subscribers.length}</p>
            <p className="text-[11px] text-[#898989] uppercase tracking-wider font-bold">Total</p>
          </div>
        </div>
        <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#E1F5EE] flex items-center justify-center">
            <CheckCircle size={20} className="text-[#0F6E56]" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#333333]">{activeSubscribers.length}</p>
            <p className="text-[11px] text-[#898989] uppercase tracking-wider font-bold">Active</p>
          </div>
        </div>
        <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-[#FCEBEB] flex items-center justify-center">
            <XCircle size={20} className="text-[#A32D2D]" />
          </div>
          <div>
            <p className="text-[20px] font-bold text-[#333333]">{subscribers.length - activeSubscribers.length}</p>
            <p className="text-[11px] text-[#898989] uppercase tracking-wider font-bold">Inactive</p>
          </div>
        </div>
      </div>

      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">

        {/* Search Bar */}
        <div className="p-4 border-b-[0.5px] border-[#E5E7EB]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9F9F9F]" size={16} />
            <input
              type="text"
              placeholder="Search by email..."
              className="w-full pl-9 pr-4 h-[40px] border border-[#d1d5db] rounded-[6px] text-[14px] font-['Poppins'] focus:outline-none focus:border-[#B88E2F] focus:ring-1 focus:ring-[#B88E2F]"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F5F7]">
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">#</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Email</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Subscribed Date</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Status</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {pageLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4"><Shimmer className="h-4 w-8" /></td>
                    <td className="p-4"><Shimmer className="h-4 w-40" /></td>
                    <td className="p-4"><Shimmer className="h-4 w-24" /></td>
                    <td className="p-4"><Shimmer className="h-5 w-16 rounded-full" /></td>
                    <td className="p-4 text-right"><Shimmer className="h-8 w-16 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <Mail size={48} className="mx-auto text-[#D1D5DB] mb-3 opacity-20" />
                    <p className="text-[14px] font-medium text-[#898989]">No subscribers found</p>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub, idx) => (
                  <tr key={sub.id} className="hover:bg-[#FCF8F3] transition-colors">
                    <td className="p-4 text-[13px] text-[#898989]">{idx + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-[#B88E2F] flex-shrink-0" />
                        <span className="text-[13px] text-[#333333] font-medium">{sub.email || "N/A"}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-[#616161]">{formatDate(sub.subscribedAt)}</td>
                    <td className="p-4">
                      {sub.isActive !== false ? (
                        <span className="bg-[#E1F5EE] text-[#0F6E56] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Active
                        </span>
                      ) : (
                        <span className="bg-[#FCEBEB] text-[#A32D2D] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleToggleActive(sub); }}
                        className={`flex items-center gap-1 text-[12px] font-bold ml-auto transition-colors ${
                          sub.isActive !== false
                            ? "text-red-500 hover:text-red-700"
                            : "text-green-600 hover:text-green-700"
                        }`}
                        disabled={loading}
                      >
                        {sub.isActive !== false ? (
                          <><ToggleRight size={16} /> Deactivate</>
                        ) : (
                          <><ToggleLeft size={16} /> Activate</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Newsletter;
