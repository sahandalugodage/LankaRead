import React from "react";
import { MdMenuBook, MdGroup, MdBookmarkAdded, MdOutlineReceiptLong } from "react-icons/md";

interface CountCardsProps {
  bookCount: number;
  readerCount: number;
  lendingCount: number;
  overdueCount?: number;
}

const CountCards: React.FC<CountCardsProps> = ({ bookCount, readerCount, lendingCount, overdueCount = 0 }) => {
  const cards = [
    {
      label: "Total Titles",
      count: bookCount,
      subtext: "Catalog items across branches",
      icon: <MdMenuBook className="w-6 h-6 text-teal-400" />,
      accentColor: "border-teal-500/20 bg-teal-500/5 text-teal-300",
      badge: "+12 Sri Lanka Authors",
    },
    {
      label: "Registered Members",
      count: readerCount,
      subtext: "Active library cardholders",
      icon: <MdGroup className="w-6 h-6 text-emerald-400" />,
      accentColor: "border-emerald-500/20 bg-emerald-500/5 text-emerald-300",
      badge: "Active Membership",
    },
    {
      label: "Active Loans",
      count: lendingCount,
      subtext: "Currently issued to readers",
      icon: <MdBookmarkAdded className="w-6 h-6 text-sky-400" />,
      accentColor: "border-sky-500/20 bg-sky-500/5 text-sky-300",
      badge: "14-Day Terms",
    },
    {
      label: "Overdue Holds",
      count: overdueCount,
      subtext: "Pending returns & notices",
      icon: <MdOutlineReceiptLong className="w-6 h-6 text-amber-400" />,
      accentColor: "border-amber-500/20 bg-amber-500/5 text-amber-300",
      badge: "Rs. 50/day fine",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl hover:border-slate-700 transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2.5 rounded-xl border ${card.accentColor}`}>
              {card.icon}
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {card.badge}
            </span>
          </div>

          <div>
            <div className="text-3xl font-extrabold text-white tracking-tight mb-1">
              {card.count}
            </div>
            <div className="text-sm font-semibold text-slate-300">{card.label}</div>
            <div className="text-xs text-slate-500 mt-1">{card.subtext}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountCards;
