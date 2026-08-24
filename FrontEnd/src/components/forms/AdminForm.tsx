import React, { useState } from "react";
import type { User } from "../../types/User";

interface AdminFormProps {
  onSubmit: (values: Omit<User, "role">) => void;
}

const AdminForm: React.FC<AdminFormProps> = ({ onSubmit }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit(form);
    setForm({ name: "", email: "", password: "" });
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Full Name
        </label>
        <input
          name="name"
          type="text"
          placeholder="Admin Name (e.g. Priyantha Silva)"
          value={form.name}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Work Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="priyantha@lankaread.lk"
          value={form.email}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
          Security Password
        </label>
        <input
          name="password"
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={handleChange}
          className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3.5 py-2.5 rounded-xl text-sm focus:outline-none focus:border-teal-500 transition"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold px-4 py-3 rounded-xl transition shadow-lg shadow-teal-500/20 text-sm mt-2 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Registering..." : "Authorize New Administrator"}
      </button>
    </form>
  );
};

export default AdminForm;
