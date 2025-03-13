"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Calendar,
  DollarSign,
  Search,
  Package,
  CreditCard,
  Eye,
  Globe,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import type { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";
import type {
  PersonelType,
  ServicesType,
  VisitType,
  Visit_itemType,
  PaymentsType,
  OperationType,
  ItemsType,
} from "@/lib/types";
import { LowStockAlert } from "@/components/analiz/low-stock-alert";

// Import our custom hooks that use Redux
import { usePersonel_e02ed2 } from "@/hooks/personel/e02ed2";
import { useServices_10cd39 } from "@/hooks/services/10cd39";
import { useVisits } from "@/hooks/visit/ae978b";
import { usePayments } from "@/hooks/payments/main";
import { useItems_691d50 } from "@/hooks/items/691d50";
import { useAppSelector } from "@/store/HOCs";

export default function Analytics() {
  // Use the translation hook
  const { t, i18n } = useTranslation();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedService, setSelectedService] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedPersonnel, setSelectedPersonnel] =
    useState<PersonelType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);

  const [activeTab, setActiveTab] = useState("services");

  // Use our custom hooks with Redux
  const { loading: personnelLoading, get_personel_list_list } =
    usePersonel_e02ed2();
  const { loading: servicesLoading, get_services_list_list } =
    useServices_10cd39();
  const { get_visit_list_list } = useVisits();
  const { loading: paymentsLoading, get_payments_list_list } = usePayments();
  const { loading: itemsLoading, get_items_list_list } = useItems_691d50();

  // Get data from Redux store
  const personel_list = useAppSelector(
    (store) => store.personels
  ) as PersonelType[];
  const services_list = useAppSelector(
    (store) => store.services
  ) as ServicesType[];
  const visit_list = useAppSelector((store) => store.visits) as VisitType[];
  const payments_list = useAppSelector(
    (store) => store.payments
  ) as PaymentsType[];
  const items_list = useAppSelector((store) => store.items) as ItemsType[];

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        console.log("Starting to fetch data...");

        // Call each data fetching function individually to better track issues
        console.log("Fetching personnel data...");
        await get_personel_list_list();
        console.log("Personnel data fetched, count:", personel_list.length);

        console.log("Fetching services data...");
        await get_services_list_list();
        console.log("Services data fetched, count:", services_list.length);

        console.log("Fetching visits data...");
        await get_visit_list_list();
        console.log("Visits data fetched, count:", visit_list.length);

        console.log("Fetching payments data...");
        await get_payments_list_list();
        console.log("Payments data fetched, count:", payments_list.length);

        console.log("Fetching items data...");
        await get_items_list_list();
        console.log("Items data fetched, count:", items_list.length);

        console.log("All data fetched successfully!");

        // Set animate in after data is loaded
        setAnimateIn(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (searchQuery) count++;
    if (dateRange?.from && dateRange?.to) count++;
    if (selectedService !== "all") count++;
    setActiveFilters(count);
  }, [searchQuery, dateRange, selectedService]);

  // Add console logs to help diagnose the issue
  useEffect(() => {
    if (personel_list.length > 0) {
      console.log("Personnel data structure:", personel_list[0]);
    }
    if (services_list.length > 0) {
      console.log("Services data structure:", services_list[0]);
    }
    if (visit_list.length > 0) {
      console.log("Visit data structure:", visit_list[0]);
    }
    if (payments_list.length > 0) {
      console.log("Payment data structure:", payments_list[0]);
    }
  }, [personel_list, services_list, visit_list, payments_list]);

  // Extract visit items from the visits data structure
  const visitItems = useMemo(() => {
    console.log("Calculating visit items from", visit_list.length, "visits");
    const allVisitItems: Visit_itemType[] = [];
    visit_list.forEach((visit) => {
      if (visit.operations) {
        visit.operations.forEach((operation) => {
          if (operation.items) {
            operation.items.forEach((item) => {
              allVisitItems.push(item);
            });
          }
        });
      }
    });
    console.log("Total visit items:", allVisitItems.length);
    return allVisitItems;
  }, [visit_list]);

  // Calculate total metrics
  const totalVisits = useMemo(() => visit_list.length, [visit_list]);

  const totalItems = useMemo(
    () => visitItems.reduce((total, item) => total + (item.count || 1), 0),
    [visitItems]
  );

  const totalRevenue = useMemo(
    () => payments_list.reduce((total, payment) => total + payment.price, 0),
    [payments_list]
  );

  const totalPersonnelPayments = useMemo(
    () =>
      personel_list.reduce(
        (total, person) => total + (person.doctorExpense || 0),
        0
      ),
    [personel_list]
  );

  // Filter personnel based on search query and service
  const filteredPersonnel = useMemo(() => {
    console.log("Filtering personnel from", personel_list.length, "records");
    console.log("Current search query:", searchQuery);
    console.log("Selected service:", selectedService);
    console.log("Date range:", dateRange);

    return personel_list.filter((person) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        person.name.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by service
      const matchesService =
        selectedService === "all" ||
        services_list.some(
          (service) =>
            service.personel?.some((p) => p.id === person.id) &&
            (selectedService === "all" ||
              service.id.toString() === selectedService)
        );

      // Filter by date range
      let matchesDateRange = true;
      if (dateRange?.from && dateRange?.to) {
        const personVisits = visit_list.filter(
          (visit) =>
            visit.operations &&
            visit.operations.some(
              (op) =>
                op.service &&
                op.service.some(
                  (s) => s.personel?.some((p) => p.id === person.id)
                )
            )
        );

        matchesDateRange = personVisits.some(
          (visit) =>
            visit.operations &&
            visit.operations.some((op) => {
              if (!op.datetime) return false;
              const opDate = new Date(op.datetime);
              return isWithinInterval(opDate, {
                start: dateRange.from!,
                end: dateRange.to!,
              });
            })
        );
      }

      const result = matchesSearch && matchesService && matchesDateRange;
      return result;
    });
  }, [
    personel_list,
    searchQuery,
    selectedService,
    dateRange,
    services_list,
    visit_list,
  ]);

  // Calculate metrics for each personnel
  const personnelWithMetrics = useMemo(() => {
    console.log(
      "Calculating metrics for",
      filteredPersonnel.length,
      "personnel"
    );

    // First, let's analyze the visit data structure to understand how to extract personnel info
    if (visit_list.length > 0) {
      console.log(
        "Sample visit structure:",
        JSON.stringify(visit_list[0], null, 2)
      );
    }

    // Create a map to store metrics for each personnel
    const personnelMetrics = new Map();

    // Process all visits to extract personnel metrics
    visit_list.forEach((visit) => {
      if (!visit.operations) return;

      visit.operations.forEach((operation) => {
        if (!operation.service) return;

        // Find the personnel associated with each service in this operation
        operation.service.forEach((service) => {
          if (!service.personel) return;

          service.personel.forEach((personel) => {
            const personnelId = personel.id;

            // Initialize metrics for this personnel if not already done
            if (!personnelMetrics.has(personnelId)) {
              personnelMetrics.set(personnelId, {
                visitCount: 0,
                itemCount: 0,
                revenue: 0,
                visits: [],
                visitItems: [],
                payments: [],
              });
            }

            const metrics = personnelMetrics.get(personnelId);

            // Count this as a visit for the personnel
            if (!metrics.visits.some((v: VisitType) => v.id === visit.id)) {
              metrics.visits.push(visit);
              metrics.visitCount++;
            }

            // Add items used in this operation
            if (operation.items) {
              operation.items.forEach((item) => {
                metrics.visitItems.push(item);
                metrics.itemCount += item.count || 1;
              });
            }

            // Add revenue from this operation
            if (operation.payments) {
              operation.payments.forEach((payment) => {
                if (payment.personel_id?.includes(personnelId)) {
                  metrics.payments.push(payment);
                  metrics.revenue += payment.price || 0;
                }
              });
            }
          });
        });
      });
    });

    console.log("Personnel metrics map:", personnelMetrics);

    // Combine the metrics with personnel data
    const result = filteredPersonnel
      .map((person) => {
        const metrics = personnelMetrics.get(person.id) || {
          visitCount: 0,
          itemCount: 0,
          revenue: 0,
          visits: [],
          visitItems: [],
          payments: [],
        };

        // Get services provided by this personnel
        const personServices = services_list.filter(
          (service) => service.personel?.some((p) => p.id === person.id)
        );

        return {
          ...person,
          visitCount: metrics.visitCount,
          itemCount: metrics.itemCount,
          revenue: metrics.revenue,
          expense: person.doctorExpense || 0,
          services: personServices,
          visits: metrics.visits,
          visitItems: metrics.visitItems,
          payments: metrics.payments,
        };
      })
      .sort((a, b) => b.revenue - a.revenue); // Sort by revenue (highest first)

    console.log("Final personnel with metrics:", result);
    return result;
  }, [filteredPersonnel, visit_list, services_list]);

  // Handle opening the personnel detail modal
  const handlePersonnelClick = (
    person: PersonelType & {
      visitCount: number;
      itemCount: number;
      revenue: number;
      services: ServicesType[];
      visits: VisitType[];
      visitItems: Visit_itemType[];
      payments: PaymentsType[];
    }
  ) => {
    setSelectedPersonnel(person);
    setIsModalOpen(true);
  };

  // Toggle language
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "tr" : "en";
    i18n.changeLanguage(newLang);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedService("all");
    setDateRange(undefined);
  };

  // Apply filters and close filter section
  const applyFilters = () => {
    setShowFilters(false);
    // Filters are already applied reactively through state changes
  };

  // Check if any data is still loading
  const isDataLoading =
    personnelLoading || servicesLoading || paymentsLoading || itemsLoading;

  return (
    <div
      className={`min-h-screen bg-base-100 transition-opacity duration-500 opacity-100`}
    >
      {/* Loading overlay */}
      {isDataLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-lg font-medium">{t("analytics.loading")}</p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto py-6 px-4 space-y-8">
        {/* Page header */}
        <div
          className={`flex justify-between items-center transition-all duration-500 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
          }`}
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {t("analytics.analysis")}
            </h1>
            <p className="text-base-content/70 mt-1">
              {t("analytics.personnelAnalytics")}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className={`btn btn-outline btn-sm gap-2 relative ${
                activeFilters > 0 ? "border-primary text-primary" : ""
              }`}
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              {t("analytics.filters")}
              {activeFilters > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilters}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters Section */}
        {showFilters && (
          <div
            className={`bg-white shadow-md rounded-lg p-4 transition-all duration-300 ease-in-out ${
              showFilters
                ? "opacity-100 translate-y-0"
                : "opacity-0 -translate-y-4 pointer-events-none"
            }`}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                {t("analytics.filterData")}
              </h3>
              <button
                className="btn btn-ghost btn-sm p-1 h-8 w-8"
                onClick={() => setShowFilters(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("analytics.searchPersonnel")}
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/50" />
                  <input
                    type="text"
                    placeholder={t("analytics.searchPersonnel")}
                    className="input input-bordered w-full pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("analytics.filterByDate")}
                </label>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <input
                      type="date"
                      className="input input-bordered w-full pl-12"
                      value={
                        dateRange?.from
                          ? format(dateRange.from, "yyyy-MM-dd")
                          : ""
                      }
                      onChange={(e) => {
                        const fromDate = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        setDateRange((prev) => ({
                          from: fromDate,
                          to: prev?.to,
                        }));
                      }}
                      placeholder="From"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-base-content/50 text-sm">
                      {!dateRange?.from && "From"}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      className="input input-bordered w-full  pl-10"
                      value={
                        dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""
                      }
                      onChange={(e) => {
                        const toDate = e.target.value
                          ? new Date(e.target.value)
                          : undefined;
                        setDateRange((prev) => ({
                          from: prev?.from,
                          to: toDate,
                        }));
                      }}
                      placeholder="To"
                    />
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-base-content/50 text-sm">
                      {!dateRange?.to && "To"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {t("analytics.filterByService")}
                </label>
                <select
                  className="select select-bordered w-full"
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                >
                  <option value="all">{t("analytics.allServices")}</option>
                  {services_list.map((service) => (
                    <option key={service.id} value={service.id.toString()}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end mt-4 gap-2">
              <button className="btn btn-outline btn-sm" onClick={resetFilters}>
                {t("analytics.resetFilters")}
              </button>
              <button className="btn btn-primary btn-sm" onClick={applyFilters}>
                {t("analytics.applyFilters")}
              </button>
            </div>
          </div>
        )}

        {/* Summary Cards */}
        <div
          className={`grid gap-6 md:grid-cols-4 transition-all duration-500 sticky ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          {/* Total Visits Card */}
          <div className="card bg-white shadow-lg border border-gray-100">
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-sm font-medium">
                  {t("analytics.totalVisits")}
                </h2>
                <div className="bg-primary/10 p-2 rounded-full">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-2">
                {totalVisits.toLocaleString()}
              </div>
              <p className="text-xs text-base-content/70 mt-1">
                {t("analytics.acrossAllPersonnel")}
              </p>
            </div>
          </div>

          {/* Total Items Card */}
          <div className="card bg-white shadow-lg border border-gray-100">
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-sm font-medium">
                  {t("analytics.itemsUsed")}
                </h2>
                <div className="bg-secondary/10 p-2 rounded-full">
                  <Package className="h-4 w-4 text-secondary" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-2">
                {totalItems.toLocaleString()}
              </div>
              <p className="text-xs text-base-content/70 mt-1">
                {t("analytics.totalConsumedItems")}
              </p>
            </div>
          </div>

          {/* Total Revenue Card */}
          <div className="card bg-white shadow-lg border border-gray-100">
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-sm font-medium">
                  {t("analytics.totalRevenue")}
                </h2>
                <div className="bg-accent/10 p-2 rounded-full">
                  <DollarSign className="h-4 w-4 text-accent" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-2">
                ${totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-base-content/70 mt-1">
                {t("analytics.fromAllServices")}
              </p>
            </div>
          </div>

          {/* Personnel Payments Card */}
          <div className="card bg-white shadow-lg border border-gray-100">
            <div className="card-body p-6">
              <div className="flex items-center justify-between">
                <h2 className="card-title text-sm font-medium">
                  {t("analytics.personnelPayments")}
                </h2>
                <div className="bg-info/10 p-2 rounded-full">
                  <CreditCard className="h-4 w-4 text-info" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-2">
                ${totalPersonnelPayments.toLocaleString()}
              </div>
              <p className="text-xs text-base-content/70 mt-1">
                {t("analytics.totalExpensesToPersonnel")}
              </p>
            </div>
          </div>
        </div>

        {/* Personnel Table */}
        <div
          className={`transition-all duration-500 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "300ms" }}
        >
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
                      <th className="text-right">{t("analytics.itemsUsed")}</th>
                      <th className="text-right">{t("analytics.revenue")}</th>
                      <th className="text-right">{t("analytics.payments")}</th>
                      <th className="text-right">{t("analytics.profit")}</th>
                      <th className="text-right">{t("analytics.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personnelWithMetrics.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="text-center py-8 text-base-content/50"
                        >
                          {t("analytics.noPersonnelFound")}
                        </td>
                      </tr>
                    ) : (
                      personnelWithMetrics.map((person) => (
                        <tr key={person.id} className="hover">
                          <td className="font-medium">{person.name}</td>
                          <td className="text-right">{person.visitCount}</td>
                          <td className="text-right">{person.itemCount}</td>
                          <td className="text-right">
                            ${person.revenue.toLocaleString()}
                          </td>
                          <td className="text-right">
                            ${person.expense.toLocaleString()}
                          </td>
                          <td className="text-right">
                            <span
                              className={
                                person.revenue - person.expense > 0
                                  ? "text-success font-medium"
                                  : "text-error font-medium"
                              }
                            >
                              $
                              {(
                                person.revenue - person.expense
                              ).toLocaleString()}
                            </span>
                          </td>
                          <td className="text-right">
                            <button
                              className="btn btn-ghost btn-sm bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90"
                              onClick={() => handlePersonnelClick(person)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {t("analytics.details")}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Personnel Detail Modal */}
        {isModalOpen && (
          <div className="modal modal-open">
            <div className="modal-box max-w-3xl max-h-[90vh] overflow-y-auto">
              {selectedPersonnel && (
                <>
                  <h3 className="font-bold text-xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    {selectedPersonnel.name}
                  </h3>
                  <p className="text-base-content/70 mt-1">
                    {t("analytics.performanceMetrics")}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
                    <div className="stats bg-white shadow border border-gray-100">
                      <div className="stat">
                        <div className="stat-title">
                          {t("analytics.visits")}
                        </div>
                        <div className="stat-value">
                          {(selectedPersonnel as any).visitCount || 0}
                        </div>
                      </div>
                    </div>

                    <div className="stats bg-white shadow border border-gray-100">
                      <div className="stat">
                        <div className="stat-title">
                          {t("analytics.revenue")}
                        </div>
                        <div className="stat-value">
                          $
                          {(
                            (selectedPersonnel as any).revenue || 0
                          ).toLocaleString()}
                        </div>
                      </div>
                    </div>

                    <div className="stats bg-white shadow border border-gray-100">
                      <div className="stat">
                        <div className="stat-title">
                          {t("analytics.itemsUsed")}
                        </div>
                        <div className="stat-value">
                          {(selectedPersonnel as any).itemCount || 0}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="tabs tabs-boxed mb-6">
                    <a
                      className={`tab ${
                        activeTab === "services" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("services")}
                    >
                      {t("analytics.services")}
                    </a>
                    <a
                      className={`tab ${
                        activeTab === "visits" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("visits")}
                    >
                      {t("analytics.visits")}
                    </a>
                    <a
                      className={`tab ${
                        activeTab === "items" ? "tab-active" : ""
                      }`}
                      onClick={() => setActiveTab("items")}
                    >
                      {t("analytics.items")}
                    </a>
                  </div>

                  {activeTab === "services" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        {t("analytics.servicesProvided")}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead>
                            <tr>
                              <th>{t("analytics.serviceName")}</th>
                              <th className="text-right">
                                {t("analytics.price")}
                              </th>
                              <th className="text-right">
                                {t("analytics.itemsRequired")}
                              </th>
                              <th className="text-right">
                                {t("analytics.percentFee")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {!(selectedPersonnel as any).services?.length ? (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="text-center py-4 text-base-content/50"
                                >
                                  {t("analytics.noServicesFound")}
                                </td>
                              </tr>
                            ) : (
                              (selectedPersonnel as any).services?.map(
                                (service: ServicesType) => {
                                  // Find the personnel in this service
                                  const personnelInService =
                                    service.personel?.find(
                                      (p) => p.id === selectedPersonnel.id
                                    );

                                  return (
                                    <tr key={service.id}>
                                      <td>{service.name}</td>
                                      <td className="text-right">
                                        ${service.price.toLocaleString()}
                                      </td>
                                      <td className="text-right">
                                        {service.items?.length || 0}
                                      </td>
                                      <td className="text-right">
                                        {personnelInService?.precent || 0}%
                                      </td>
                                    </tr>
                                  );
                                }
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "visits" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        {t("analytics.visitHistory")}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead>
                            <tr>
                              <th>{t("analytics.date")}</th>
                              <th>{t("analytics.client")}</th>
                              <th>{t("analytics.service")}</th>
                              <th className="text-right">
                                {t("analytics.revenue")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {!(selectedPersonnel as any).visits?.length ? (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="text-center py-4 text-base-content/50"
                                >
                                  {t("analytics.noVisitsFound")}
                                </td>
                              </tr>
                            ) : (
                              (selectedPersonnel as any).visits?.flatMap(
                                (visit: VisitType) => {
                                  // Find operations for this personnel
                                  const personnelOperations =
                                    visit.operations &&
                                    visit.operations.filter(
                                      (op) =>
                                        op.service &&
                                        op.service.some(
                                          (s) =>
                                            s.personel?.some(
                                              (p) =>
                                                p.id === selectedPersonnel.id
                                            )
                                        )
                                    );

                                  return (
                                    personnelOperations &&
                                    personnelOperations.map(
                                      (
                                        operation: OperationType,
                                        opIndex: number
                                      ) => (
                                        <tr key={`${visit.id}-${opIndex}`}>
                                          <td>
                                            {operation.datetime
                                              ? format(
                                                  new Date(operation.datetime),
                                                  "yyyy-MM-dd"
                                                )
                                              : t("analytics.notApplicable")}
                                          </td>
                                          <td>
                                            {visit.client?.name ||
                                              t("analytics.unknown")}
                                          </td>
                                          <td>
                                            {(operation.service &&
                                              operation.service
                                                .filter(
                                                  (s) =>
                                                    s.personel?.some(
                                                      (p) =>
                                                        p.id ===
                                                        selectedPersonnel.id
                                                    )
                                                )
                                                .map((s) => s.name)
                                                .join(", ")) ||
                                              t("analytics.notApplicable")}
                                          </td>
                                          <td className="text-right">
                                            $
                                            {operation.payments &&
                                              operation.payments
                                                .filter(
                                                  (p) =>
                                                    p.personel_id?.includes(
                                                      selectedPersonnel.id
                                                    )
                                                )
                                                .reduce(
                                                  (sum, p) => sum + p.price,
                                                  0
                                                )
                                                .toLocaleString()}
                                          </td>
                                        </tr>
                                      )
                                    )
                                  );
                                }
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {activeTab === "items" && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">
                        {t("analytics.itemsUsed")}
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="table table-zebra">
                          <thead>
                            <tr>
                              <th>{t("analytics.itemName")}</th>
                              <th className="text-right">
                                {t("analytics.quantity")}
                              </th>
                              <th>{t("analytics.visitDate")}</th>
                              <th>{t("analytics.service")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {!(selectedPersonnel as any).visitItems?.length ? (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="text-center py-4 text-base-content/50"
                                >
                                  {t("analytics.noItemsFound")}
                                </td>
                              </tr>
                            ) : (
                              (selectedPersonnel as any).visitItems?.map(
                                (visitItem: Visit_itemType) => {
                                  const visit = visit_list.find(
                                    (v) =>
                                      v.operations &&
                                      v.operations.some(
                                        (op) =>
                                          op.items &&
                                          op.items.some(
                                            (i) => i.id === visitItem.id
                                          )
                                      )
                                  );

                                  const operation =
                                    visit?.operations &&
                                    visit.operations.find(
                                      (op) =>
                                        op.items &&
                                        op.items.some(
                                          (i) => i.id === visitItem.id
                                        )
                                    );

                                  return (
                                    <tr key={visitItem.id}>
                                      <td>{visitItem.item.name}</td>
                                      <td className="text-right">
                                        {visitItem.count}
                                      </td>
                                      <td>
                                        {operation?.datetime
                                          ? format(
                                              new Date(operation.datetime),
                                              "yyyy-MM-dd"
                                            )
                                          : t("analytics.notApplicable")}
                                      </td>
                                      <td>
                                        {(operation?.service &&
                                          operation.service
                                            .filter(
                                              (s) =>
                                                s.personel?.some(
                                                  (p) =>
                                                    p.id ===
                                                    selectedPersonnel.id
                                                )
                                            )
                                            .map((s) => s.name)
                                            .join(", ")) ||
                                          t("analytics.notApplicable")}
                                      </td>
                                    </tr>
                                  );
                                }
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  <div className="modal-action">
                    <button
                      className="btn bg-gradient-to-r from-primary to-secondary text-white border-none hover:opacity-90"
                      onClick={() => setIsModalOpen(false)}
                    >
                      {t("analytics.close")}
                    </button>
                  </div>
                </>
              )}
            </div>
            <div
              className="modal-backdrop"
              onClick={() => setIsModalOpen(false)}
            ></div>
          </div>
        )}
      </div>
    </div>
  );
}
