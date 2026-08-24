import React from 'react';
import { MdEdit, MdDelete, MdPerson } from 'react-icons/md';
import type { Reader } from '../../types/Reader';

interface ReadersTableProps {
  readers: Reader[];
  onEdit: (reader: Reader) => void;
  onDelete: (reader: Reader) => void;
}

const ReaderTable: React.FC<ReadersTableProps> = ({ readers, onEdit, onDelete }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="px-6 py-4">Member Name</th>
              <th className="px-6 py-4">Contact Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Branch Location</th>
              <th className="px-6 py-4">Joined Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {readers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">
                  No member records found.
                </td>
              </tr>
            ) : (
              readers.map((reader) => (
                <tr key={reader._id} className="hover:bg-slate-800/40 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500/20 to-emerald-500/20 border border-teal-500/30 text-teal-300 flex items-center justify-center font-bold text-xs">
                        {reader.name ? reader.name.slice(0, 2).toUpperCase() : <MdPerson />}
                      </div>
                      <div>
                        <div className="font-bold text-white tracking-tight">{reader.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">ID: {reader._id?.slice(-8)}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">
                    {reader.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-300 text-xs font-mono">
                    {reader.phoneNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs max-w-xs truncate">
                    {reader.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-400 text-xs">
                    {typeof reader.registerDate === 'string'
                      ? reader.registerDate.split('T')[0]
                      : new Date(reader.registerDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(reader)}
                        className="p-2 text-slate-400 hover:text-teal-300 hover:bg-slate-800 rounded-xl transition border border-transparent hover:border-slate-700"
                        title="Edit Profile"
                      >
                        <MdEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(reader)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition border border-transparent hover:border-rose-500/20"
                        title="Delete Member"
                      >
                        <MdDelete className="w-4 h-4" />
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

export default ReaderTable;
