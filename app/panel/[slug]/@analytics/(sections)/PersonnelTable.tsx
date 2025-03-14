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
                <th className="text-right">{t("analytics.itemsUsed")}</th>
                <th className="text-right">{t("analytics.revenue")}</th>
                <th className="text-right">{t("analytics.payments")}</th>
                <th className="text-right">{t("analytics.profit")}</th>
                <th className="text-right">{t("analytics.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {sortedPersonnel.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-base-content/50">
                    {t("analytics.noPersonnelFound")}
                  </td>
                </tr>
              ) : (
                sortedPersonnel.map((person) => (
                  <tr key={person.id} className="hover">
                    <td className="font-medium">{person.name}</td>
                    <td className="text-right">{person.visitCount}</td>
                    <td className="text-right">{person.itemCount}</td>
                    <td className="text-right">
                      ₺{person.revenue.toLocaleString()}
                    </td>
                    <td className="text-right">
                      ₺{person.expense.toLocaleString()}
                    </td>
                    <td className="text-right">
                      <span
                        className={
                          person.revenue - person.expense > 0
                            ? "text-success font-medium"
                            : "text-error font-medium"
                        }
                      >
                        ₺{(person.revenue - person.expense).toLocaleString()}
                      </span>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn btn-ghost btn-sm bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                        onClick={() => onPersonnelClick(person)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        {t("analytics.details")}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 