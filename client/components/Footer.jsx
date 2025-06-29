"use client"

import { useRouter } from "next/navigation"
import { Shield, CheckCircle, Star, Phone, MapPin, Mail } from "lucide-react"

export default function Footer() {
  const router = useRouter()

  const handleNavigation = (path) => {
    router.push(path)
  }

  return (
    <footer className="bg-slate-800 border-t border-slate-700 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4 cursor-pointer" onClick={() => handleNavigation("/")}>
              <div className="w-14 h-8 rounded-lg flex items-center justify-center">
                <img src="/logo.png" alt="AgroGuide Logo" />
              </div>
              <span className="text-xl font-bold text-white">AgroGuide</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering farmers worldwide with AI-driven insights for sustainable and profitable agriculture.
            </p>

            {/* Contact Information */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="w-4 h-4 text-emerald-400" />
                <a href="tel:+977-9866115177" className="hover:text-emerald-400 transition-colors">
                  +977-9866115177
                </a>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="w-4 h-4 text-emerald-400" />
                <a href="mailto:info@agroguide.com" className="hover:text-emerald-400 transition-colors">
                  info@agroguide.com
                </a>
              </div>
              <div className="flex items-start gap-3 text-gray-300">
                <MapPin className="w-4 h-4 text-emerald-400 mt-0.5" />
                <div>
                  <p>Chitwan, Nepal</p>
                  <p className="text-sm text-gray-400">Bharatpur-15</p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-gray-400 text-sm">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>24/7 Support</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button
                  onClick={() => handleNavigation("/features")}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Features
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/predict")}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Predict
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/pricing")}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/api")} className="hover:text-emerald-400 transition-colors">
                  API
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <button onClick={() => handleNavigation("/about")} className="hover:text-emerald-400 transition-colors">
                  About
                </button>
              </li>
              <li>
                <button onClick={() => handleNavigation("/blog")} className="hover:text-emerald-400 transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/careers")}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Careers
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavigation("/contact")}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Saraz Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
