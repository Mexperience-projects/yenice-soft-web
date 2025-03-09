"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Package,
  HeartPulse,
  LogOut,
  CreditCard,
  UserCircle,
} from "lucide-react";
import { useLogin } from "@/hooks/login/UseLogin";

export default function LayoutMenu() {
  const pathname = usePathname();
  const { logout, loading } = useLogin();

  const menuItems = [
    { href: "/panel/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/panel/visit", label: "Visits", icon: ClipboardList },
    { href: "/panel/presonels", label: "Personnel", icon: Users },
    { href: "/panel/items", label: "Inventory", icon: Package },
    { href: "/panel/services", label: "Services", icon: HeartPulse },
    { href: "/panel/payments", label: "Payments", icon: CreditCard },
    { href: "/panel/clients", label: "Clients", icon: UserCircle },
  ];

  return (
    <div className="h-full bg-white shadow-sm border-r border-gray-100 text-gray-700 flex flex-col w-72">
      {/* Brand Header */}
      <div className="p-6 flex justify-center border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Admin Panel
          </h2>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-6 flex-1">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-gradient-to-r from-primary to-secondary text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-primary"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <span className="ml-auto w-1.5 h-5 rounded-full bg-white opacity-70"></span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className={`font-medium ${loading ? "loading" : ""}`}>
            Log Out
          </span>
        </button>
      </div>
    </div>
  );
}
