"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, DollarSign, Users, Wallet } from "lucide-react";
import { format } from "date-fns";
import type { VisitType, ServicesType, PersonelType } from "@/lib/types";
import type {
  VisitWithStats,
  VisitSummaryStats,
  VisitsTableProps,
} from "./types";

export function VisitsTable({
  visit_list,
  services_list,
  personel_list,
  animateIn,
  filters,
}: VisitsTableProps) {
  const { t } = useTranslation();

  // Calculate visit statistics with filters
  const visitStats = useMemo<VisitWithStats[]>(() => {
    // First calculate base stats
    let stats = visit_list.map((visit) => {
      // Calculate total revenue for this visit
      const totalRevenue =
        visit.operations?.reduce((sum, op) => {
          const paymentsSum =
            op.payments?.reduce((pSum, p) => pSum + p.price, 0) || 0;
          const extraPrice = op.extraPrice || 0;
          const discount = op.discount || 0;
          return sum + paymentsSum + extraPrice - discount;
        }, 0) || 0;

      // Get all services provided in this visit
      const services =
        visit.operations?.flatMap((op) => op.service || []) || [];

      // Get all personnel involved in this visit
      const personnel = services.flatMap((s) => s.personel || []);

      // Calculate personnel fees
      const totalPersonnelFee = personnel.reduce((sum, person) => {
        return sum + totalRevenue * (person.precent / 100);
      }, 0);

      // Calculate net revenue
      const netRevenue = totalRevenue - totalPersonnelFee;

      // Get start time from first operation
      const firstOp = visit.operations?.[0];
      const startTime = firstOp?.datetime ? new Date(firstOp.datetime) : null;

      return {
        ...visit,
        totalRevenue,
        totalPersonnelFee,
        netRevenue,
        services,
        personnel,
        startTime,
      };
    });

    // Apply filters
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      stats = stats.filter((visit) => {
        const clientName = visit.client?.name?.toLowerCase() || "";
        const serviceNames = visit.services.map((s) => s.name.toLowerCase());
        const personnelNames = visit.personnel.map((p) => p.name.toLowerCase());
        return (
          clientName.includes(query) ||
          serviceNames.some((name) => name.includes(query)) ||
          personnelNames.some((name) => name.includes(query))
        );
      });
    }

    // Apply date range filter
    if (filters.dateRange?.from && filters.dateRange?.to) {
      const fromDate = new Date(filters.dateRange.from);
      const toDate = new Date(filters.dateRange.to);
      toDate.setHours(23, 59, 59, 999); // Set to end of day

      stats = stats.filter((visit) => {
        if (!visit.startTime) return false;
        return visit.startTime >= fromDate && visit.startTime <= toDate;
      });
    }

    // Apply service filter
    if (filters.selectedService !== "all") {
      stats = stats.filter((visit) =>
        visit.services.some(
          (service) => service.id.toString() === filters.selectedService
        )
      );
    }

    // Apply personnel filter
    if (filters.selectedPersonnel !== "all") {
      stats = stats.filter((visit) =>
        visit.personnel.some(
          (person) => person.id.toString() === filters.selectedPersonnel
        )
      );
    }

    // Apply payment type filter
    if (filters.paymentType !== "all") {
      stats = stats.filter((visit) =>
        visit.operations?.some((op) =>
          op.payments?.some((payment) => payment.type === filters.paymentType)
        )
      );
    }

    // Apply revenue filters
    if (filters.minRevenue !== undefined) {
      stats = stats.filter(
        (visit) => visit.totalRevenue >= filters.minRevenue!
      );
    }
    if (filters.maxRevenue !== undefined) {
      stats = stats.filter(
        (visit) => visit.totalRevenue <= filters.maxRevenue!
      );
    }

    // Apply sorting
    stats.sort((a, b) => {
      switch (filters.sortBy) {
        case "date":
          if (!a.startTime || !b.startTime) return 0;
          return filters.sortOrder === "asc"
            ? a.startTime.getTime() - b.startTime.getTime()
            : b.startTime.getTime() - a.startTime.getTime();
        case "revenue":
          return filters.sortOrder === "asc"
            ? a.totalRevenue - b.totalRevenue
            : b.totalRevenue - a.totalRevenue;
        case "personnel_fee":
          return filters.sortOrder === "asc"
            ? a.totalPersonnelFee - b.totalPersonnelFee
            : b.totalPersonnelFee - a.totalPersonnelFee;
        case "net_revenue":
          return filters.sortOrder === "asc"
            ? a.netRevenue - b.netRevenue
            : b.netRevenue - a.netRevenue;
        default:
          return 0;
      }
    });

    return stats;
  }, [visit_list, filters, services_list, personel_list]);

  // Calculate summary statistics from filtered data
  const summary = useMemo<VisitSummaryStats>(() => {
    const stats = visitStats.reduce(
      (acc, visit) => ({
        totalRevenue: acc.totalRevenue + visit.totalRevenue,
        totalPersonnelFee: acc.totalPersonnelFee + visit.totalPersonnelFee,
        netRevenue: acc.netRevenue + visit.netRevenue,
        totalServices: acc.totalServices + visit.services.length,
        uniqueClientIds: visit.client
          ? acc.uniqueClientIds.add(visit.client.id)
          : acc.uniqueClientIds,
        uniqueClientCount: 0,
      }),
      {
        totalRevenue: 0,
        totalPersonnelFee: 0,
        netRevenue: 0,
        totalServices: 0,
        uniqueClientIds: new Set<number>(),
        uniqueClientCount: 0,
      }
    );

    stats.uniqueClientCount = stats.uniqueClientIds.size;
    return stats;
  }, [visitStats]);

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="card-title text-lg font-bold">
                {t("analytics.visitHistory")}
              </h2>
            </div>

            {/* Summary Stats */}
            <div className="flex gap-6 text-base-content/70">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                <span className="font-medium">
                  {summary.totalRevenue.toLocaleString()} ₺
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4" />
                <span className="font-medium text-primary">
                  {summary.netRevenue.toLocaleString()} ₺
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="font-medium">
                  {summary.uniqueClientCount} {t("analytics.clients")}
                </span>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>{t("analytics.date")}</th>
                  <th>{t("analytics.client")}</th>
                  <th>{t("analytics.services")}</th>
                  <th>{t("analytics.personnel")}</th>
                  <th className="text-right">{t("analytics.extraPrice")}</th>
                  <th className="text-right">{t("analytics.discount")}</th>
                  <th className="text-right">{t("analytics.personnelFee")}</th>
                  <th className="text-right">{t("analytics.revenue")}</th>
                  <th className="text-right">{t("analytics.netRevenue")}</th>
                </tr>
              </thead>
              <tbody>
                {visitStats.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-center py-8 text-base-content/50"
                    >
                      {t("analytics.noVisitsFound")}
                    </td>
                  </tr>
                ) : (
                  visitStats.map((visit) => (
                    <tr key={visit.id} className="hover">
                      <td className="whitespace-nowrap">
                        {visit.startTime
                          ? format(visit.startTime, "yyyy-MM-dd HH:mm")
                          : t("analytics.notAvailable")}
                      </td>
                      <td>
                        <div className="font-medium">
                          {visit.client?.name || t("analytics.unknownClient")}
                        </div>
                        <div className="text-sm text-base-content/70">
                          {visit.client?.nationalCo}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {visit.services.map((service, idx) => (
                            <span
                              key={`${visit.id}-${service.id}-${idx}`}
                              className="badge badge-sm badge-primary"
                            >
                              {service.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {visit.personnel.map((person, idx) => (
                            <span
                              key={`${visit.id}-${person.id}-${idx}`}
                              className="badge badge-sm badge-secondary"
                              title={`${person.precent}%`}
                            >
                              {person.name}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="text-right font-medium text-primary">
                        {(
                          visit.operations?.[0]?.extraPrice || 0
                        ).toLocaleString()}{" "}
                        ₺
                      </td>
                      <td className="text-right font-medium text-secondary">
                        {(
                          visit.operations?.[0]?.discount || 0
                        ).toLocaleString()}{" "}
                        ₺
                      </td>
                      <td className="text-right font-medium text-warning">
                        {visit.totalPersonnelFee.toLocaleString()} ₺
                      </td>
                      <td className="text-right font-medium">
                        {visit.totalRevenue.toLocaleString()} ₺
                      </td>
                      <td className="text-right font-medium text-success">
                        {visit.netRevenue.toLocaleString()} ₺
                      </td>
                    </tr>
                  ))
                )}
                {/* Summary row */}
                <tr className="font-medium bg-base-200">
                  <td>{t("analytics.totals")}</td>
                  <td>
                    {summary.uniqueClientCount} {t("analytics.uniqueClients")}
                  </td>
                  <td>
                    {summary.totalServices} {t("analytics.totalServices")}
                  </td>
                  <td></td>
                  <td className="text-right text-primary">
                    {visitStats
                      .reduce(
                        (sum, visit) =>
                          sum + (visit.operations?.[0]?.extraPrice || 0),
                        0
                      )
                      .toLocaleString()}{" "}
                    ₺
                  </td>
                  <td className="text-right text-secondary">
                    {visitStats
                      .reduce(
                        (sum, visit) =>
                          sum + (visit.operations?.[0]?.discount || 0),
                        0
                      )
                      .toLocaleString()}{" "}
                    ₺
                  </td>
                  <td className="text-right text-warning">
                    {summary.totalPersonnelFee.toLocaleString()} ₺
                  </td>
                  <td className="text-right">
                    {summary.totalRevenue.toLocaleString()} ₺
                  </td>
                  <td className="text-right text-success">
                    {summary.netRevenue.toLocaleString()} ₺
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
