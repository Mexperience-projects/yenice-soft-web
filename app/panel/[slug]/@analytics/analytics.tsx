"use client";

import { useState, useMemo, useEffect } from "react";
import {
  SlidersHorizontal,
  Users,
  Package,
  Calendar,
  FilterIcon,
} from "lucide-react";
import { isWithinInterval } from "date-fns";
import { useTranslation } from "react-i18next";
import {
  type PersonelType,
  type ServicesType,
  type VisitType,
  type Visit_itemType,
  type PaymentsType,
  type ItemsType,
  type PersonelPayments,
  type OperationType,
  PAYMENT_TYPE2text,
} from "@/lib/types";

import { addDays, format, parseISO, subDays, startOfToday } from "date-fns";
// Import our custom hooks that use Redux
import { usePersonel_e02ed2 } from "@/hooks/personel/e02ed2";
import { useServices_10cd39 } from "@/hooks/services/10cd39";
import { useVisits } from "@/hooks/visit/ae978b";
import { usePayments } from "@/hooks/payments/main";
import { useItems_691d50 } from "@/hooks/items/691d50";
import { useAppSelector } from "@/store/HOCs";

// Import components
import { SummaryCards } from "./(sections)/SummaryCards";
import { FilterSection } from "./(sections)/FilterSection";
import { PersonnelTable } from "./(sections)/PersonnelTable";
import { InventoryTable } from "./(sections)/InventoryTable";
import { VisitsTable } from "./(sections)/VisitsTable";
import type { PersonnelWithMetrics } from "./(sections)/types";
import PersonnelModal from "../@presonels/(modals)/personel_modal";
import type {
  PersonnelFilters,
  InventoryFilters,
  VisitFilters,
} from "./(sections)/types";
import { PersonnelCharts } from "./(sections)/charts/PersonnelCharts";
import { InventoryCharts } from "./(sections)/charts/InventoryCharts";
import { VisitsCharts } from "./(sections)/charts/VisitsCharts";

// Add TabType for type safety
type TabType = "personnel" | "inventory" | "visits";

export default function Analytics() {
  // Use the translation hook
  const { t } = useTranslation();

  // State management
  const [selectedPersonnel, setSelectedPersonnel] =
    useState<PersonnelWithMetrics | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilters, setActiveFilters] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>("personnel");

  // Filter states for each table type
  const [personnelFilters, setPersonnelFilters] = useState<PersonnelFilters>({
    dateRange: undefined,
    searchQuery: "",
    selectedService: "all",
    minRevenue: undefined,
    maxRevenue: undefined,
  });

  const [inventoryFilters, setInventoryFilters] = useState<InventoryFilters>({
    dateRange: undefined,
    searchQuery: "",
    minStock: undefined,
    maxStock: undefined,
    showLowStock: false,
    sortBy: "name",
    sortOrder: "asc",
  });

  const [visitFilters, setVisitFilters] = useState<VisitFilters>({
    dateRange: undefined,
    searchQuery: "",
    selectedService: "all",
    selectedPersonnel: "all",
    paymentType: "all",
    minRevenue: undefined,
    maxRevenue: undefined,
    sortBy: "date",
    sortOrder: "desc",
  });

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
        get_personel_list_list();
        get_services_list_list();
        get_visit_list_list();
        get_payments_list_list();
        get_items_list_list();
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

  // Update active filters count based on current tab's filters
  useEffect(() => {
    const currentFilters = getCurrentFilters();
    let count = 0;

    // Count common filters
    if (currentFilters.searchQuery) count++;
    if (currentFilters.dateRange?.from && currentFilters.dateRange?.to) count++;

    // Count tab-specific filters
    switch (activeTab) {
      case "personnel":
        if ((currentFilters as PersonnelFilters).selectedService !== "all")
          count++;
        if ((currentFilters as PersonnelFilters).minRevenue !== undefined)
          count++;
        if ((currentFilters as PersonnelFilters).maxRevenue !== undefined)
          count++;
        break;
      case "inventory":
        if ((currentFilters as InventoryFilters).minStock !== undefined)
          count++;
        if ((currentFilters as InventoryFilters).maxStock !== undefined)
          count++;
        if ((currentFilters as InventoryFilters).showLowStock) count++;
        if ((currentFilters as InventoryFilters).sortBy !== "name") count++;
        break;
      case "visits":
        if ((currentFilters as VisitFilters).selectedService !== "all") count++;
        if ((currentFilters as VisitFilters).selectedPersonnel !== "all")
          count++;
        if ((currentFilters as VisitFilters).paymentType !== "all") count++;
        if ((currentFilters as VisitFilters).minRevenue !== undefined) count++;
        if ((currentFilters as VisitFilters).maxRevenue !== undefined) count++;
        break;
    }

    setActiveFilters(count);
  }, [activeTab, personnelFilters, inventoryFilters, visitFilters]);

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
    () => items_list.reduce((total, item) => total + item.used, 0),
    [items_list]
  );

  const totalRevenue = useMemo(
    () => payments_list.reduce((total, payment) => total + payment.price, 0),
    [payments_list]
  );

  const totalPersonnelPayments = useMemo(
    () =>
      personel_list.reduce((total, person) => total + (person.expense || 0), 0),
    [personel_list]
  );

  // Filter personnel based on personnel filters and calculate metrics
  const filteredPersonnel = useMemo(() => {
    // If no filters are active, return the full list with metrics
    if (
      !personnelFilters.searchQuery &&
      !personnelFilters.dateRange?.from &&
      !personnelFilters.dateRange?.to &&
      personnelFilters.selectedService === "all" &&
      personnelFilters.minRevenue === undefined &&
      personnelFilters.maxRevenue === undefined
    ) {
      return personel_list.map((person) => {
        // Get all visits for this person
        const personVisits = visit_list.filter((visit) =>
          visit.operations?.some((op) => op.personel?.id === person.id)
        );

        // Calculate filtered revenue
        const revenue = personVisits.reduce(
          (total, visit) =>
            total +
            visit.operations.reduce(
              (sum, op) =>
                sum + op.payments.reduce((pSum, p) => pSum + p.price, 0),
              0
            ),
          0
        );
        // Calculate items price
        const itemsPrice = personVisits
          .flatMap((visit) =>
            visit.operations
              ? visit.operations.flatMap((op) => op.items || [])
              : []
          )
          .reduce(
            (total, item) => total + item.count * (item.item?.price || 0),
            0
          );

        return {
          ...person,
          visits: personVisits,
          visitCount: personVisits.length,
          revenue,
          itemsPrice,
          expense: person.expense || 0,
        };
      });
    }

    return personel_list
      .map((person) => {
        // Get filtered visits for this person
        const personVisits = visit_list.filter((visit) => {
          const matchesPersonnel = visit.operations?.some(
            (op) => op.personel?.id === person.id
          );

          // Filter by date range if specified
          const matchesDateRange =
            !personnelFilters.dateRange?.from ||
            !personnelFilters.dateRange?.to ||
            (new Date(personnelFilters.dateRange.from) <=
              new Date(visit.operations[0].datetime) &&
              new Date(personnelFilters.dateRange.to) >=
                new Date(visit.operations[0].datetime));

          // Filter by service if specified
          const matchesService =
            personnelFilters.selectedService === "all" ||
            visit.operations?.some((op) =>
              op.service.some(
                (s) => s.id.toString() === personnelFilters.selectedService
              )
            );

          return matchesPersonnel && matchesDateRange && matchesService;
        });

        // Calculate filtered revenue
        const revenue = personVisits.reduce(
          (total, visit) =>
            total +
            visit.operations.reduce(
              (sum, op) =>
                sum + op.payments.reduce((pSum, p) => pSum + p.price, 0),
              0
            ),
          0
        );

        // Calculate items price for filtered visits
        const itemsPrice = personVisits
          .flatMap((visit) =>
            visit.operations
              ? visit.operations.flatMap((op) => op.items || [])
              : []
          )
          .reduce(
            (total, item) => total + item.count * (item.item?.price || 0),
            0
          );

        return {
          ...person,
          visits: personVisits,
          visitCount: personVisits.length,
          revenue,
          itemsPrice,
          expense: person.expense || 0,
        };
      })
      .filter((person) => {
        // Filter by search query
        const matchesSearch =
          !personnelFilters.searchQuery ||
          person.name
            .toLowerCase()
            .includes(personnelFilters.searchQuery.toLowerCase());

        // Filter by revenue range
        const matchesRevenueRange =
          (personnelFilters.minRevenue === undefined ||
            person.revenue >= personnelFilters.minRevenue) &&
          (personnelFilters.maxRevenue === undefined ||
            person.revenue <= personnelFilters.maxRevenue);

        return matchesSearch && matchesRevenueRange;
      });
  }, [personel_list, visit_list, payments_list, personnelFilters]);

  // Filter inventory items based on inventory filters
  const filteredItems = useMemo(() => {
    // If no filters are active, return the full list
    if (
      !inventoryFilters.searchQuery &&
      !inventoryFilters.dateRange?.from &&
      !inventoryFilters.dateRange?.to &&
      inventoryFilters.minStock === undefined &&
      inventoryFilters.maxStock === undefined &&
      !inventoryFilters.showLowStock
    ) {
      return items_list;
    }

    return items_list
      .filter((item) => {
        try {
          // Filter by search query
          const matchesSearch =
            !inventoryFilters.searchQuery ||
            item.name
              .toLowerCase()
              .includes(inventoryFilters.searchQuery.toLowerCase());

          // Filter by stock range
          const matchesStockRange =
            (inventoryFilters.minStock === undefined ||
              item.used >= inventoryFilters.minStock) &&
            (inventoryFilters.maxStock === undefined ||
              item.used <= inventoryFilters.maxStock);

          // Filter by low stock - using a fixed percentage or value
          const matchesLowStock =
            !inventoryFilters.showLowStock ||
            (item.count > 0 && item.used / item.count >= 0.7); // Consider low stock if 70% or more is used

          return matchesSearch && matchesStockRange && matchesLowStock;
        } catch (error) {
          console.error("Item filtering error:", error);
          return true; // In case of error, include this item
        }
      })
      .map((item) => {
        const visits = visit_list.filter((visit) =>
          visit.operations?.some((op) =>
            op.items?.some((i) => i.item?.id === item.id)
          )
        );

        const used = visits
          .flatMap((visit) => visit.operations?.flatMap((op) => op.items || []))
          .reduce((total, i) => total + i.count, 0);

        return {
          ...item,
          used,
        };
      });
  }, [items_list, inventoryFilters]);

  // Filter visits based on visit filters
  // Filter visits based on visit filters
  const filteredVisits = useMemo(() => {
    // If no filters are active, return the full list
    if (
      !visitFilters.searchQuery &&
      !visitFilters.dateRange?.from &&
      !visitFilters.dateRange?.to &&
      visitFilters.selectedService === "all" &&
      visitFilters.selectedPersonnel === "all" &&
      visitFilters.paymentType === "all" &&
      visitFilters.minRevenue === undefined &&
      visitFilters.maxRevenue === undefined
    ) {
      return visit_list;
    }

    return visit_list
      .map((visit) => {
        const payments = visit.operations?.map((op) =>
          op.payments.filter((p) => {
            // Filter by payment type
            const matchesPaymentType =
              visitFilters.paymentType === "all" ||
              p.type === visitFilters.paymentType;

            // Filter by date range if specified
            const matchesDateRange =
              (!visitFilters.dateRange?.from && !visitFilters.dateRange?.to) ||
              (p.date &&
                (!visitFilters.dateRange.from ||
                  p.date >= new Date(visitFilters.dateRange.from)) &&
                (!visitFilters.dateRange.to ||
                  p.date <= new Date(visitFilters.dateRange.to)));

            // Filter by revenue range if specified
            const matchesRevenue =
              (visitFilters.minRevenue === undefined ||
                p.price >= visitFilters.minRevenue) &&
              (visitFilters.maxRevenue === undefined ||
                p.price <= visitFilters.maxRevenue);

            return matchesPaymentType && matchesDateRange && matchesRevenue;
          })
        );
        return {
          ...visit,
          payments,
        };
      })
      .filter((visit) => {
        try {
          // Filter by search query
          const matchesSearch =
            !visitFilters.searchQuery ||
            visit.operations.some(
              (op) =>
                op.service.some((s) =>
                  s.name
                    .toLowerCase()
                    .includes(visitFilters.searchQuery.toLowerCase())
                ) ||
                op.items.some((i) =>
                  i.item.name
                    .toLowerCase()
                    .includes(visitFilters.searchQuery.toLowerCase())
                )
            );

          // Filter by selected service
          const matchesService =
            visitFilters.selectedService === "all" ||
            visit.operations.some((op) =>
              op.service.some(
                (s) => s.id.toString() === visitFilters.selectedService
              )
            );

          // Filter by selected personnel
          const matchesPersonnel =
            visitFilters.selectedPersonnel === "all" ||
            visit.operations.some(
              (op) =>
                op.personel?.id.toString() === visitFilters.selectedPersonnel
            );

          // Filter by payment type - fixed to handle enum correctly
          const matchesPaymentType =
            visitFilters.paymentType === "all" ||
            visit.operations.some((op) =>
              op.payments.some((p) => {
                // If paymentType is "all", match all payments
                if (visitFilters.paymentType === "all") return true;

                // Otherwise, compare the payment type directly with the enum value
                return (
                  PAYMENT_TYPE2text[p.type] ===
                  (visitFilters.paymentType as unknown as string)
                );
              })
            );

          // Filter by revenue range
          let matchesRevenue = true;
          if (
            visitFilters.minRevenue !== undefined ||
            visitFilters.maxRevenue !== undefined
          ) {
            const visitRevenue = visit.operations.reduce((sum, op) => {
              const serviceRevenue = op.service.reduce(
                (sSum, service) => sSum + service.price,
                0
              );
              const itemRevenue = op.items.reduce(
                (iSum, item) => iSum + item.count * item.item.price,
                0
              );
              return sum + serviceRevenue + itemRevenue;
            }, 0);

            matchesRevenue =
              (visitFilters.minRevenue === undefined ||
                visitRevenue >= visitFilters.minRevenue) &&
              (visitFilters.maxRevenue === undefined ||
                visitRevenue <= visitFilters.maxRevenue);
          }

          return (
            matchesSearch &&
            matchesService &&
            matchesPersonnel &&
            matchesPaymentType &&
            matchesRevenue
          );
        } catch (error) {
          console.error("Visit filtering error:", error);
          return true; // In case of error, include this visit
        }
      });
  }, [visit_list, visitFilters]);

  // Get current filters based on active tab
  const getCurrentFilters = () => {
    switch (activeTab) {
      case "personnel":
        return personnelFilters;
      case "inventory":
        return inventoryFilters;
      case "visits":
        return visitFilters;
    }
  };

  // Handle filter changes based on active tab
  const handleFilterChange = (
    filters: PersonnelFilters | InventoryFilters | VisitFilters
  ) => {
    switch (activeTab) {
      case "personnel":
        setPersonnelFilters(filters as PersonnelFilters);
        break;
      case "inventory":
        setInventoryFilters(filters as InventoryFilters);
        break;
      case "visits":
        setVisitFilters(filters as VisitFilters);
        break;
    }
  };

  // Reset filters for current tab
  const resetFilters = () => {
    switch (activeTab) {
      case "personnel":
        setPersonnelFilters({
          dateRange: undefined,
          searchQuery: "",
          selectedService: "all",
          minRevenue: undefined,
          maxRevenue: undefined,
        });
        break;
      case "inventory":
        setInventoryFilters({
          dateRange: undefined,
          searchQuery: "",
          minStock: undefined,
          maxStock: undefined,
          showLowStock: false,
          sortBy: "name",
          sortOrder: "asc",
        });
        break;
      case "visits":
        setVisitFilters({
          dateRange: undefined,
          searchQuery: "",
          selectedService: "all",
          selectedPersonnel: "all",
          paymentType: "all",
          minRevenue: undefined,
          maxRevenue: undefined,
          sortBy: "date",
          sortOrder: "desc",
        });
        break;
    }
  };

  // Check if any data is still loading
  const isDataLoading =
    personnelLoading || servicesLoading || paymentsLoading || itemsLoading;

  // Handle personnel click for details modal
  const handlePersonnelClick = (personnel: PersonnelWithMetrics) => {
    setSelectedPersonnel(personnel);
    setIsModalOpen(true);
  };

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
        <FilterSection
          filters={getCurrentFilters()}
          onFilterChange={handleFilterChange}
          services_list={services_list}
          personel_list={personel_list}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFilters={activeFilters}
          resetFilters={resetFilters}
          applyFilters={() => setShowFilters(false)}
          tableType={activeTab}
        />

        {/* Summary Cards */}
        <div
          className={`transition-all duration-500 ease-out ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: "200ms" }}
        >
          <SummaryCards
            totalVisits={totalVisits}
            totalItems={totalItems}
            totalRevenue={totalRevenue}
            totalPersonnelPayments={totalPersonnelPayments}
          />
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          className="tabs tabs-boxed bg-base-200/50 p-1 justify-center"
        >
          <button
            role="tab"
            className={`tab tab-lg gap-2 ${activeTab === "personnel" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("personnel")}
          >
            <Users className="w-4 h-4" />
            {t("analytics.personnel")}
          </button>
          <button
            role="tab"
            className={`tab tab-lg gap-2 ${activeTab === "inventory" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("inventory")}
          >
            <Package className="w-4 h-4" />
            {t("analytics.inventory")}
          </button>
          <button
            role="tab"
            className={`tab tab-lg gap-2 ${activeTab === "visits" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("visits")}
          >
            <Calendar className="w-4 h-4" />
            {t("analytics.visits")}
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {/* Charts */}
          <div className="mb-6">
            {activeTab === "personnel" && (
              <PersonnelCharts
                personnelWithMetrics={filteredPersonnel}
                visit_list={visit_list}
                dateRange={personnelFilters.dateRange}
              />
            )}
            {activeTab === "inventory" && (
              <InventoryCharts items_list={filteredItems} />
            )}
            {activeTab === "visits" && (
              <VisitsCharts
                visits={filteredVisits}
                dateRange={visitFilters.dateRange}
              />
            )}
          </div>

          {/* Tables */}
          {activeTab === "personnel" && (
            <PersonnelTable
              personel_list={filteredPersonnel}
              filters={personnelFilters}
            />
          )}
          {activeTab === "inventory" && (
            <InventoryTable
              items_list={items_list}
              visitItems={visitItems}
              animateIn={animateIn}
              filters={inventoryFilters}
            />
          )}
          {activeTab === "visits" && (
            <VisitsTable
              visit_list={visit_list}
              services_list={services_list}
              personel_list={personel_list}
              animateIn={animateIn}
              filters={visitFilters}
            />
          )}
        </div>

        {/* Personnel Detail Modal */}
        <PersonnelModal
          selectedPersonnel={selectedPersonnel as PersonelType}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      </div>
    </div>
  );
}
