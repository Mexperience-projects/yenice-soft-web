"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Package,
  HeartPulse,
  LogOut,
  CreditCard,
  UserCircle,
  Globe,
  Check,
} from "lucide-react";
import { useLogin } from "@/hooks/login/UseLogin";
import { useTranslation } from "react-i18next";

export default function LayoutMenu() {
  const pathname = usePathname();
  const { logout, loading } = useLogin();
  const { t, i18n } = useTranslation();
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const menuItems = [
    {
      href: "/panel/dashboard",
      label: t("menu.dashboard"),
      icon: LayoutDashboard,
    },
    { href: "/panel/visit", label: t("menu.visits"), icon: ClipboardList },
    { href: "/panel/presonels", label: t("menu.personnel"), icon: Users },
    { href: "/panel/items", label: t("menu.inventory"), icon: Package },
    { href: "/panel/services", label: t("menu.services"), icon: HeartPulse },
    { href: "/panel/payments", label: t("menu.payments"), icon: CreditCard },
    { href: "/panel/clients", label: t("menu.clients"), icon: UserCircle },
  ];

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsLangDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        langDropdownRef.current &&
        !langDropdownRef.current.contains(event.target as Node)
      ) {
        setIsLangDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white shadow-sm border-r border-gray-100 text-gray-700 flex flex-col w-72">
      {/* Brand Header */}
      <div className="p-6 flex justify-between items-center border-b border-gray-100 relative">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("menu.adminPanel")}
          </h2>
        </div>
      </div>

      {/* Menu */}
      <div className="px-4 py-6 flex-1 h-full">
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

      {/* Language Dropdown */}
      <div className=" ">
        <div className="relative mt-5 mx-2" ref={langDropdownRef}>
          {isLangDropdownOpen && (
            <div className="absolute left-0 mt-1 w-36 bg-white rounded-lg shadow-lg border border-gray-100 z-10">
              <ul className="py-1">
                <li>
                  <button
                    onClick={() => changeLanguage("en")}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <span className="mr-2">🇺🇸</span> {t("menu.english")}
                    {i18n.language === "en" && (
                      <Check className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => changeLanguage("tr")}
                    className="flex items-center w-full px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <span className="mr-2">🇹🇷</span> {t("menu.turkish")}
                    {i18n.language === "tr" && (
                      <Check className="ml-auto h-4 w-4 text-primary" />
                    )}
                  </button>
                </li>
              </ul>
            </div>
          )}
          <button
            onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
            className="p-2  from-primary to-secondary text-primary border-b border-primary
            transition-colors flex items-center gap-1 w-full"
            title={t("menu.changeLanguage")}
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs font-medium uppercase">
              {i18n.language}
            </span>
          </button>
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all duration-200 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className={`font-medium ${loading ? "loading" : ""}`}>
            {t("menu.logout")}
          </span>
        </button>
      </div>
    </div>
  );
}
