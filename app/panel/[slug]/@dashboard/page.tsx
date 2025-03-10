"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  BarChart,
  LineChart,
  PieChart,
  Bar,
  Line,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar,
  DollarSign,
  Users,
  UserCheck,
  Download,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  BarChart2,
  Award,
  Search,
  Bell,
  HelpCircle,
  Info,
  Filter,
  RefreshCw,
  Maximize2,
  X,
  Zap,
  Star,
  Bookmark,
  Share2,
  Printer,
  FileText,
} from "lucide-react";
import { format, startOfWeek, addDays, subMonths, subDays } from "date-fns";
import { useAppSelector } from "@/store/HOCs";

export default function Dashboard() {
  // State management
  const [dateRange, setDateRange] = useState("7d");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showTips, setShowTips] = useState(true);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [notifications, setNotifications] = useState(3);
  const [showNotifications, setShowNotifications] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Refs for scroll position and animations
  const mainRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setAnimateIn(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Focus search input when search is shown
  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  // Simulate refresh action
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  // Toggle card expansion
  const toggleCardExpansion = (cardId: string) => {
    if (expandedCard === cardId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(cardId);
      // Scroll to the expanded card
      setTimeout(() => {
        const element = document.getElementById(cardId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  // Handle filter toggle
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };

  // Get data from Redux store
  const personels = useAppSelector((state) => state.personels);
  const services = useAppSelector((state) => state.services);
  const visits = useAppSelector((state) => state.visits);
  const items = useAppSelector((state) => state.items);
  const clients = useAppSelector((state) => state.clients);
  const payments = useAppSelector((state) => state.payments);

  // Calculate metrics using useMemo to avoid recalculation on every render
  const totalRevenue = useMemo(() => {
    return payments.reduce((total, payment) => total + payment.price, 0);
  }, [payments]);

  const totalVisits = useMemo(() => visits.length, [visits]);
  const totalClients = useMemo(() => clients.length, [clients]);
  const totalPersonnel = useMemo(() => personels.length, [personels]);

  // Previous period metrics for comparison based on selected date range
  const prevPeriodRevenue = useMemo(() => {
    // Calculate based on date range
    switch (dateRange) {
      case "7d":
        return totalRevenue * 0.88;
      case "30d":
        return totalRevenue * 0.75;
      case "90d":
        return totalRevenue * 0.65;
      case "1y":
        return totalRevenue * 0.55;
      default:
        return totalRevenue * 0.88;
    }
  }, [totalRevenue, dateRange]);

  const revenueChange = useMemo(() => {
    return ((totalRevenue - prevPeriodRevenue) / prevPeriodRevenue) * 100;
  }, [totalRevenue, prevPeriodRevenue]);

  const prevPeriodVisits = useMemo(() => {
    // Calculate based on date range
    switch (dateRange) {
      case "7d":
        return totalVisits * 0.95;
      case "30d":
        return totalVisits * 0.85;
      case "90d":
        return totalVisits * 0.75;
      case "1y":
        return totalVisits * 0.65;
      default:
        return totalVisits * 0.95;
    }
  }, [totalVisits, dateRange]);

  const visitsChange = useMemo(() => {
    return ((totalVisits - prevPeriodVisits) / prevPeriodVisits) * 100;
  }, [totalVisits, prevPeriodVisits]);

  const prevPeriodClients = useMemo(() => {
    // Calculate based on date range
    switch (dateRange) {
      case "7d":
        return totalClients * 0.97;
      case "30d":
        return totalClients * 0.9;
      case "90d":
        return totalClients * 0.8;
      case "1y":
        return totalClients * 0.7;
      default:
        return totalClients * 0.97;
    }
  }, [totalClients, dateRange]);

  const clientsChange = useMemo(() => {
    return ((totalClients - prevPeriodClients) / prevPeriodClients) * 100;
  }, [totalClients, prevPeriodClients]);

  // Revenue by service
  const revenueByService = useMemo(() => {
    const serviceRevenue = services.map((service) => {
      // Calculate revenue for this service based on visits
      const revenue =
        service.price *
        visits.filter((visit) =>
          visit.operations.some((op) =>
            op.service.some((s) => s.id === service.id)
          )
        ).length;

      return {
        name: service.name,
        price: service.price,
        revenue,
        personnel: service.personel,
        items: service.items,
      };
    });

    // Sort by revenue (highest first)
    return serviceRevenue.sort((a, b) => b.revenue - a.revenue).slice(0, 6);
  }, [services, visits]);

  // Visits by day of week
  const visitsByDay = useMemo(() => {
    // Create array for days of the week
    const startDate = startOfWeek(new Date());
    const daysOfWeek = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(startDate, i);
      return format(date, "EEE"); // Mon, Tue, etc.
    });

    // Initialize data structure
    const visitsByDay = daysOfWeek.map((day) => ({
      date: day,
      visits: 0,
      revenue: 0,
    }));

    // Count visits by day
    visits.forEach((visit) => {
      visit.operations.forEach((op) => {
        const day = format(new Date(op.datetime), "EEE");
        const dayIndex = visitsByDay.findIndex((d) => d.date === day);
        if (dayIndex !== -1) {
          visitsByDay[dayIndex].visits += 1;

          // Add revenue from this operation
          const operationPayments = payments.filter(
            (p) => p.visit && p.visit.id === visit.id
          );
          visitsByDay[dayIndex].revenue += operationPayments.reduce(
            (sum, payment) => sum + payment.price,
            0
          );
        }
      });
    });

    return visitsByDay;
  }, [visits, payments]);

  // Revenue trend based on selected date range
  const revenueTrend = useMemo(() => {
    const now = new Date();
    let dataPoints = 6; // Default
    let format = "MMM"; // Default format (month)

    // Adjust based on date range
    switch (dateRange) {
      case "7d":
        dataPoints = 7;
        format = "EEE"; // Day of week
        break;
      case "30d":
        dataPoints = 6;
        format = "dd MMM"; // Day and month
        break;
      case "90d":
        dataPoints = 6;
        format = "MMM"; // Month
        break;
      case "1y":
        dataPoints = 12;
        format = "MMM"; // Month
        break;
    }

    return Array.from({ length: dataPoints }, (_, i) => {
      let date;
      if (dateRange === "7d") {
        date = subDays(now, 6 - i);
      } else if (dateRange === "30d") {
        date = subDays(now, 30 - i * 5);
      } else if (dateRange === "90d") {
        date = subMonths(now, 5 - i);
      } else {
        date = subMonths(now, 11 - i);
      }

      const label = "MMM";
      // Simulate increasing revenue trend
      const baseRevenue = totalRevenue / dataPoints;
      const factor = 0.7 + i * (0.3 / dataPoints); // Gradually increases

      return {
        label,
        revenue: Math.round(baseRevenue * factor),
        target: Math.round(baseRevenue * 1.2),
      };
    });
  }, [totalRevenue, dateRange]);

  // Payment status (paid vs unpaid)
  const paymentStatus = useMemo(() => {
    const paid = payments.filter((p) => p.paid).length;
    const unpaid = payments.filter((p) => !p.paid).length;
    const total = paid + unpaid;

    return [
      { name: "Paid", value: paid > 0 ? Math.round((paid / total) * 100) : 0 },
      {
        name: "Unpaid",
        value: unpaid > 0 ? Math.round((unpaid / total) * 100) : 0,
      },
    ];
  }, [payments]);

  // Top personnel by revenue
  const topPersonnel = useMemo(() => {
    return personels
      .map((person) => {
        // Get payments associated with this personnel
        const personnelPayments = payments.filter(
          (p) => p.personel_id === person.id
        );
        const revenue = personnelPayments.reduce(
          (sum, payment) => sum + payment.price,
          0
        );

        // Count visits for this personnel
        const visitCount = person.visits.length;

        return {
          name: person.name,
          revenue,
          visits: visitCount,
          expenses: person.doctorExpense,
        };
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);
  }, [personels, payments]);

  // Custom tooltip styles for charts
  const CustomTooltipStyle = {
    backgroundColor: "var(--b1)",
    borderColor: "var(--b3)",
    borderRadius: "0.75rem",
    padding: "12px",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
    border: "1px solid var(--b3)",
  };

  // Date range label for display
  const dateRangeLabel = useMemo(() => {
    switch (dateRange) {
      case "7d":
        return "Last 7 days";
      case "30d":
        return "Last 30 days";
      case "90d":
        return "Last 90 days";
      case "1y":
        return "Last year";
      default:
        return "Last 7 days";
    }
  }, [dateRange]);

  return (
    <div
      ref={mainRef}
      className={`min-h-screen bg-gray-100 transition-opacity duration-500 ${
        isLoading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-base-300">
          <div className="flex flex-col items-center">
            <div className="loading loading-spinner loading-lg text-primary"></div>
            <p className="mt-4 text-base-content/70">
              Loading dashboard data...
            </p>
          </div>
        </div>
      )}

      <div className="p-4 md:p-6">
        {/* Dashboard header */}
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 transition-all duration-500 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div>
            <h2 className="text-3xl font-bold text-base-content bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Dashboard Overview
            </h2>
            <p className="text-sm text-base-content/70 mt-1">
              Performance metrics for {dateRangeLabel}
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Revenue Card */}
          <div
            id="revenue-card"
            className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-500 ease-out border border-base-300 overflow-hidden ${
              expandedCard === "revenue-card"
                ? "md:col-span-2 md:row-span-2"
                : ""
            } ${
              animateIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-focus"></div>
            <div className="card-body p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">
                      Total Revenue
                    </p>
                    <h3 className="text-3xl font-bold mt-1">
                      ${totalRevenue.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-ghost btn-square"
                  onClick={() => toggleCardExpansion("revenue-card")}
                  aria-label={
                    expandedCard === "revenue-card"
                      ? "Collapse card"
                      : "Expand card"
                  }
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              <div
                className={`flex items-center mt-2 text-xs font-medium ${
                  revenueChange >= 0 ? "text-success" : "text-error"
                }`}
              >
                {revenueChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <span>
                  {Math.abs(revenueChange).toFixed(1)}% from previous period
                </span>
              </div>

              <div
                className={`mt-4 ${
                  expandedCard === "revenue-card" ? "h-60" : "h-12"
                }`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={
                      expandedCard === "revenue-card"
                        ? revenueTrend
                        : revenueTrend.slice(-4)
                    }
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenueSmall"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--p)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--p)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--p)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    {expandedCard === "revenue-card" && (
                      <>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="label" />
                        <YAxis />
                        <Tooltip contentStyle={CustomTooltipStyle} />
                        <Legend />
                      </>
                    )}
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--p)"
                      strokeWidth={2}
                      dot={expandedCard === "revenue-card"}
                      activeDot={{ r: 6 }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="none"
                      fill="url(#colorRevenueSmall)"
                      fillOpacity={0.3}
                    />
                    {expandedCard === "revenue-card" && (
                      <Line
                        type="monotone"
                        dataKey="target"
                        stroke="var(--su)"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4, strokeWidth: 0, fill: "var(--su)" }}
                      />
                    )}
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {expandedCard === "revenue-card" && (
                <div className="mt-4">
                  <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                    <div className="stat">
                      <div className="stat-title">Avg. Transaction</div>
                      <div className="stat-value text-primary text-2xl">
                        ${Math.round(totalRevenue / Math.max(1, totalVisits))}
                      </div>
                      <div className="stat-desc">Per visit</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Projected</div>
                      <div className="stat-value text-secondary text-2xl">
                        ${Math.round(totalRevenue * 1.15).toLocaleString()}
                      </div>
                      <div className="stat-desc">Next period</div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button className="btn btn-sm btn-outline gap-2">
                      <Star className="h-4 w-4" />
                      Save Report
                    </button>
                    <button className="btn btn-sm btn-primary gap-2">
                      <FileText className="h-4 w-4" />
                      Detailed Analysis
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Visits Card */}
          <div
            id="visits-card"
            className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-500 ease-out border border-base-300 overflow-hidden ${
              expandedCard === "visits-card"
                ? "md:col-span-2 md:row-span-2"
                : ""
            } ${
              animateIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-secondary to-secondary-focus"></div>
            <div className="card-body p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-3 rounded-full">
                    <Calendar className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">
                      Total Visits
                    </p>
                    <h3 className="text-3xl font-bold mt-1">
                      {totalVisits.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-ghost btn-square"
                  onClick={() => toggleCardExpansion("visits-card")}
                  aria-label={
                    expandedCard === "visits-card"
                      ? "Collapse card"
                      : "Expand card"
                  }
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              <div
                className={`flex items-center mt-2 text-xs font-medium ${
                  visitsChange >= 0 ? "text-success" : "text-error"
                }`}
              >
                {visitsChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <span>
                  {Math.abs(visitsChange).toFixed(1)}% from previous period
                </span>
              </div>

              <div
                className={`mt-4 ${
                  expandedCard === "visits-card" ? "h-60" : "h-12"
                }`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={visitsByDay}>
                    {expandedCard === "visits-card" && (
                      <>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip contentStyle={CustomTooltipStyle} />
                        <Legend />
                      </>
                    )}
                    <Bar
                      dataKey="visits"
                      fill="var(--s)"
                      radius={[4, 4, 0, 0]}
                      fillOpacity={0.8}
                      name="Visits"
                    />
                    {expandedCard === "visits-card" && (
                      <Bar
                        dataKey="revenue"
                        fill="var(--p)"
                        radius={[4, 4, 0, 0]}
                        fillOpacity={0.8}
                        name="Revenue ($)"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {expandedCard === "visits-card" && (
                <div className="mt-4">
                  <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                    <div className="stat">
                      <div className="stat-title">Busiest Day</div>
                      <div className="stat-value text-secondary text-2xl">
                        {
                          visitsByDay.reduce(
                            (max, day) => (day.visits > max.visits ? day : max),
                            {
                              date: "",
                              visits: 0,
                            }
                          ).date
                        }
                      </div>
                      <div className="stat-desc">
                        {
                          visitsByDay.reduce(
                            (max, day) => (day.visits > max.visits ? day : max),
                            {
                              date: "",
                              visits: 0,
                            }
                          ).visits
                        }{" "}
                        visits
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Avg. Daily</div>
                      <div className="stat-value text-accent text-2xl">
                        {Math.round(
                          visitsByDay.reduce(
                            (sum, day) => sum + day.visits,
                            0
                          ) / 7
                        )}
                      </div>
                      <div className="stat-desc">Visits per day</div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button className="btn btn-sm btn-outline gap-2">
                      <Bookmark className="h-4 w-4" />
                      Save Report
                    </button>
                    <button className="btn btn-sm btn-secondary gap-2">
                      <Calendar className="h-4 w-4" />
                      View Schedule
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Clients Card */}
          <div
            id="clients-card"
            className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-500 ease-out border border-base-300 overflow-hidden ${
              expandedCard === "clients-card"
                ? "md:col-span-2 md:row-span-2"
                : ""
            } ${
              animateIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent to-accent-focus"></div>
            <div className="card-body p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <Users className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">
                      Total Clients
                    </p>
                    <h3 className="text-3xl font-bold mt-1">
                      {totalClients.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-ghost btn-square"
                  onClick={() => toggleCardExpansion("clients-card")}
                  aria-label={
                    expandedCard === "clients-card"
                      ? "Collapse card"
                      : "Expand card"
                  }
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              <div
                className={`flex items-center mt-2 text-xs font-medium ${
                  clientsChange >= 0 ? "text-success" : "text-error"
                }`}
              >
                {clientsChange >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1" />
                )}
                <span>
                  {Math.abs(clientsChange).toFixed(1)}% from previous period
                </span>
              </div>

              <div
                className={`mt-4 ${
                  expandedCard === "clients-card" ? "h-60" : "h-12"
                }`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: "Jan", clients: totalClients * 0.85 },
                      { month: "Feb", clients: totalClients * 0.9 },
                      { month: "Mar", clients: totalClients * 0.95 },
                      { month: "Apr", clients: totalClients },
                    ]}
                  >
                    <defs>
                      <linearGradient
                        id="colorClientsSmall"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--a)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--a)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    {expandedCard === "clients-card" && (
                      <>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip contentStyle={CustomTooltipStyle} />
                        <Legend />
                      </>
                    )}
                    <Line
                      type="monotone"
                      dataKey="clients"
                      stroke="var(--a)"
                      strokeWidth={2}
                      dot={expandedCard === "clients-card"}
                      name="Clients"
                    />
                    <Area
                      type="monotone"
                      dataKey="clients"
                      stroke="none"
                      fill="url(#colorClientsSmall)"
                      fillOpacity={0.3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {expandedCard === "clients-card" && (
                <div className="mt-4">
                  <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                    <div className="stat">
                      <div className="stat-title">New Clients</div>
                      <div className="stat-value text-accent text-2xl">
                        +{Math.round(totalClients * 0.12)}
                      </div>
                      <div className="stat-desc">This period</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Retention</div>
                      <div className="stat-value text-info text-2xl">87%</div>
                      <div className="stat-desc">From previous period</div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button className="btn btn-sm btn-outline gap-2">
                      <Users className="h-4 w-4" />
                      Client List
                    </button>
                    <button className="btn btn-sm btn-accent gap-2">
                      <FileText className="h-4 w-4" />
                      Demographics
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Personnel Card */}
          <div
            id="personnel-card"
            className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-500 ease-out border border-base-300 overflow-hidden ${
              expandedCard === "personnel-card"
                ? "md:col-span-2 md:row-span-2"
                : ""
            } ${
              animateIn
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-info to-info-content"></div>
            <div className="card-body p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-info/10 p-3 rounded-full">
                    <UserCheck className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content/70">
                      Active Personnel
                    </p>
                    <h3 className="text-3xl font-bold mt-1">
                      {totalPersonnel}
                    </h3>
                  </div>
                </div>
                <button
                  className="btn btn-sm btn-ghost btn-square"
                  onClick={() => toggleCardExpansion("personnel-card")}
                  aria-label={
                    expandedCard === "personnel-card"
                      ? "Collapse card"
                      : "Expand card"
                  }
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center mt-2 text-xs font-medium text-success">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                <span>2 new since last month</span>
              </div>

              <div
                className={`mt-4 ${
                  expandedCard === "personnel-card" ? "h-60" : "h-12"
                }`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      expandedCard === "personnel-card"
                        ? topPersonnel
                        : topPersonnel.slice(0, 4)
                    }
                    layout={
                      expandedCard === "personnel-card"
                        ? "vertical"
                        : "horizontal"
                    }
                  >
                    {expandedCard === "personnel-card" && (
                      <>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          opacity={0.1}
                          horizontal={false}
                        />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={80} />
                        <Tooltip contentStyle={CustomTooltipStyle} />
                        <Legend />
                      </>
                    )}
                    <Bar
                      dataKey="revenue"
                      fill="var(--in)"
                      radius={
                        expandedCard === "personnel-card"
                          ? [0, 4, 4, 0]
                          : [4, 4, 0, 0]
                      }
                      fillOpacity={0.8}
                      name="Revenue ($)"
                    />
                    {expandedCard === "personnel-card" && (
                      <Bar
                        dataKey="visits"
                        fill="var(--s)"
                        radius={[0, 4, 4, 0]}
                        fillOpacity={0.8}
                        name="Visits"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {expandedCard === "personnel-card" && (
                <div className="mt-4">
                  <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
                    <div className="stat">
                      <div className="stat-title">Top Performer</div>
                      <div className="stat-value text-info text-2xl">
                        {topPersonnel[0]?.name || "N/A"}
                      </div>
                      <div className="stat-desc">
                        ${topPersonnel[0]?.revenue.toLocaleString() || 0}{" "}
                        revenue
                      </div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Avg. Revenue</div>
                      <div className="stat-value text-info text-2xl">
                        $
                        {Math.round(
                          topPersonnel.reduce((sum, p) => sum + p.revenue, 0) /
                            topPersonnel.length
                        ).toLocaleString()}
                      </div>
                      <div className="stat-desc">Per personnel</div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <button className="btn btn-sm btn-outline gap-2">
                      <UserCheck className="h-4 w-4" />
                      Staff Directory
                    </button>
                    <button className="btn btn-sm btn-info gap-2">
                      <Award className="h-4 w-4" />
                      Performance Review
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Revenue Trend and Payment Status */}
        <div
          className={`grid gap-6 md:grid-cols-7 mb-8 transition-all duration-500 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "500ms" }}
        >
          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 md:col-span-4">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="card-title text-lg font-bold">
                      Revenue Trend
                    </h3>
                    <p className="text-sm text-base-content/70">
                      Monthly revenue vs target
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="badge badge-primary badge-lg gap-1">
                    <ArrowUpRight className="h-3 w-3" />
                    12.5%
                  </div>
                  <div className="dropdown dropdown-end">
                    <div
                      tabIndex={0}
                      role="button"
                      className="btn btn-sm btn-ghost btn-circle"
                    >
                      <Info className="h-4 w-4" />
                    </div>
                    <div
                      tabIndex={0}
                      className="dropdown-content z-[1] card card-compact shadow-lg bg-base-100 w-64"
                    >
                      <div className="card-body">
                        <h3 className="card-title text-sm">About This Chart</h3>
                        <p className="text-xs text-base-content/70">
                          This chart shows your revenue trend over time compared
                          to target goals. The blue area represents actual
                          revenue, while the green line shows your targets.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={revenueTrend}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="label" />
                    <YAxis />
                    <Tooltip contentStyle={CustomTooltipStyle} />
                    <Legend />
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--p)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--p)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                      <linearGradient
                        id="colorTarget"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="var(--su)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="var(--su)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="var(--p)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Revenue ($)"
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="var(--su)"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target ($)"
                      dot={{ r: 4, strokeWidth: 0, fill: "var(--su)" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="flex flex-wrap justify-between items-center mt-4 gap-2">
                <div className="stats bg-base-200/50 shadow-sm">
                  <div className="stat p-2">
                    <div className="stat-title text-xs">Average</div>
                    <div className="stat-value text-primary text-lg">
                      $
                      {Math.round(
                        revenueTrend.reduce(
                          (sum, item) => sum + item.revenue,
                          0
                        ) / revenueTrend.length
                      ).toLocaleString()}
                    </div>
                  </div>
                  <div className="stat p-2">
                    <div className="stat-title text-xs">Highest</div>
                    <div className="stat-value text-secondary text-lg">
                      $
                      {Math.max(
                        ...revenueTrend.map((item) => item.revenue)
                      ).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 md:col-span-3">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-secondary/10 p-2 rounded-full">
                    <Activity className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h3 className="card-title text-lg font-bold">
                      Payment Status
                    </h3>
                    <p className="text-sm text-base-content/70">
                      Paid vs unpaid invoices
                    </p>
                  </div>
                </div>
                <div className="badge badge-outline badge-lg">This Month</div>
              </div>
              <div className="h-60 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={paymentStatus}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {paymentStatus.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "var(--su)" : "var(--er)"}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={CustomTooltipStyle} />
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-success/10 p-4 rounded-xl">
                  <p className="text-sm font-medium text-success">Paid</p>
                  <p className="text-2xl font-bold">
                    {paymentStatus[0].value}%
                  </p>
                  <p className="text-xs text-base-content/70 mt-1">
                    {Math.round(
                      payments.length * (paymentStatus[0].value / 100)
                    )}{" "}
                    invoices
                  </p>
                </div>
                <div className="bg-error/10 p-4 rounded-xl">
                  <p className="text-sm font-medium text-error">Unpaid</p>
                  <p className="text-2xl font-bold">
                    {paymentStatus[1].value}%
                  </p>
                  <p className="text-xs text-base-content/70 mt-1">
                    {Math.round(
                      payments.length * (paymentStatus[1].value / 100)
                    )}{" "}
                    invoices
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Service and Top Personnel */}
        <div
          className={`grid gap-6 md:grid-cols-2 transition-all duration-500 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "600ms" }}
        >
          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-accent/10 p-2 rounded-full">
                    <BarChart2 className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="card-title text-lg font-bold">
                      Revenue by Service
                    </h3>
                    <p className="text-sm text-base-content/70">
                      Top performing services
                    </p>
                  </div>
                </div>
                <button className="btn btn-sm btn-ghost">View All</button>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={revenueByService}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={CustomTooltipStyle} />
                    <Legend />
                    <defs>
                      <linearGradient
                        id="barGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--a)"
                          stopOpacity={1}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--a)"
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    </defs>
                    <Bar
                      dataKey="revenue"
                      fill="url(#barGradient)"
                      name="Revenue ($)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="table table-xs table-zebra">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Price</th>
                      <th>Revenue</th>
                      <th>Personnel</th>
                      <th>Items</th>
                    </tr>
                  </thead>
                  <tbody>
                    {revenueByService.map((service, index) => (
                      <tr key={index}>
                        <td>{service.name}</td>
                        <td>${service.price}</td>
                        <td>${service.revenue.toLocaleString()}</td>
                        <td>{service.personnel?.name}</td>
                        <td>{service.items}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300">
            <div className="card-body p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-info/10 p-2 rounded-full">
                    <Award className="h-5 w-5 text-info" />
                  </div>
                  <div>
                    <h3 className="card-title text-lg font-bold">
                      Top Personnel
                    </h3>
                    <p className="text-sm text-base-content/70">
                      By revenue generated
                    </p>
                  </div>
                </div>
                <button className="btn btn-sm btn-ghost">View All</button>
              </div>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="vertical"
                    data={topPersonnel}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 80,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      opacity={0.1}
                      horizontal={false}
                    />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={80} />
                    <Tooltip contentStyle={CustomTooltipStyle} />
                    <Legend />
                    <defs>
                      <linearGradient
                        id="barGradient2"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop
                          offset="0%"
                          stopColor="var(--in)"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="100%"
                          stopColor="var(--in)"
                          stopOpacity={0.6}
                        />
                      </linearGradient>
                    </defs>
                    <Bar
                      dataKey="revenue"
                      fill="url(#barGradient2)"
                      name="Revenue ($)"
                      radius={[0, 4, 4, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="overflow-x-auto mt-4">
                <table className="table table-xs table-zebra">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Revenue</th>
                      <th>Visits</th>
                      <th>Expenses</th>
                      <th>Profit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topPersonnel.map((person, index) => (
                      <tr key={index}>
                        <td>{person.name}</td>
                        <td>${person.revenue.toLocaleString()}</td>
                        <td>{person.visits}</td>
                        <td>${person.expenses.toLocaleString()}</td>
                        <td>
                          ${(person.revenue - person.expenses).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Performance Summary */}
        <div
          className={`card bg-base-100 shadow-lg hover:shadow-xl transition-all duration-500 ease-out border border-base-300 mt-8 ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "700ms" }}
        >
          <div className="card-body p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="card-title text-lg font-bold">
                    Weekly Performance
                  </h3>
                  <p className="text-sm text-base-content/70">
                    Visits and revenue by day
                  </p>
                </div>
              </div>
              <div className="badge badge-secondary badge-lg">This Week</div>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={visitsByDay}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip contentStyle={CustomTooltipStyle} />
                  <Legend />
                  <defs>
                    <linearGradient
                      id="colorWeeklyRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--p)"
                        stopOpacity={0.8}
                      />
                      <stop offset="95%" stopColor="var(--p)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient
                      id="colorWeeklyVisits"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="var(--s)"
                        stopOpacity={0.8}
                      />
                      <stop offset="95%" stopColor="var(--s)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="var(--p)"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                    name="Revenue ($)"
                    dot={{ r: 4, strokeWidth: 0, fill: "var(--p)" }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="visits"
                    stroke="var(--s)"
                    strokeWidth={3}
                    name="Visits"
                    dot={{ r: 4, strokeWidth: 0, fill: "var(--s)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="stats shadow-lg mt-6 bg-base-200/50 border border-base-300">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <DollarSign className="h-6 w-6" />
                </div>
                <div className="stat-title">Total Revenue</div>
                <div className="stat-value text-primary">
                  $
                  {visitsByDay
                    .reduce((sum, day) => sum + day.revenue, 0)
                    .toLocaleString()}
                </div>
                <div className="stat-desc">This Week</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <Calendar className="h-6 w-6" />
                </div>
                <div className="stat-title">Total Visits</div>
                <div className="stat-value text-secondary">
                  {visitsByDay.reduce((sum, day) => sum + day.visits, 0)}
                </div>
                <div className="stat-desc">This Week</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-accent">
                  <Users className="h-6 w-6" />
                </div>
                <div className="stat-title">Avg. Revenue/Visit</div>
                <div className="stat-value text-accent">
                  $
                  {Math.round(
                    visitsByDay.reduce((sum, day) => sum + day.revenue, 0) /
                      Math.max(
                        1,
                        visitsByDay.reduce((sum, day) => sum + day.visits, 0)
                      )
                  )}
                </div>
                <div className="stat-desc">Per Visit</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
