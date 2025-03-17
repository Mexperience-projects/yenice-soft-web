"use client";

import { Calendar, DollarSign, Package, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SummaryCardsProps } from "./types";

export function SummaryCards({
  totalVisits,
  totalItems,
  totalRevenue,
  totalPersonnelPayments,
}: SummaryCardsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-6 md:grid-cols-4">
      {/* Total Visits Card */}
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body p-6">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-sm font-medium">
              {t("analytics.totalVisits")}
            </h2>
            <div className="bg-primary/10 p-2 rounded-full">
              <Calendar className="h-4 w-4 text-primary" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-2">
            {totalVisits.toLocaleString()}
          </div>
          <p className="text-xs text-base-content/70 mt-1">
            {t("analytics.acrossAllPersonnel")}
          </p>
        </div>
      </div>

      {/* Total Items Card */}
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body p-6">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-sm font-medium">
              {t("analytics.itemsUsed")}
            </h2>
            <div className="bg-secondary/10 p-2 rounded-full">
              <Package className="h-4 w-4 text-secondary" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-2">
            {totalItems.toLocaleString()}
          </div>
          <p className="text-xs text-base-content/70 mt-1">
            {t("analytics.totalConsumedItems")}
          </p>
        </div>
      </div>

      {/* Total Revenue Card */}
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body p-6">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-sm font-medium">
              {t("analytics.totalRevenue")}
            </h2>
            <div className="bg-accent/10 p-2 rounded-full">
              <p className="flex items-center text-center justify-center h-4 w-4 text-accent">
                ₺
              </p>
            </div>
          </div>
          <div className="text-2xl font-bold mt-2">
            ₺{totalRevenue.toLocaleString()}
          </div>
          <p className="text-xs text-base-content/70 mt-1">
            {t("analytics.fromAllServices")}
          </p>
        </div>
      </div>

      {/* Personnel Payments Card */}
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body p-6">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-sm font-medium">
              {t("analytics.personnelPayments")}
            </h2>
            <div className="bg-info/10 p-2 rounded-full">
              <CreditCard className="h-4 w-4 text-info" />
            </div>
          </div>
          <div className="text-2xl font-bold mt-2">
            ₺{totalPersonnelPayments.toLocaleString()}
          </div>
          <p className="text-xs text-base-content/70 mt-1">
            {t("analytics.totalExpensesToPersonnel")}
          </p>
        </div>
      </div>
    </div>
  );
}
