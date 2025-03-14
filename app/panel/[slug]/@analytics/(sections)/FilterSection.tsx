"use client";

import { useTranslation } from "react-i18next";
import { X, Filter, ArrowUpDown } from "lucide-react";
import { DayPicker } from "react-day-picker";
import type { FilterSectionProps, PersonnelFilters, InventoryFilters, VisitFilters } from "./types";
import { PAYMENT_TYPE } from "@/lib/types";

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

  const handleFilterChange = <T extends PersonnelFilters | InventoryFilters | VisitFilters>(
    changes: Partial<T>
  ) => {
    onFilterChange({ ...filters, ...changes } as T);
  };

  if (!showFilters) return null;

  return (
    <div className="card bg-base-100 shadow-lg border border-base-200 mb-6">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h3 className="card-title text-lg">
            <Filter className="w-5 h-5 mr-2" />
            {t("analytics.filters")}
          </h3>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => setShowFilters(false)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Common Filters */}
          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("analytics.search")}</span>
            </label>
            <input
              type="text"
              className="input input-bordered w-full"
              value={filters.searchQuery}
              onChange={(e) => handleFilterChange({ searchQuery: e.target.value })}
              placeholder={t("analytics.searchPlaceholder")}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">{t("analytics.dateRange")}</span>
            </label>
            <DayPicker
              mode="range"
              selected={filters.dateRange}
              onSelect={(range) => handleFilterChange({ dateRange: range })}
              className="bg-base-200 p-2 rounded-lg"
            />
          </div>

          {/* Personnel Filters */}
          {tableType === "personnel" && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("analytics.service")}</span>
                </label>
                <select
                  className="select select-bordered w-full"
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
                  <span className="label-text">{t("analytics.revenueRange")}</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={(filters as PersonnelFilters).minRevenue || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        minRevenue: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder={t("analytics.min")}
                  />
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={(filters as PersonnelFilters).maxRevenue || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        maxRevenue: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder={t("analytics.max")}
                  />
                </div>
              </div>
            </>
          )}

          {/* Inventory Filters */}
          {tableType === "inventory" && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("analytics.stockRange")}</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={(filters as InventoryFilters).minStock || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        minStock: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder={t("analytics.min")}
                  />
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={(filters as InventoryFilters).maxStock || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        maxStock: e.target.value ? Number(e.target.value) : undefined,
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
                    className="select select-bordered flex-1"
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
                    className="btn btn-square"
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
                <label className="label cursor-pointer">
                  <span className="label-text">{t("analytics.showLowStock")}</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-primary"
                    checked={(filters as InventoryFilters).showLowStock}
                    onChange={(e) =>
                      handleFilterChange({ showLowStock: e.target.checked })
                    }
                  />
                </label>
              </div>
            </>
          )}

          {/* Visit Filters */}
          {tableType === "visits" && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">{t("analytics.service")}</span>
                </label>
                <select
                  className="select select-bordered w-full"
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
                  <span className="label-text">{t("analytics.personnel")}</span>
                </label>
                <select
                  className="select select-bordered w-full"
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
                  <span className="label-text">{t("analytics.paymentType")}</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={(filters as VisitFilters).paymentType}
                  onChange={(e) =>
                    handleFilterChange({
                      paymentType: e.target.value as PAYMENT_TYPE | "all",
                    })
                  }
                >
                  <option value="all">{t("analytics.allPaymentTypes")}</option>
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
                  <span className="label-text">{t("analytics.revenueRange")}</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={(filters as VisitFilters).minRevenue || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        minRevenue: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder={t("analytics.min")}
                  />
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    value={(filters as VisitFilters).maxRevenue || ""}
                    onChange={(e) =>
                      handleFilterChange({
                        maxRevenue: e.target.value ? Number(e.target.value) : undefined,
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
                    className="select select-bordered flex-1"
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
                    className="btn btn-square"
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
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <button
            className="btn btn-ghost"
            onClick={resetFilters}
          >
            {t("analytics.resetFilters")}
          </button>
          <button
            className="btn btn-primary"
            onClick={applyFilters}
          >
            {t("analytics.applyFilters")}
          </button>
        </div>
      </div>
    </div>
  );
} 