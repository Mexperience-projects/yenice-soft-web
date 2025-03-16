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
        <div className="card bg-white shadow-lg border border-gray-100 lg:col-span-2">
          <div className="card-body flex items-center justify-center p-10">
            <p className="text-lg text-gray-500">
              {t("analytics.noInventoryDataToDisplay")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Stock vs Usage Bar Chart */}
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">
            {t("analytics.stockVsUsage")}
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={inventoryStats.slice(0, 10)} // Limit to top 10 items for readability
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="stock"
                  name={t("analytics.totalStock")}
                  fill="#3b82f6"
                />
                <Bar
                  dataKey="usage"
                  name={t("analytics.totalUsage")}
                  fill="#f59e0b"
                />
                <Bar
                  dataKey="remaining"
                  name={t("analytics.remaining")}
                  fill="#10b981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Stock Status Radar Chart */}
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">
            {t("analytics.stockStatus")}
          </h3>
          <div className="h-[300px]">
            {stockStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={stockStatusData}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis />
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
                  <Legend />
                  <Tooltip />
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
      <div className="card bg-white shadow-lg border border-gray-100 lg:col-span-2">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">
            {t("analytics.revenueByItem")}
          </h3>
          <div className="h-[400px]">
            {revenueTreemapData.length > 0 &&
            revenueTreemapData.some((item) => item.size > 1) ? (
              <ResponsiveContainer width="100%" height="100%">
                <Treemap
                  data={revenueTreemapData}
                  dataKey="size"
                  stroke="#fff"
                  fill="#8884d8"
                  nameKey="name"
                  aspectRatio={4 / 3}
                >
                  <Tooltip />
                </Treemap>
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
    </div>
  );
}
