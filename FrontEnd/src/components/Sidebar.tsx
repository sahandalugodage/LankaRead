import React, { useState, type JSX } from "react"
import { MdDashboard, MdPeople, MdMenuBook, MdBookmarkAdded, MdOutlinePendingActions, MdMenu, MdClose, MdAdminPanelSettings } from "react-icons/md"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../context/useAuth"

interface SidebarItem {
  id: string
  label: string
  icon: JSX.Element
}

const Sidebar: React.FC = () => {
  const [open, setOpen] = useState<boolean>(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { role } = useAuth()

  const currentPath = location.pathname.split("/").pop() || "dashboard"

  const handleItemClick = (itemId: string) => {
    setOpen(false)
    if (itemId === "dashboard") navigate(`/dashboard`)
    else if (itemId === "overdue") navigate(`/dashboard/overdue`)
    else navigate(`/dashboard/${itemId}`)
  }

  const sidebarItems: SidebarItem[] = [
    {
      id: "dashboard",
      label: "Overview",
      icon: <MdDashboard className="w-5 h-5" />,
    },
    ...(role === "admin"
      ? [{
          id: "users",
          label: "Staff & Admins",
          icon: <MdAdminPanelSettings className="w-5 h-5" />,
        }]
      : []),
    {
      id: "readers",
      label: "Library Members",
      icon: <MdPeople className="w-5 h-5" />,
    },
    {
      id: "books",
      label: "Book Catalog",
      icon: <MdMenuBook className="w-5 h-5" />,
    },
    {
      id: "lending",
      label: "Book Loans",
      icon: <MdBookmarkAdded className="w-5 h-5" />,
    },
    {
      id: "overdue",
      label: "Overdue Notices",
      icon: <MdOutlinePendingActions className="w-5 h-5" />,
    },
  ]

  return (
    <>
      <button
        className="sm:hidden fixed top-3 left-4 z-50 bg-slate-800 text-teal-400 p-2 rounded-xl border border-slate-700 focus:outline-none shadow-lg"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <MdClose className="w-6 h-6" /> : <MdMenu className="w-6 h-6" />}
      </button>

      <aside
        className={`
          bg-slate-900/95 border-r border-slate-800 text-slate-200 fixed sm:static top-0 left-0 h-full z-40
          w-64 min-h-screen p-5 transition-all duration-300 flex flex-col justify-between
          ${open ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
        `}
      >
        <div>
          <div className="mb-8 pt-2 pb-4 border-b border-slate-800/80">
            <div className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1">
              LankaRead Portal
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Management Suite
            </h2>
          </div>

          <nav>
            <ul className="space-y-1.5">
              {sidebarItems.map((item) => {
                const isActive = currentPath === item.id || (item.id === "dashboard" && currentPath === "dashboard")
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center space-x-3.5 px-4 py-3 rounded-xl font-medium transition-all duration-200 text-left text-sm ${
                        isActive
                          ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/10 text-teal-300 border border-teal-500/30 shadow-md shadow-teal-500/5 font-semibold"
                          : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                      }`}
                    >
                      <span className={`${isActive ? "text-teal-400" : "text-slate-500"}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800/80 text-xs text-slate-500">
          <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <p className="font-semibold text-slate-300 mb-1">Colombo Branch</p>
            <p className="text-[11px] text-slate-400">System v2.4 • Active Session</p>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
