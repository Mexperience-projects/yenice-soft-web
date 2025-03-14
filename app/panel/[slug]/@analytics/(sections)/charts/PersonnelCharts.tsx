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

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function PersonnelCharts({ personnelWithMetrics }: PersonnelChartsProps) {
  const { t } = useTranslation();

  // Calculate service distribution
  const serviceStats = useMemo(() => {
    const stats = new Map<string, { name: string; count: number; revenue: number }>();
    
    personnelWithMetrics.forEach((person) => {
      person.services.forEach((service) => {
        const existing = stats.get(service.name) || { name: service.name, count: 0, revenue: 0 };
        stats.set(service.name, {
          name: service.name,
          count: existing.count + 1,
          revenue: existing.revenue + service.price,
        });
      });
    });

    return Array.from(stats.values());
  }, [personnelWithMetrics]);

  // Calculate revenue and expense trends
  const revenueStats = useMemo(() => {
    const stats = new Map<string, { name: string; revenue: number; expense: number }>();
    
    personnelWithMetrics.forEach((person) => {

      person.payments.forEach((payment) => {
        const date = new Date(payment.date).toLocaleDateString();
        const existing = stats.get(date) || { name: date, revenue: 0, expense: 0 };
        stats.set(date, {
          name: date,
          revenue: existing.revenue,
          expense: existing.expense + payment.price,
        });
      });
    });

    return Array.from(stats.values())
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());
  }, [personnelWithMetrics]);

  // Calculate personnel performance metrics
  const performanceStats = useMemo(() => {
    return personnelWithMetrics.map((person) => ({
      name: person.name,
      revenue: person.revenue,
      expense: person.expense,
      profit: person.revenue - person.expense,
      visits: person.visitCount,
      items: person.itemsPrice,
    }));
  }, [personnelWithMetrics]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Revenue and Expense Trends */}
      <div className="card bg-white shadow-lg border border-gray-100 lg:col-span-2">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">{t("analytics.revenueAndExpenseTrends")}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={revenueStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
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
          </div>
        </div>
      </div>

      {/* Personnel Performance Bar Chart */}
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">{t("analytics.personnelPerformance")}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={performanceStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
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
          </div>
        </div>
      </div>

      {/* Items Usage Distribution Pie Chart */}
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">{t("analytics.itemsUsageDistribution")}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={performanceStats}
                  dataKey="items"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.items}`}
                >
                  {performanceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 