"use client";

import { Search, X } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";
import type { FilterProps } from "./types";

export function FilterSection({
  searchQuery,
  setSearchQuery,
  dateRange,
  setDateRange,
  selectedService,
  setSelectedService,
  services_list,
  showFilters,
  setShowFilters,
  activeFilters,
  resetFilters,
  applyFilters,
}: FilterProps) {
  const { t } = useTranslation();

  if (!showFilters) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 transition-all duration-300 ease-in-out opacity-100 translate-y-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">{t("analytics.filterData")}</h3>
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
                value={dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const fromDate = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  setDateRange({ from: fromDate, to: dateRange?.to });
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
                className="input input-bordered w-full pl-10"
                value={dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""}
                onChange={(e) => {
                  const toDate = e.target.value
                    ? new Date(e.target.value)
                    : undefined;
                  setDateRange({ from: dateRange?.from, to: toDate });
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
  );
} 