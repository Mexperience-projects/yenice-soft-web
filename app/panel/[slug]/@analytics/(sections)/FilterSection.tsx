"use client";

import { useTranslation } from "react-i18next";
import {
  X,
  Filter,
  ArrowUpDown,
  Search,
  Calendar,
  CreditCard,
  User,
  Package,
  DollarSign,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { useState, useRef, useEffect, useMemo } from "react";
import type {
  FilterSectionProps,
  PersonnelFilters,
  InventoryFilters,
  VisitFilters,
} from "./types";
import { PAYMENT_TYPE } from "@/lib/types";

// Add custom styles for the date picker
const datePickerStyles = `
  .react-datepicker {
    @apply bg-base-100 border border-base-300 rounded-lg shadow-lg font-sans;
  }
  .react-datepicker__header {
    @apply bg-base-200 border-b border-base-300 rounded-t-lg;
  }
  .react-datepicker__month-container {
    @apply p-2;
  }
  .react-datepicker__day-name {
    @apply text-base-content/60 font-medium w-8 h-8 inline-flex items-center justify-center;
  }
  .react-datepicker__day {
    @apply w-8 h-8 inline-flex items-center justify-center rounded-md hover:bg-primary/10 cursor-pointer transition-colors;
  }
  .react-datepicker__day--selected {
    @apply bg-primary text-primary-content hover:bg-primary-focus;
  }
  .react-datepicker__day--in-range {
    @apply bg-primary/20 text-base-content;
  }
  .react-datepicker__day--range-start,
  .react-datepicker__day--range-end {
    @apply bg-primary text-primary-content hover:bg-primary-focus;
  }
  .react-datepicker__day--keyboard-selected {
    @apply bg-primary text-primary-content;
  }
  .react-datepicker__day--today {
    @apply border-2 border-primary/30;
  }
  .react-datepicker__current-month {
    @apply text-base-content font-semibold py-2;
  }
  .react-datepicker__navigation {
    @apply top-2;
  }
  .react-datepicker__navigation--previous {
    @apply left-2;
  }
  .react-datepicker__navigation--next {
    @apply right-2;
  }
  .react-datepicker__month-select,
  .react-datepicker__year-select {
    @apply select select-bordered select-sm min-h-0 h-8;
  }
  .react-datepicker__month-dropdown-container,
  .react-datepicker__year-dropdown-container {
    @apply mx-1;
  }
  .react-datepicker-popper {
    @apply z-50;
  }
  .react-datepicker__day--outside-month {
    @apply text-base-content/30;
  }
  .react-datepicker__triangle {
    @apply hidden;
  }
`;

interface CustomInputProps {
  value?: string;
  onClick?: () => void;
  placeholder: string;
}

const CustomInput = ({ value, onClick, placeholder }: CustomInputProps) => (
  <button
    type="button"
    onClick={onClick}
    className="input input-bordered w-full text-left flex items-center justify-between focus:ring-2 focus:ring-primary/20 relative"
  >
    <span className="flex-1 truncate">{value || placeholder}</span>
    <Calendar className="w-4 h-4 text-base-content/50" />
  </button>
);

interface CustomHeaderProps {
  date: Date;
  decreaseMonth: () => void;
  increaseMonth: () => void;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
}

const CustomHeader = ({
  date,
  decreaseMonth,
  increaseMonth,
  prevMonthButtonDisabled,
  nextMonthButtonDisabled,
}: CustomHeaderProps) => (
  <div className="flex items-center justify-between px-2 py-2">
    <button
      onClick={decreaseMonth}
      disabled={prevMonthButtonDisabled}
      type="button"
      className="p-1 hover:bg-base-200 rounded-md disabled:opacity-50"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
    <div className="font-semibold">{format(date, "MMMM yyyy")}</div>
    <button
      onClick={increaseMonth}
      disabled={nextMonthButtonDisabled}
      type="button"
      className="p-1 hover:bg-base-200 rounded-md disabled:opacity-50"
    >
      <ChevronRight className="w-4 h-4" />
    </button>
  </div>
);

export function FilterSection({
  filters,
  onFilterChange,
  services_list,
  personel_list,
  showFilters,
  setShowFilters,
  activeFilters,
  resetFilters,
  applyFilters,
  tableType,
}: FilterSectionProps) {
  const { t } = useTranslation();

  // Add styles to head
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = datePickerStyles;
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const handleFilterChange = <
    T extends PersonnelFilters | InventoryFilters | VisitFilters,
  >(
    changes: Partial<T>
  ) => {
    onFilterChange({ ...filters, ...changes } as T);
  };

  // Convert DateRange to [Date, Date]
  const [startDate, endDate]: [Date | null, Date | null] = useMemo(() => {
    if (!filters.dateRange) return [null, null];
    return [
      filters.dateRange.from ? new Date(filters.dateRange.from) : null,
      filters.dateRange.to ? new Date(filters.dateRange.to) : null,
    ];
  }, [filters.dateRange]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    handleFilterChange({
      dateRange: {
        from: start ? format(start, "yyyy-MM-dd") : undefined,
        to: end ? format(end, "yyyy-MM-dd") : undefined,
      },
    });
  };

  // Format date for display
  if (!showFilters) return null;

  return (
    <div className="bg-base-100 rounded-xl shadow-lg border border-base-200 mb-6 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-base-200 bg-base-50">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Filter className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold">{t("analytics.filters")}</h3>
          </div>
          <button
            className="btn btn-ghost btn-sm hover:bg-base-200 transition-colors"
            onClick={() => setShowFilters(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Common Filters Section */}
        <div className="space-y-6">
          {/* Search and Date Range */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  {t("analytics.search")}
                </span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                value={filters.searchQuery}
                onChange={(e) =>
                  handleFilterChange({ searchQuery: e.target.value })
                }
                placeholder={t("analytics.searchPlaceholder")}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {t("analytics.dateRange")}
                </span>
              </label>
              <DatePicker
                selectsRange
                startDate={startDate}
                endDate={endDate}
                onChange={handleDateChange}
                monthsShown={2}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                customInput={
                  <CustomInput placeholder={t("analytics.selectDateRange")} />
                }
                renderCustomHeader={CustomHeader}
                isClearable
                calendarClassName="shadow-xl"
                popperClassName="z-[100]"
                dateFormat="MMM dd, yyyy"
                placeholderText={t("analytics.selectDateRange")}
                fixedHeight
              />
            </div>
          </div>

          {/* Type-specific Filters */}
          <div className="border-t border-base-200 pt-6">
            {/* Personnel Filters */}
            {tableType === "personnel" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {t("analytics.service")}
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full focus:ring-2 focus:ring-primary/20"
                    value={(filters as PersonnelFilters).selectedService}
                    onChange={(e) =>
                      handleFilterChange({ selectedService: e.target.value })
                    }
                  >
                    <option value="all">{t("analytics.allServices")}</option>
                    {services_list.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {t("analytics.revenueRange")}
                    </span>
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                      value={(filters as PersonnelFilters).minRevenue || ""}
                      onChange={(e) =>
                        handleFilterChange({
                          minRevenue: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder={t("analytics.min")}
                    />
                    <input
                      type="number"
                      className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                      value={(filters as PersonnelFilters).maxRevenue || ""}
                      onChange={(e) =>
                        handleFilterChange({
                          maxRevenue: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder={t("analytics.max")}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Inventory Filters */}
            {tableType === "inventory" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {t("analytics.stockRange")}
                    </span>
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                      value={(filters as InventoryFilters).minStock || ""}
                      onChange={(e) =>
                        handleFilterChange({
                          minStock: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder={t("analytics.min")}
                    />
                    <input
                      type="number"
                      className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                      value={(filters as InventoryFilters).maxStock || ""}
                      onChange={(e) =>
                        handleFilterChange({
                          maxStock: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder={t("analytics.max")}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">{t("analytics.sortBy")}</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="select select-bordered flex-1 focus:ring-2 focus:ring-primary/20"
                      value={(filters as InventoryFilters).sortBy}
                      onChange={(e) =>
                        handleFilterChange({
                          sortBy: e.target.value as InventoryFilters["sortBy"],
                        })
                      }
                    >
                      <option value="name">{t("analytics.name")}</option>
                      <option value="stock">{t("analytics.stock")}</option>
                      <option value="usage">{t("analytics.usage")}</option>
                      <option value="revenue">{t("analytics.revenue")}</option>
                    </select>
                    <button
                      className="btn btn-square btn-outline"
                      onClick={() =>
                        handleFilterChange({
                          sortOrder:
                            (filters as InventoryFilters).sortOrder === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <ArrowUpDown
                        className={`w-4 h-4 transform ${
                          (filters as InventoryFilters).sortOrder === "asc"
                            ? ""
                            : "rotate-180"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      className="toggle toggle-primary"
                      checked={(filters as InventoryFilters).showLowStock}
                      onChange={(e) =>
                        handleFilterChange({ showLowStock: e.target.checked })
                      }
                    />
                    <span className="label-text">
                      {t("analytics.showLowStock")}
                    </span>
                  </label>
                </div>
              </div>
            )}

            {/* Visit Filters */}
            {tableType === "visits" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      {t("analytics.service")}
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full focus:ring-2 focus:ring-primary/20"
                    value={(filters as VisitFilters).selectedService}
                    onChange={(e) =>
                      handleFilterChange({ selectedService: e.target.value })
                    }
                  >
                    <option value="all">{t("analytics.allServices")}</option>
                    {services_list.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {t("analytics.personnel")}
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full focus:ring-2 focus:ring-primary/20"
                    value={(filters as VisitFilters).selectedPersonnel}
                    onChange={(e) =>
                      handleFilterChange({ selectedPersonnel: e.target.value })
                    }
                  >
                    <option value="all">{t("analytics.allPersonnel")}</option>
                    {personel_list?.map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      {t("analytics.paymentType")}
                    </span>
                  </label>
                  <select
                    className="select select-bordered w-full focus:ring-2 focus:ring-primary/20"
                    value={(filters as VisitFilters).paymentType}
                    onChange={(e) =>
                      handleFilterChange({
                        paymentType: e.target.value as PAYMENT_TYPE | "all",
                      })
                    }
                  >
                    <option value="all">
                      {t("analytics.allPaymentTypes")}
                    </option>
                    {Object.values(PAYMENT_TYPE)
                      .filter((v) => typeof v === "string")
                      .map((type) => (
                        <option key={type} value={type}>
                          {t(`analytics.paymentTypes.${type}`)}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      {t("analytics.revenueRange")}
                    </span>
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                      value={(filters as VisitFilters).minRevenue || ""}
                      onChange={(e) =>
                        handleFilterChange({
                          minRevenue: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder={t("analytics.min")}
                    />
                    <input
                      type="number"
                      className="input input-bordered w-full focus:ring-2 focus:ring-primary/20"
                      value={(filters as VisitFilters).maxRevenue || ""}
                      onChange={(e) =>
                        handleFilterChange({
                          maxRevenue: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      placeholder={t("analytics.max")}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">{t("analytics.sortBy")}</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="select select-bordered flex-1 focus:ring-2 focus:ring-primary/20"
                      value={(filters as VisitFilters).sortBy}
                      onChange={(e) =>
                        handleFilterChange({
                          sortBy: e.target.value as VisitFilters["sortBy"],
                        })
                      }
                    >
                      <option value="date">{t("analytics.date")}</option>
                      <option value="revenue">{t("analytics.revenue")}</option>
                      <option value="personnel_fee">
                        {t("analytics.personnelFee")}
                      </option>
                      <option value="net_revenue">
                        {t("analytics.netRevenue")}
                      </option>
                    </select>
                    <button
                      className="btn btn-square btn-outline"
                      onClick={() =>
                        handleFilterChange({
                          sortOrder:
                            (filters as VisitFilters).sortOrder === "asc"
                              ? "desc"
                              : "asc",
                        })
                      }
                    >
                      <ArrowUpDown
                        className={`w-4 h-4 transform ${
                          (filters as VisitFilters).sortOrder === "asc"
                            ? ""
                            : "rotate-180"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-base-200">
          <button
            className="btn btn-outline btn-neutral hover:bg-neutral/10"
            onClick={resetFilters}
          >
            {t("analytics.resetFilters")}
          </button>
          <button className="btn btn-primary" onClick={applyFilters}>
            {t("analytics.applyFilters")}
          </button>
        </div>
      </div>
    </div>
  );
}
