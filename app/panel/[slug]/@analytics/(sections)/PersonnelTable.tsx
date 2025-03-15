"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { PersonnelTableProps } from "./types";
import { useAppSelector } from "@/store/HOCs";
import { OperationType, PersonelType } from "@/lib/types";

export function PersonnelTable({
  personnelWithMetrics,
  personel_list,
  onPersonnelClick,
  filters,
}: PersonnelTableProps) {
  const { t } = useTranslation();
  const personnelsVisits_ = useAppSelector((store) => store.visits);
  const noFilter =
    filters.dateRange === undefined &&
    filters.searchQuery === "" &&
    filters.selectedService === "all" &&
    filters.minRevenue === undefined &&
    filters.maxRevenue === undefined;

  const personelOperations = (personel: PersonelType) =>
    personnelsVisits_.reduce((value, curren) => {
      const operations = curren.operations.filter(
        (o) => o.personel?.id === personel.id
      );

      return [...value, ...operations];
    }, [] as OperationType[]);

  const personelsOperations = useMemo(() => {
    return personel_list.reduce(
      (value, personel) => {
        const operations = personelOperations(personel).filter((o) => {
          const visitDate = new Date(o.datetime).toISOString().split("T")[0];

          if (filters?.dateRange?.from && filters?.dateRange?.to) {
            return (
              visitDate >= filters.dateRange.from &&
              visitDate <= filters.dateRange.to
            );
          } else if (filters?.dateRange?.from) {
            return visitDate >= filters.dateRange.from;
          } else if (filters?.dateRange?.to) {
            return visitDate <= filters.dateRange.to;
          }
          return true;
        });

        // skip if no operations
        if (!noFilter && operations.length === 0) return value;
        console.log(personel.name, operations);

        const totalItemsPrice = operations.reduce((value, current) => {
          const paymentSum = current.items.reduce(
            (sum, p) => sum + p.item.price * p.count,
            0
          );
          return value + paymentSum;
        }, 0);

        const totalPayments = operations.reduce((value, current) => {
          const paymentSum = current.payments.reduce(
            (sum, p) => sum + p.price,
            0
          );
          return value + paymentSum;
        }, 0);
        return [
          ...value,
          {
            ...personel,
            totalPayments,
            totalItemsPrice,
            visitCount: operations.length,
          },
        ];
      },
      [] as (PersonelType & {
        totalPayments: number;
        totalItemsPrice: number;
      })[]
    );
  }, [personel_list, filters]);

  // Filter and sort personnel
  const filteredPersonnel = useMemo(() => {
    let filtered = [...personelsOperations];

    // Apply search filter for personnel names
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter((person) =>
        person.name.toLowerCase().includes(query)
      );
    }

    // Apply service filter - only show personnel who have visits with the selected service
    if (filters.selectedService !== "all") {
      filtered = filtered.filter((person) => {
        const personnelServices =
          personel_list.find((p) => p.id.toString() === person.id.toString())
            ?.services || [];
        return personnelServices.some(
          (service) => service.id.toString() === filters.selectedService
        );
      });
    }

    // Apply revenue range filters (total revenue)
    if (filters.minRevenue !== undefined) {
      filtered = filtered.filter(
        (person) => person.revenue >= filters.minRevenue!
      );
    }
    if (filters.maxRevenue !== undefined) {
      filtered = filtered.filter(
        (person) => person.revenue <= filters.maxRevenue!
      );
    }

    // Apply remaining price filter (expense - paid)
    if (filters.minRemaining !== undefined) {
      filtered = filtered.filter(
        (person) => person.expense - person.paid >= filters.minRemaining!
      );
    }
    if (filters.maxRemaining !== undefined) {
      filtered = filtered.filter(
        (person) => person.expense - person.paid <= filters.maxRemaining!
      );
    }

    return filtered;
  }, [personel_list, filters]);

  // Sort personnel by revenue (highest first) and then by remaining amount
  const sortedPersonnel = useMemo(() => {
    return [...filteredPersonnel].sort((a, b) => {
      // First sort by revenue
      const revenueSort = b.revenue - a.revenue;
      if (revenueSort !== 0) return revenueSort;

      // If revenue is equal, sort by remaining amount (expense - paid)
      return b.expense - b.paid - (a.expense - a.paid);
    });
  }, [filteredPersonnel]);

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
                  <td
                    colSpan={8}
                    className="text-center py-8 text-base-content/50"
                  >
                    {t("analytics.noPersonnelFound")}
                  </td>
                </tr>
              ) : (
                sortedPersonnel.map((person) => (
                  <tr key={person.id} className="hover">
                    <td className="font-medium">{person.name}</td>
                    <td className="text-right">{person.visitCount}</td>
                    <td className="text-right">
                      ₺{person.totalItemsPrice.toLocaleString()}
                    </td>
                    <td className="text-right">
                      ₺{person.totalPayments.toLocaleString()}
                    </td>
                    <td className="text-right">
                      ₺
                      {(
                        (person.totalPayments * person.precent) /
                        100
                      ).toLocaleString()}
                    </td>
                    <td className="text-right">
                      ₺{person.paid.toLocaleString()}
                    </td>
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
                    ₺
                    {sortedPersonnel
                      .reduce((sum, p) => sum + p.itemsPrice, 0)
                      .toLocaleString()}
                  </td>
                  <td className="text-right">
                    ₺
                    {sortedPersonnel
                      .reduce((sum, p) => sum + p.revenue, 0)
                      .toLocaleString()}
                  </td>
                  <td className="text-right">
                    ₺
                    {sortedPersonnel
                      .reduce((sum, p) => sum + p.expense, 0)
                      .toLocaleString()}
                  </td>
                  <td className="text-right">
                    ₺
                    {sortedPersonnel
                      .reduce((sum, p) => sum + p.paid, 0)
                      .toLocaleString()}
                  </td>
                  <td className="text-right">
                    ₺
                    {sortedPersonnel
                      .reduce((sum, p) => sum + (p.expense - p.paid), 0)
                      .toLocaleString()}
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
