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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Treemap,
} from "recharts";
import type { ItemsType } from "@/lib/types";
import type { TreemapProps } from "recharts";

interface InventoryChartsProps {
  items_list: ItemsType[];
}

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

interface TreemapContentProps {
  root?: any;
  depth?: number;
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  index?: number;
  payload?: {
    color: string;
    name: string;
  };
  colors?: string[];
  rank?: number;
  name?: string;
}

export function InventoryCharts({ items_list }: InventoryChartsProps) {
  const { t } = useTranslation();

  // Calculate inventory statistics
  const inventoryStats = useMemo(() => {
    if (!items_list || items_list.length === 0) {
      return [];
    }

    return items_list.map((item) => {
      const usage = item.used || 0;
      const revenue = usage * (item.price || 0);
      const remaining = Math.max(0, (item.count || 0) - usage);
      const remainingPercentage =
        item.count > 0 ? (remaining / item.count) * 100 : 0;

      return {
        name: item.name || "Unknown Item",
        stock: item.count || 0,
        usage,
        revenue,
        remaining,
        remainingPercentage,
      };
    });
  }, [items_list]);

  // Prepare data for stock status radar chart
  const stockStatusData = useMemo(() => {
    return inventoryStats.slice(0, 8).map((item) => ({
      name: item.name,
      stock: item.remaining,
      usage: item.usage,
      fullMark: item.stock,
    }));
  }, [inventoryStats]);

  // Prepare data for revenue treemap
  const revenueTreemapData = useMemo(() => {
    return inventoryStats.map((item) => ({
      name: `${item.name}\n₺${item.revenue.toLocaleString()}`,
      size: Math.max(1, item.revenue), // Ensure minimum size of 1 to avoid rendering issues
      color: item.remainingPercentage < 20 ? "#ef4444" : "#10b981",
    }));
  }, [inventoryStats]);

  // Check if we have data to display
  const hasData = inventoryStats.length > 0;

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
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                {t("analytics.noInventoryData")}
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {t("analytics.noInventoryDataToDisplay")}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Stock vs Usage Bar Chart */}
      <div className="card bg-base-100 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              {t("analytics.stockVsUsage")}
            </h3>
            <div className="badge badge-primary">
              {inventoryStats.length} items
            </div>
          </div>
          <div className="h-[300px] relative group">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryStats.slice(0, 10)}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                <YAxis tick={{ fill: "#6b7280" }} />
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
                  dataKey="stock"
                  name={t("analytics.totalStock")}
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="usage"
                  name={t("analytics.totalUsage")}
                  fill="#f59e0b"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="remaining"
                  name={t("analytics.remaining")}
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stock Status Radar Chart */}
      <div className="card bg-base-100 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              {t("analytics.stockStatus")}
            </h3>
            <div className="badge badge-secondary">
              {stockStatusData.length} items
            </div>
          </div>
          <div className="h-[300px]">
            {stockStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={stockStatusData}
                >
                  <PolarGrid stroke="#e5e7eb" />
                  <PolarAngleAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                  <PolarRadiusAxis tick={{ fill: "#6b7280" }} />
                  <Radar
                    name={t("analytics.currentStock")}
                    dataKey="stock"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                  />
                  <Radar
                    name={t("analytics.usage")}
                    dataKey="usage"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                  />
                  <Legend
                    wrapperStyle={{
                      paddingTop: "1rem",
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  {t("analytics.noStockDataAvailable")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Revenue Treemap */}
      <div className="card bg-base-100 shadow-xl rounded-xl hover:shadow-2xl transition-shadow duration-300 lg:col-span-2">
        <div className="card-body">
          <div className="flex items-center justify-between mb-4">
            <h3 className="card-title text-lg font-semibold text-gray-900">
              {t("analytics.revenueByItem")}
            </h3>
            <div className="badge badge-accent">
              {revenueTreemapData.length} items
            </div>
          </div>
          <div className="h-[400px]">
            {revenueTreemapData.length > 0 &&
            revenueTreemapData.some((item) => item.size > 1) ? (
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={revenueTreemapData}
                  dataKey="size"
                  stroke="#ffffff"
                  fill="#8884d8"
                  nameKey="name"
                  aspectRatio={4 / 3}
                  animationDuration={500}
                >
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </Treemap>
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
                    {t("analytics.noRevenueDataAvailable")}
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
