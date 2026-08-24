import React from "react";
import type { Lending } from "../../types/Lending";
import { MdCheckCircle, MdDelete, MdBookmarkAdded } from "react-icons/md";

interface LendingTableProps {
  lendings: Lending[];
  onComplete: (lending: Lending) => void;
  onDelete: (lending: Lending) => void;
}

const LendingTable: React.FC<LendingTableProps> = ({ lendings, onComplete, onDelete }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Book Title</th>
              <th className="px-6 py-4">Borrowed By Member</th>
              <th className="px-6 py-4">Issue Date</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4">Return Date</th>
              <th className="px-6 py-4">Loan Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {lendings.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-slate-500 font-medium">
                  No active or historical lending records.
                </td>
              </tr>
            ) : (
              lendings.map((lending) => (
                <tr key={lending._id} className="hover:bg-slate-800/40 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                        <MdBookmarkAdded className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-white tracking-tight">{lending.bookTitle}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">
                    {lending.readerName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs font-mono">
                    {lending.borrowDate ? new Date(lending.borrowDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs font-mono">
                    {lending.dueDate ? new Date(lending.dueDate).toLocaleDateString() : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs font-mono">
                    {lending.returnDate ? new Date(lending.returnDate).toLocaleDateString() : "Active Loan"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {lending.status === "overdue" ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-ping" />
                        <span>Overdue Notice</span>
                      </span>
                    ) : lending.status === "borrowed" ? (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        <span>On Loan</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>Returned</span>
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      {["borrowed", "overdue"].includes(lending.status || "") && (
                        <button
                          onClick={() => onComplete(lending)}
                          className="p-2 text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 rounded-xl transition border border-transparent hover:border-emerald-500/20"
                          title="Mark Returned"
                        >
                          <MdCheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(lending)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-transparent hover:border-rose-500/20"
                        title="Delete Record"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LendingTable;
