"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Menu from "./menu";
import { type ReactNode } from "react";
import { USER_PERMISSIONS } from "@/lib/types";
import { useAppSelector } from "@/store/HOCs";
import { AlertTriangle } from "lucide-react";

interface _LayoutType {
  children: ReactNode;
  analytics: ReactNode;
  visit: ReactNode;
  presonels: ReactNode;
  items: ReactNode;
  services: ReactNode;
  clients: ReactNode;
  payments: ReactNode;
  users: ReactNode;
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center max-w-md p-8 bg-base-100 rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-error" />
        </div>

        <h1 className="text-3xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8">your panel page not found.</p>

        <Link href="/" className="btn btn-primary px-6">
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default function ({
  children,
  analytics,
  visit,
  presonels,
  items,
  services,
  clients,
  payments,
  users,
}: _LayoutType) {
  const params = useParams();
  const user = useAppSelector((store) => store.auth.user);

  const contentItems = [
    {
      slug: "analytics",
      child: analytics,
      permission: USER_PERMISSIONS.ANALYSES,
    },
    { slug: "visit", child: visit, permission: USER_PERMISSIONS.VISITS },
    {
      slug: "presonels",
      child: presonels,
      permission: USER_PERMISSIONS.PERSONELS,
    },
    { slug: "items", child: items, permission: USER_PERMISSIONS.INVENTORY },
    {
      slug: "services",
      child: services,
      permission: USER_PERMISSIONS.SERVICES,
    },
    { slug: "clients", child: clients, permission: USER_PERMISSIONS.CLIENTS },
    {
      slug: "payments",
      child: payments,
      permission: USER_PERMISSIONS.PAYMENTS,
    },
    { slug: "users", child: users, permission: USER_PERMISSIONS.USERS },
  ];

  // render content for meny
  const renderContent = () =>
    contentItems.find(
      (c) =>
        c.slug === params.slug &&
        (user?.is_admin || (user?.permissions || []).includes(c.permission))
    )?.child;

  return (
    <div className="flex">
      <Menu />
      <main className="w-full ">{renderContent() || <NotFound />}</main>
    </div>
  );
}
