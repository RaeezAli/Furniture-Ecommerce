import React, { useState, useEffect, useMemo } from "react";
import { Search, Eye, Mail, MailOpen, User, Clock, MessageSquare, Reply, ChevronRight } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore";
import { Modal } from "../../components/common/Modal";
import { Toast } from "../../components/common/Toast";
import { Button } from "../../components/common/Button";

const Shimmer = ({ className }) => (
  <div
    className={`animate-pulse rounded ${className}`}
    style={{ background: "linear-gradient(90deg,#F4F5F7 25%,#E5E7EB 50%,#F4F5F7 75%)", backgroundSize: "200% 100%" }}
  />
);

const Contacts = () => {
  const { loading, fetchCollection, updateDocument } = useFirestore();
  const [contacts, setContacts] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const [toast, setToast] = useState(null);
  const showToast = (message, type = "success") => setToast({ message, type });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    setPageLoading(true);
    const data = await fetchCollection("contacts", "createdAt", "desc");
    setContacts(data);
    setPageLoading(false);
  };

  const filteredContacts = useMemo(() => {
    return contacts.filter(c => {
      const matchesSearch =
        (c.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.subject || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "All" || c.status?.toLowerCase() === activeTab.toLowerCase();
      return matchesSearch && matchesTab;
    });
  }, [contacts, searchTerm, activeTab]);

  const handleOpenDetail = (contact) => {
    setSelectedContact(contact);
    setNewStatus(contact.status || "unread");
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedContact) return;
    const success = await updateDocument("contacts", selectedContact.id, {
      status: newStatus,
      updatedAt: new Date(),
    });
    if (success) {
      showToast(`Contact marked as ${newStatus}.`);
      setIsDetailModalOpen(false);
      loadContacts();
    } else {
      showToast("Failed to update status.", "error");
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      unread: "bg-[#FCEBEB] text-[#A32D2D]",
      read: "bg-[#E6F1FB] text-[#185FA5]",
      replied: "bg-[#E1F5EE] text-[#0F6E56]",
    };
    const cls = map[status?.toLowerCase()] || "bg-[#F4F5F7] text-[#898989]";
    return (
      <span className={`${cls} px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider`}>
        {status || "Unknown"}
      </span>
    );
  };

  const formatDate = (ts) => {
    if (!ts) return "N/A";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatDateTime = (ts) => {
    if (!ts) return "N/A";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const unreadCount = contacts.filter(c => c.status === "unread").length;

  return (
    <div className="space-y-5 animate-in fade-in duration-500">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div>
        <h1 className="text-[22px] font-bold text-[#333333]">Contact Messages</h1>
        <p className="text-[#898989] text-[13px]">
          Manage customer inquiries and support messages.
          {unreadCount > 0 && (
            <span className="ml-2 text-[#A32D2D] font-bold">{unreadCount} unread</span>
          )}
        </p>
      </div>

      <div className="bg-white border-[0.5px] border-[#E5E7EB] rounded-lg shadow-sm overflow-hidden">

        {/* Tabs */}
        <div className="border-b-[0.5px] border-[#E5E7EB] flex px-4 overflow-x-auto hide-scrollbar">
          {['All', 'Unread', 'Read', 'Replied'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-4 text-[13px] font-medium transition-all border-b-2 whitespace-nowrap ${
                activeTab === tab
                ? 'border-[#B88E2F] text-[#B88E2F]'
                : 'border-transparent text-[#898989] hover:text-[#333333]'
              }`}
            >
              {tab}
              {tab === "Unread" && unreadCount > 0 && (
                <span className="ml-1.5 bg-[#A32D2D] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b-[0.5px] border-[#E5E7EB]">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9F9F9F]" size={16} />
            <input
              type="text"
              placeholder="Search by name, email or subject..."
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
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Name</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Email</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Subject</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Date</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider">Status</th>
                <th className="p-4 text-[11px] font-bold text-[#898989] uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E5E7EB]">
              {pageLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="p-4"><Shimmer className="h-4 w-24" /></td>
                    <td className="p-4"><Shimmer className="h-4 w-32" /></td>
                    <td className="p-4"><Shimmer className="h-4 w-40" /></td>
                    <td className="p-4"><Shimmer className="h-4 w-24" /></td>
                    <td className="p-4"><Shimmer className="h-5 w-20 rounded-full" /></td>
                    <td className="p-4 text-right"><Shimmer className="h-8 w-20 rounded-lg ml-auto" /></td>
                  </tr>
                ))
              ) : filteredContacts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-20 text-center">
                    <MessageSquare size={48} className="mx-auto text-[#D1D5DB] mb-3 opacity-20" />
                    <p className="text-[14px] font-medium text-[#898989]">No contact messages found</p>
                  </td>
                </tr>
              ) : (
                filteredContacts.map(contact => (
                  <tr
                    key={contact.id}
                    className={`hover:bg-[#FCF8F3] transition-colors group cursor-pointer ${
                      contact.status === "unread" ? "bg-[#FFF8F8]" : ""
                    }`}
                    onClick={() => handleOpenDetail(contact)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {contact.status === "unread" ? (
                          <Mail size={14} className="text-[#A32D2D] flex-shrink-0" />
                        ) : (
                          <MailOpen size={14} className="text-[#898989] flex-shrink-0" />
                        )}
                        <span className={`text-[13px] ${contact.status === "unread" ? "font-bold text-[#333333]" : "text-[#616161]"}`}>
                          {contact.name || "Unknown"}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-[13px] text-[#616161]">{contact.email || "N/A"}</td>
                    <td className="p-4 text-[13px] text-[#616161] truncate max-w-[200px]">
                      {contact.subject || <span className="italic text-[#9F9F9F]">No subject</span>}
                    </td>
                    <td className="p-4 text-[13px] text-[#616161]">{formatDate(contact.createdAt)}</td>
                    <td className="p-4">{getStatusBadge(contact.status)}</td>
                    <td className="p-4 text-right">
                      <button className="text-[#B88E2F] hover:text-[#A47E2A] text-[12px] font-bold flex justify-end items-center gap-1 w-full uppercase tracking-tight">
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Contact Detail */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Contact Message"
        width="600px"
        confirmText="Update Status"
        onConfirm={handleUpdateStatus}
        loading={loading}
      >
        {selectedContact && (
          <div className="space-y-5">
            {/* Sender Info */}
            <div className="flex flex-col md:flex-row justify-between gap-4 p-4 bg-[#F4F5F7] rounded-xl border border-[#E5E7EB]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#B88E2F] border border-[#D1D5DB]">
                  <User size={20} />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#333333]">{selectedContact.name || "Unknown"}</p>
                  <p className="text-[12px] text-[#898989]">{selectedContact.email || "No email"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <label className="text-[12px] font-bold text-[#616161] uppercase tracking-wider">Status</label>
                <select
                  className="h-[36px] px-3 border border-[#D1D5DB] rounded-lg text-[13px] font-bold bg-white focus:outline-none focus:border-[#B88E2F]"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="replied">Replied</option>
                </select>
              </div>
            </div>

            {/* Subject */}
            {selectedContact.subject && (
              <div className="p-4 bg-[#FCF8F3] rounded-xl border border-[#FAEEDA]">
                <p className="text-[11px] font-bold text-[#898989] uppercase tracking-wider mb-1">Subject</p>
                <p className="text-[14px] font-semibold text-[#333333]">{selectedContact.subject}</p>
              </div>
            )}

            {/* Message */}
            <div className="p-4 bg-white rounded-xl border border-[#E5E7EB]">
              <p className="text-[11px] font-bold text-[#898989] uppercase tracking-wider mb-2">Message</p>
              <p className="text-[14px] text-[#333333] leading-relaxed whitespace-pre-wrap">
                {selectedContact.message || "No message content."}
              </p>
            </div>

            {/* Timestamp */}
            <div className="flex items-center gap-2 text-[#898989]">
              <Clock size={14} />
              <span className="text-[12px] font-medium">Received on {formatDateTime(selectedContact.createdAt)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Contacts;
