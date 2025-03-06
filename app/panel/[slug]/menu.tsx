"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Package,
  HeartPulse,
  Settings,
  LogOut,
} from "lucide-react";
import { useLogin } from "@/hooks/login/UseLogin";

export default function LayoutMenu() {
  const pathname = usePathname();
  const { logout } = useLogin();

  const menuItems = [
    { href: "/panel/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/panel/visit", label: "Visits", icon: ClipboardList },
    { href: "/panel/presonels", label: "Personnel", icon: Users },
    { href: "/panel/items", label: "Inventory", icon: Package },
    { href: "/panel/services", label: "Services", icon: HeartPulse },
  ];

  return (
    <div className="h-full bg-white text-gray-700 flex flex-col">
      {/* Brand Header */}
      <div className="p-6 flex justify-center">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h2 className="text-xl font-bold text-blue-600">Admin Panel</h2>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-6 flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors cursor-pointer">
          <LogOut className="w-5 h-5" />
          <button onClick={logout} className="font-medium">
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
