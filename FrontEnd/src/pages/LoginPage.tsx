import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { login as loginService } from "../services/authService"
import toast from "react-hot-toast"
import { useAuth } from "../context/useAuth"
import { MdOutlineLocalLibrary, MdLockOutline, MdMailOutline } from "react-icons/md"

interface FormData {
  email: string
  password: string
}

interface FormErrors {
  email?: string
  password?: string
}

const Login = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.email) {
      newErrors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setIsLoading(true)
      try {
        const res = await loginService({
          email: formData.email.trim(),
          password: formData.password,
        })
        login(res.accessToken, res.role)
        toast.success(`Welcome back, ${res.name || "Member"}!`)
        navigate("/dashboard")
      } catch (error: any) {
        const apiError = error?.response?.data?.message || error?.response?.data?.error || error?.message || "Authentication failed";
        toast.error(apiError);
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/90 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-400 text-slate-950 shadow-lg shadow-teal-500/20 mb-4">
            <MdOutlineLocalLibrary className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Lanka<span className="text-teal-400">Read</span> Portal
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Library & Knowledge Management System
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <MdMailOutline className="w-5 h-5" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-3 bg-slate-950/80 border ${
                  errors.email ? "border-red-500/80" : "border-slate-800 focus:border-teal-500"
                } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
                placeholder="kasun.perera@lankaread.lk"
              />
            </div>
            {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <MdLockOutline className="w-5 h-5" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-4 py-3 bg-slate-950/80 border ${
                  errors.password ? "border-red-500/80" : "border-slate-800 focus:border-teal-500"
                } text-slate-100 placeholder-slate-500 rounded-xl text-sm focus:outline-none transition`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="w-full py-3.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-sm transition shadow-lg shadow-teal-500/20 disabled:opacity-50 mt-2 cursor-pointer"
          >
            {!isLoading ? "Access Portal" : "Authenticating..."}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-400">
              New library member or staff?{" "}
              <Link
                to="/signup"
                className="font-bold text-teal-400 hover:text-teal-300 transition"
              >
                Register Membership
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
