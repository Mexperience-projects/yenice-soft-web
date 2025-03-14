"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Package, AlertTriangle, DollarSign } from "lucide-react";
import type { ItemsType, Visit_itemType } from "@/lib/types";

interface InventoryTableProps {
  items_list: ItemsType[];
  visitItems: Visit_itemType[];
  animateIn: boolean;
}

export function InventoryTable({
  items_list,
  visitItems,
  animateIn,
}: InventoryTableProps) {
  const { t } = useTranslation();

  // Calculate inventory statistics
  const inventoryStats = useMemo(() => {
    const stats = items_list.map((item) => {
      // Calculate total usage
      const itemUsage = visitItems.filter((vi) => vi.item.id === item.id);
      const usage = itemUsage.reduce((sum, vi) => sum + (vi.count || 1), 0);

      // Calculate revenue from this item
      const revenue = itemUsage.reduce((sum, vi) => sum + ((vi.count || 1) * item.price), 0);

      // Calculate remaining stock percentage
      const remainingPercentage = item.count > 0 
        ? ((item.count - usage) / item.count) * 100 
        : 0;

      return {
        ...item,
        usage,
        revenue,
        remaining: Math.max(0, item.count - usage),
        remainingPercentage,
        isLowStock: remainingPercentage < (item.limit || 20), // Use item's limit or default to 20%
      };
    }).sort((a, b) => b.revenue - a.remainingPercentage); // Sort by revenue first, then low stock

    return stats;
  }, [items_list, visitItems]);

  // Calculate totals
  const totals = useMemo(() => {
    return inventoryStats.reduce((acc, item) => ({
      totalRevenue: acc.totalRevenue + item.revenue,
      totalUsage: acc.totalUsage + item.usage,
      totalRemaining: acc.totalRemaining + item.remaining,
    }), {
      totalRevenue: 0,
      totalUsage: 0,
      totalRemaining: 0,
    });
  }, [inventoryStats]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="card-title text-lg font-bold">
                {t("analytics.inventoryStatus")}
              </h2>
            </div>
            <div className="flex items-center gap-2 text-base-content/70">
              <DollarSign className="h-4 w-4" />
              <span className="font-medium">
                {t("analytics.totalRevenue")}: ₺{totals.totalRevenue.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>{t("analytics.itemName")}</th>
                  <th className="text-right">{t("analytics.price")}</th>
                  <th className="text-right">{t("analytics.initialStock")}</th>
                  <th className="text-right">{t("analytics.used")}</th>
                  <th className="text-right">{t("analytics.remaining")}</th>
                  <th className="text-right">{t("analytics.revenue")}</th>
                  <th>{t("analytics.status")}</th>
                </tr>
              </thead>
              <tbody>
                {inventoryStats.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center py-8 text-base-content/50"
                    >
                      {t("analytics.noItemsFound")}
                    </td>
                  </tr>
                ) : (
                  inventoryStats.map((item) => (
                    <tr key={item.id} className="hover">
                      <td className="font-medium">{item.name}</td>
                      <td className="text-right">₺{item.price.toLocaleString()}</td>
                      <td className="text-right">{item.count}</td>
                      <td className="text-right">{item.usage}</td>
                      <td className="text-right">{item.remaining}</td>
                      <td className="text-right font-medium text-success">
                        ₺{item.revenue.toLocaleString()}
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                item.isLowStock
                                  ? "bg-error"
                                  : item.remainingPercentage < 50
                                  ? "bg-warning"
                                  : "bg-success"
                              }`}
                              style={{ width: `${item.remainingPercentage}%` }}
                            ></div>
                          </div>
                          {item.isLowStock && (
                            <AlertTriangle className="h-4 w-4 text-error" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                {/* Totals row */}
                <tr className="font-medium bg-base-200">
                  <td>{t("analytics.totals")}</td>
                  <td></td>
                  <td className="text-right">
                    {inventoryStats.reduce((sum, item) => sum + item.count, 0)}
                  </td>
                  <td className="text-right">{totals.totalUsage}</td>
                  <td className="text-right">{totals.totalRemaining}</td>
                  <td className="text-right text-success">
                    ₺{totals.totalRevenue.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex gap-6 mt-4 text-sm text-base-content/70">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success"></div>
              <span>{t("analytics.goodStock")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warning"></div>
              <span>{t("analytics.mediumStock")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-error"></div>
              <span>{t("analytics.lowStock")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 