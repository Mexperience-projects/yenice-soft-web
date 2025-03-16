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

interface PersonnelChartsProps {
  personnelWithMetrics: PersonnelWithMetrics[];
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
}: PersonnelChartsProps) {
  const { t } = useTranslation();

  // Calculate service distribution
  const serviceStats = useMemo(() => {
    if (!personnelWithMetrics || personnelWithMetrics.length === 0) {
      return [];
    }

    const stats = new Map<
      string,
      { name: string; count: number; revenue: number }
    >();

    personnelWithMetrics.forEach((person) => {
      if (!person.services) return;

      person.services.forEach((service) => {
        if (!service) return;

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

    return Array.from(stats.values());
  }, [personnelWithMetrics]);

  // Calculate revenue and expense trends
  const revenueStats = useMemo(() => {
    if (!personnelWithMetrics || personnelWithMetrics.length === 0) {
      return [];
    }

    const stats = new Map<
      string,
      { name: string; revenue: number; expense: number }
    >();

    personnelWithMetrics.forEach((person) => {
      if (!person.payments) return;

      person.payments.forEach((payment) => {
        if (!payment || !payment.date) return;

        const date = new Date(payment.date).toLocaleDateString();
        const existing = stats.get(date) || {
          name: date,
          revenue: 0,
          expense: 0,
        };
        stats.set(date, {
          name: date,
          revenue: existing.revenue,
          expense: existing.expense + (payment.price || 0),
        });
      });
    });

    return Array.from(stats.values()).sort(
      (a, b) => new Date(a.name).getTime() - new Date(b.name).getTime()
    );
  }, [personnelWithMetrics]);

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
        <div className="card bg-white shadow-lg border border-gray-100 lg:col-span-2">
          <div className="card-body flex items-center justify-center p-10">
            <p className="text-lg text-gray-500">
              {t("analytics.noPersonnelDataToDisplay")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Revenue and Expense Trends */}
      <div className="card bg-white shadow-lg border border-gray-100 lg:col-span-2">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">
            {t("analytics.revenueAndExpenseTrends")}
          </h3>
          <div className="h-[300px]">
            {revenueStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={revenueStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    name={t("analytics.revenue")}
                    stroke="#10b981"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    name={t("analytics.expense")}
                    stroke="#ef4444"
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
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">
            {t("analytics.personnelPerformance")}
          </h3>
          <div className="h-[300px]">
            {performanceStats.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={performanceStats}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => formatPrice(Number(value))} />
                  <Legend />
                  <Bar
                    dataKey="revenue"
                    name={t("analytics.revenue")}
                    fill="#10b981"
                  />
                  <Bar
                    dataKey="expense"
                    name={t("analytics.expense")}
                    fill="#ef4444"
                  />
                  <Bar
                    dataKey="profit"
                    name={t("analytics.profit")}
                    fill="#3b82f6"
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
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">
            {t("analytics.itemsPriceDistribution")}
          </h3>
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
                  <Tooltip content={<ItemsPieTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  {t("analytics.noItemsDataAvailable")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
