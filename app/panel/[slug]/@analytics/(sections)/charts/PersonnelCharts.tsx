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
import type { PersonnelWithMetrics } from "../types";
import type {
  VisitType,
  OperationType,
  PaymentsType,
  PersonelPayments,
} from "@/lib/types";
import { addDays, format, parseISO, subDays, startOfToday } from "date-fns";

interface PersonnelChartsProps {
  personnelWithMetrics: Array<
    PersonnelWithMetrics & {
      visits?: VisitType[];
    }
  >;
  dateRange?: { from?: string | undefined; to?: string | undefined };
  visit_list: VisitType[];
}

// Define interfaces for the item structure
interface ItemType {
  name: string;
  price: number;
  id?: number | string;
}

interface VisitItemType {
  item?: ItemType;
  count: number;
}

interface VisitWithItemsType {
  items?: VisitItemType[];
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export function PersonnelCharts({
  personnelWithMetrics,
  dateRange,
  visit_list,
}: PersonnelChartsProps) {
  const { t } = useTranslation();

  // Calculate revenue and expense trends
  const revenueStats = useMemo(() => {
    if (!personnelWithMetrics || personnelWithMetrics.length === 0) {
      return [];
    }

    const stats = new Map<
      string,
      { name: string; revenue: number; expense: number }
    >();

    // If date range is provided, use it; otherwise, use last 14 days
    const today = startOfToday();
    const todayStr = format(today, "yyyy-MM-dd");
    const endDate = dateRange?.to || todayStr;
    const startDate =
      dateRange?.from || format(subDays(today, 13), "yyyy-MM-dd");

    // Initialize all dates in range with 0 values
    let currentDate = parseISO(startDate);
    const endDateObj = parseISO(endDate);

    while (currentDate <= endDateObj) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const displayDate = format(currentDate, "dd/MM/yyyy");
      stats.set(dateStr, {
        name: displayDate,
        revenue: 0,
        expense: 0,
      });
      currentDate = addDays(currentDate, 1);
    }

    visit_list.forEach((visit: VisitType) => {
      visit.operations?.forEach((operation: OperationType) => {
        operation.payments?.forEach((payment: PaymentsType) => {
          if (payment.date) {
            const paymentDate = format(new Date(payment.date), "yyyy-MM-dd");

            if (stats.has(paymentDate)) {
              const current = stats.get(paymentDate)!;
              const paymentTotal = payment.price;
              stats.set(paymentDate, {
                ...current,
                revenue: current.revenue + paymentTotal,
              });
            }
          }
        });
      });
    });
    // Calculate revenue from visit payments
    personnelWithMetrics.forEach((personnel) => {
      // Calculate expenses from personnel payments
      personnel.payments?.forEach((payment: PersonelPayments) => {
        if (payment.date) {
          const paymentDate = format(new Date(payment.date), "yyyy-MM-dd");
          if (stats.has(paymentDate)) {
            const current = stats.get(paymentDate)!;
            stats.set(paymentDate, {
              ...current,
              expense: current.expense + payment.price,
            });
          }
        }
      });
    });

    // Convert map to array and sort by date
    return Array.from(stats.entries())
      .map(([date, data]) => ({
        name: data.name,
        revenue: data.revenue,
        expense: data.expense,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [personnelWithMetrics, dateRange, visit_list]);

  // Calculate personnel performance metrics
  const performanceStats = useMemo(() => {
    if (!personnelWithMetrics || personnelWithMetrics.length === 0) {
      return [];
    }

    return personnelWithMetrics.map((person) => ({
      name: person.name || "Unknown",
      revenue: person.revenue || 0,
      expense: person.expense || 0,
      profit: (person.revenue || 0) - (person.expense || 0),
      visits: person.visitCount || 0,
      items: person.itemsPrice || 0,
    }));
  }, [personnelWithMetrics]);

  // Calculate items price distribution
  const itemsStats = useMemo(() => {
    if (!personnelWithMetrics || personnelWithMetrics.length === 0) {
      return [];
    }

    const stats = new Map<
      string,
      { name: string; price: number; count: number }
    >();

    // Assuming each person has visits, and each visit has items
    personnelWithMetrics.forEach((person) => {
      // Check if itemsPrice property exists and is an array
      if (person.itemsPrice && Array.isArray(person.itemsPrice)) {
        person.itemsPrice.forEach((visit: VisitWithItemsType) => {
          // Check if items property exists and is an array
          if (visit.items && Array.isArray(visit.items)) {
            visit.items.forEach((item: VisitItemType) => {
              if (!item || !item.item) return;

              const itemName = item.item?.name || "Unknown Item";
              const itemPrice = item.item?.price || 0;
              const itemCount = item.count || 1;

              const existing = stats.get(itemName) || {
                name: itemName,
                price: 0,
                count: 0,
              };
              stats.set(itemName, {
                name: itemName,
                price: existing.price + itemPrice * itemCount,
                count: existing.count + itemCount,
              });
            });
          }
        });
      }
    });

    return Array.from(stats.values()).sort((a, b) => b.price - a.price); // Sort by price descending
  }, [personnelWithMetrics]);

  // Format price with Turkish Lira symbol
  const formatPrice = (price: number) => {
    return `${price.toLocaleString()} ₺`;
  };

  // Custom tooltip for the items pie chart
  const ItemsPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{`${t("analytics.price")}: ${formatPrice(data.price)}`}</p>
          <p className="text-sm">{`${t("common.count")}: ${data.count}`}</p>
        </div>
      );
    }
    return null;
  };

  // If there are no items, create a fallback dataset
  const itemsData =
    itemsStats.length > 0
      ? itemsStats
      : performanceStats.map((p) => ({
          name: p.name,
          price: p.items || 0,
          count: 1,
        }));

  // Check if we have data to display
  const hasData =
    performanceStats.length > 0 ||
    revenueStats.length > 0 ||
    itemsData.length > 0;

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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {t("analytics.noPersonnelData")}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t("analytics.noPersonnelDataToDisplay")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Revenue and Expense Trends */}
      <div className="card bg-base-100 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300 lg:col-span-2">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              {t("analytics.revenueAndExpenseTrends")}
            </h3>
            <div className="flex items-center gap-2">
              <div className="badge badge-primary">
                {revenueStats.length} days
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            {revenueStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#6b7280" }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis tick={{ fill: "#6b7280" }} />
                  <Tooltip
                    formatter={(value) => formatPrice(Number(value))}
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
                    type="monotone"
                    dataKey="revenue"
                    name={t("analytics.revenue")}
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: "#10b981", r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    name={t("analytics.expense")}
                    stroke="#ef4444"
                    strokeWidth={2}
                    dot={{ fill: "#ef4444", r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  {t("analytics.noRevenueDataAvailable")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Personnel Performance Bar Chart */}
      <div className="card bg-base-100 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              {t("analytics.personnelPerformance")}
            </h3>
            <div className="badge badge-secondary">
              {performanceStats.length} personnel
            </div>
          </div>
          <div className="h-[300px]">
            {performanceStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceStats}
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
                    formatter={(value) => formatPrice(Number(value))}
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
                    dataKey="revenue"
                    name={t("analytics.revenue")}
                    fill="#10b981"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="expense"
                    name={t("analytics.expense")}
                    fill="#ef4444"
                    radius={[0, 4, 4, 0]}
                  />
                  <Bar
                    dataKey="profit"
                    name={t("analytics.profit")}
                    fill="#3b82f6"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  {t("analytics.noPersonnelPerformanceDataAvailable")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items Price Distribution Pie Chart */}
      <div className="card bg-base-100 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              {t("analytics.itemsPriceDistribution")}
            </h3>
            <div className="badge badge-accent">{itemsData.length} items</div>
          </div>
          <div className="h-[300px]">
            {itemsData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={itemsData}
                    dataKey="price"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) =>
                      `${entry.name}: ${formatPrice(entry.price)}`
                    }
                  >
                    {itemsData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatPrice(Number(value))}
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="mt-1 text-sm text-gray-500">
                    {t("analytics.noItemsDataAvailable")}
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
