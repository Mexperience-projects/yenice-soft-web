"use client";

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import type {
  VisitType,
  OperationType,
  ServicesType,
  Visit_itemType,
} from "@/lib/types";

interface VisitsChartsProps {
  visits: VisitType[];
  filters?: {
    dateRange?: { from: string; to: string };
    selectedService?: string;
    selectedPersonnel?: string;
    paymentType?: string;
    minRevenue?: number;
    maxRevenue?: number;
  };
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export function VisitsCharts({ visits, filters }: VisitsChartsProps) {
  const { t } = useTranslation();

  // Calculate daily visit statistics with filters
  const dailyStats = useMemo(() => {
    if (!visits || visits.length === 0) {
      return [];
    }

    const stats = new Map<
      string,
      { date: string; count: number; revenue: number }
    >();

    visits.forEach((visit) => {
      if (!visit.operations || visit.operations.length === 0) return;

      // Apply filters
      const matchesService =
        !filters?.selectedService ||
        filters.selectedService === "all" ||
        visit.operations.some((op) =>
          op.service.some((s) => s.id.toString() === filters.selectedService)
        );

      const matchesPersonnel =
        !filters?.selectedPersonnel ||
        filters.selectedPersonnel === "all" ||
        visit.operations.some((op) =>
          op.service.some((s) =>
            s.personel?.some(
              (p) => p.id.toString() === filters.selectedPersonnel
            )
          )
        );

      const matchesPaymentType =
        !filters?.paymentType ||
        filters.paymentType === "all" ||
        visit.operations.some((op) =>
          op.payments.some((p) => p.type.toString() === filters.paymentType)
        );

      if (!matchesService || !matchesPersonnel || !matchesPaymentType) return;

      const operations = visit.operations || [];
      const date = operations[0]?.datetime
        ? new Date(operations[0].datetime).toLocaleDateString()
        : new Date().toLocaleDateString();

      // Check if date is within range
      if (
        filters?.dateRange?.from &&
        filters?.dateRange?.to &&
        (new Date(date) < new Date(filters.dateRange.from) ||
          new Date(date) > new Date(filters.dateRange.to))
      ) {
        return;
      }

      const revenue = operations.reduce(
        (sum: number, operation: OperationType) => {
          const serviceRevenue = operation.service
            ? operation.service.reduce(
                (sSum: number, service: ServicesType) =>
                  sSum + (service.price || 0),
                0
              )
            : 0;

          const itemRevenue = operation.items
            ? operation.items.reduce(
                (iSum: number, item: Visit_itemType) =>
                  iSum + (item.count || 0) * (item.item?.price || 0),
                0
              )
            : 0;

          return sum + serviceRevenue + itemRevenue;
        },
        0
      );

      // Apply revenue filters
      if (
        (filters?.minRevenue !== undefined && revenue < filters.minRevenue) ||
        (filters?.maxRevenue !== undefined && revenue > filters.maxRevenue)
      ) {
        return;
      }

      const existing = stats.get(date) || { date, count: 0, revenue: 0 };
      stats.set(date, {
        date,
        count: existing.count + 1,
        revenue: existing.revenue + revenue,
      });
    });

    return Array.from(stats.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [visits, filters]);

  // Calculate service distribution with filters
  const serviceStats = useMemo(() => {
    if (!visits || visits.length === 0) {
      return [];
    }

    const stats = new Map<
      string,
      { name: string; count: number; revenue: number }
    >();

    visits.forEach((visit) => {
      if (!visit.operations) return;

      // Apply date range filter
      const visitDate = visit.operations[0]?.datetime
        ? new Date(visit.operations[0].datetime)
        : null;
      if (
        visitDate &&
        filters?.dateRange?.from &&
        filters?.dateRange?.to &&
        (visitDate < new Date(filters.dateRange.from) ||
          visitDate > new Date(filters.dateRange.to))
      ) {
        return;
      }

      visit.operations.forEach((operation) => {
        if (!operation.service) return;

        // Apply personnel filter
        const matchesPersonnel =
          !filters?.selectedPersonnel ||
          filters.selectedPersonnel === "all" ||
          operation.service.some((s) =>
            s.personel?.some(
              (p) => p.id.toString() === filters.selectedPersonnel
            )
          );

        if (!matchesPersonnel) return;

        operation.service.forEach((service: ServicesType) => {
          if (!service) return;

          // Apply service filter
          if (
            filters?.selectedService &&
            filters.selectedService !== "all" &&
            service.id.toString() !== filters.selectedService
          ) {
            return;
          }

          const existing = stats.get(service.name) || {
            name: service.name,
            count: 0,
            revenue: 0,
          };
          stats.set(service.name, {
            name: service.name,
            count: existing.count + 1,
            revenue: existing.revenue + (service.price || 0),
          });
        });
      });
    });

    return Array.from(stats.values());
  }, [visits, filters]);

  // Calculate payment type distribution with filters
  const paymentStats = useMemo(() => {
    if (!visits || visits.length === 0) {
      return [];
    }

    const stats = new Map<
      string,
      { name: string; count: number; amount: number }
    >();
    const paymentTypes = [
      "credit_card",
      "debit_card",
      "cash_pay",
      "card_to_card",
    ];

    visits.forEach((visit) => {
      if (!visit.operations) return;

      // Apply date range filter
      const visitDate = visit.operations[0]?.datetime
        ? new Date(visit.operations[0].datetime)
        : null;
      if (
        visitDate &&
        filters?.dateRange?.from &&
        filters?.dateRange?.to &&
        (visitDate < new Date(filters.dateRange.from) ||
          visitDate > new Date(filters.dateRange.to))
      ) {
        return;
      }

      // Apply service and personnel filters
      const matchesService =
        !filters?.selectedService ||
        filters.selectedService === "all" ||
        visit.operations.some((op) =>
          op.service.some((s) => s.id.toString() === filters.selectedService)
        );

      const matchesPersonnel =
        !filters?.selectedPersonnel ||
        filters.selectedPersonnel === "all" ||
        visit.operations.some((op) =>
          op.service.some((s) =>
            s.personel?.some(
              (p) => p.id.toString() === filters.selectedPersonnel
            )
          )
        );

      if (!matchesService || !matchesPersonnel) return;

      visit.operations.forEach((operation) => {
        if (!operation.payments) return;

        operation.payments.forEach((payment) => {
          if (payment.type === undefined) return;

          // Apply payment type filter
          if (
            filters?.paymentType &&
            filters.paymentType !== "all" &&
            payment.type.toString() !== filters.paymentType
          ) {
            return;
          }

          const paymentType = paymentTypes[payment.type] || "unknown";
          const existing = stats.get(paymentType) || {
            name: paymentType,
            count: 0,
            amount: 0,
          };
          stats.set(paymentType, {
            name: paymentType,
            count: existing.count + 1,
            amount: existing.amount + (payment.price || 0),
          });
        });
      });
    });

    return Array.from(stats.values());
  }, [visits, filters]);

  // Check if we have data to display
  const hasData =
    dailyStats.length > 0 || serviceStats.length > 0 || paymentStats.length > 0;

  if (!hasData) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="card bg-base-100 shadow-xl rounded-xl lg:col-span-2">
          <div className="card-body flex items-center justify-center p-10">
            <div className="text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {t("analytics.noVisitData")}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t("analytics.noDataToDisplay")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Daily Visits and Revenue Line Chart */}
      <div className="card bg-base-100 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300 lg:col-span-2">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              {t("analytics.dailyVisitsAndRevenue")}
            </h3>
            <div className="badge badge-primary">{dailyStats.length} days</div>
          </div>
          <div className="h-[300px]">
            {dailyStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={dailyStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: "#6b7280" }} />
                  <YAxis yAxisId="left" tick={{ fill: "#6b7280" }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "1rem",
                    }}
                  />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="count"
                    name={t("analytics.visits")}
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6", r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="revenue"
                    name={t("analytics.revenue")}
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  {t("analytics.noVisitDataAvailable")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Service Distribution Bar Chart */}
      <div className="card bg-base-100 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              {t("analytics.serviceDistribution")}
            </h3>
            <div className="badge badge-secondary">
              {serviceStats.length} services
            </div>
          </div>
          <div className="h-[300px]">
            {serviceStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={serviceStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" tick={{ fill: "#6b7280" }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={150}
                    tick={{ fill: "#6b7280" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "1rem",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    name={t("analytics.visits")}
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="revenue"
                    name={t("analytics.revenue")}
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  {t("analytics.noServiceDataAvailable")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Type Distribution Pie Chart */}
      <div className="card bg-base-100 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              {t("analytics.paymentDistribution")}
            </h3>
            <div className="badge badge-accent">
              {paymentStats.length} types
            </div>
          </div>
          <div className="h-[300px]">
            {paymentStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentStats}
                    dataKey="amount"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) =>
                      `${entry.name}: ${entry.count} (${entry.amount} ₺)`
                    }
                  >
                    {paymentStats.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "1rem",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-500">
                    {t("analytics.noPaymentDataAvailable")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
