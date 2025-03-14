"use client";

import { useMemo } from "react";
import { Eye } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { PersonnelTableProps } from "./types";

export function PersonnelTable({
  personnelWithMetrics,
  filteredPersonnel,
  personel_list,
  onPersonnelClick,
}: PersonnelTableProps) {
  const { t } = useTranslation();

  // Sort personnel by revenue (highest first)
  const sortedPersonnel = useMemo(() => {
    return [...personnelWithMetrics].sort((a, b) => b.revenue - a.revenue);
  }, [personnelWithMetrics]);



  return (
    <div className="card bg-white shadow-lg border border-gray-100">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="card-title text-lg font-bold">
              {t("analytics.personnelPerformance")}
            </h2>
            {filteredPersonnel.length !== personel_list.length && (
              <span className="badge badge-primary">
                {filteredPersonnel.length} / {personel_list.length}
              </span>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>{t("analytics.name")}</th>
                <th className="text-right">{t("analytics.visits")}</th>
                <th className="text-right">{t("analytics.itemsRevenue")}</th>
                <th className="text-right">{t("analytics.revenue")}</th>
                <th className="text-right">{t("analytics.expense")}</th>
                <th className="text-right">{t("analytics.paid")}</th>
                <th className="text-right">{t("analytics.remaining")}</th>
              </tr>
            </thead>
            <tbody>
              {sortedPersonnel.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-base-content/50">
                    {t("analytics.noPersonnelFound")}
                  </td>
                </tr>
              ) : (
                sortedPersonnel.map((person) => (
                  <tr key={person.id} className="hover">
                    <td className="font-medium">{person.name}</td>
                    <td className="text-right">{person.visitCount}</td>
                    <td className="text-right">₺{person.itemsPrice.toLocaleString()}</td>
                    <td className="text-right">₺{person.revenue.toLocaleString()}</td>
                    <td className="text-right">₺{person.expense.toLocaleString()}</td>
                    <td className="text-right">₺{person.paid.toLocaleString()}</td>
                    <td className="text-right">
                      <span
                        className={
                          person.expense - person.paid > 0
                            ? "text-error font-medium"
                            : "text-success font-medium"
                        }
                      >
                        ₺{(person.expense - person.paid).toLocaleString()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
              {/* Totals row */}
              {sortedPersonnel.length > 0 && (
                <tr className="font-medium bg-base-200">
                  <td>{t("analytics.totals")}</td>
                  <td className="text-right">
                    {sortedPersonnel.reduce((sum, p) => sum + p.visitCount, 0)}
                  </td>
                  <td className="text-right">
                    ₺{sortedPersonnel.reduce((sum, p) => sum + p.itemsPrice, 0).toLocaleString()}
                  </td>
                  <td className="text-right">
                    ₺{sortedPersonnel.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                  </td>
                  <td className="text-right">
                    ₺{sortedPersonnel.reduce((sum, p) => sum + p.expense, 0).toLocaleString()}
                  </td>
                  <td className="text-right">
                    ₺{sortedPersonnel.reduce((sum, p) => sum + p.paid, 0).toLocaleString()}
                  </td>
                  <td className="text-right">
                    ₺{sortedPersonnel.reduce((sum, p) => sum + (p.expense - p.paid), 0).toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 