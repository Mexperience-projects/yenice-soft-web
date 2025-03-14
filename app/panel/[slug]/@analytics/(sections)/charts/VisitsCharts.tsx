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
import type { VisitType, OperationType, PAYMENT_TYPE, ServicesType, Visit_itemType } from "@/lib/types";

interface VisitsChartsProps {
  visits: VisitType[];
}

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];

export function VisitsCharts({ visits }: VisitsChartsProps) {
  const { t } = useTranslation();

  // Calculate daily visit statistics
  const dailyStats = useMemo(() => {
    const stats = new Map<string, { date: string; count: number; revenue: number }>();
    
    visits.forEach((visit) => {
      const operations = visit.operations || [];
      const date = operations[0]?.datetime 
        ? new Date(operations[0].datetime).toLocaleDateString()
        : new Date().toLocaleDateString();

      const revenue = operations.reduce((sum: number, operation: OperationType) => {
        const serviceRevenue = operation.service.reduce((sSum: number, service: ServicesType) => sSum + service.price, 0);
        const itemRevenue = operation.items.reduce((iSum: number, item: Visit_itemType) => iSum + (item.count * item.item.price), 0);
        return sum + serviceRevenue + itemRevenue;
      }, 0);
      
      const existing = stats.get(date) || { date, count: 0, revenue: 0 };
      stats.set(date, {
        date,
        count: existing.count + 1,
        revenue: existing.revenue + revenue,
      });
    });

    return Array.from(stats.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [visits]);

  // Calculate service distribution
  const serviceStats = useMemo(() => {
    const stats = new Map<string, { name: string; count: number; revenue: number }>();
    
    visits.forEach((visit) => {
      visit.operations.forEach((operation) => {
        operation.service.forEach((service: ServicesType) => {
          const existing = stats.get(service.name) || { name: service.name, count: 0, revenue: 0 };
          stats.set(service.name, {
            name: service.name,
            count: existing.count + 1,
            revenue: existing.revenue + service.price,
          });
        });
      });
    });

    return Array.from(stats.values());
  }, [visits]);

  // Calculate payment type distribution
  const paymentStats = useMemo(() => {
    const stats = new Map<string, { name: string; count: number }>();
    const paymentTypes = ['credit_card', 'debit_card', 'cash_pay', 'card_to_card'];
    
    visits.forEach((visit) => {
      visit.operations.forEach((operation) => {
        operation.payments.forEach((payment) => {
          const paymentType = paymentTypes[payment.type];
          const existing = stats.get(paymentType) || { name: paymentType, count: 0 };
          stats.set(paymentType, {
            name: paymentType,
            count: existing.count + 1,
          });
        });
      });
    });

    return Array.from(stats.values());
  }, [visits]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Daily Visits and Revenue Line Chart */}
      <div className="card bg-white shadow-lg border border-gray-100 lg:col-span-2">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">{t("analytics.dailyVisitsAndRevenue")}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dailyStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="count"
                  name={t("analytics.visits")}
                  stroke="#3b82f6"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="revenue"
                  name={t("analytics.revenue")}
                  stroke="#10b981"
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Service Distribution Bar Chart */}
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">{t("analytics.serviceDistribution")}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={serviceStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="count"
                  name={t("analytics.visits")}
                  fill="#3b82f6"
                />
                <Bar
                  dataKey="revenue"
                  name={t("analytics.revenue")}
                  fill="#10b981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Payment Type Distribution Pie Chart */}
      <div className="card bg-white shadow-lg border border-gray-100">
        <div className="card-body">
          <h3 className="card-title text-lg mb-4">{t("analytics.paymentDistribution")}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStats}
                  dataKey="count"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={(entry) => `${entry.name}: ${entry.count}`}
                >
                  {paymentStats.map((entry, index) => (
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