"use client";

import type React from "react";
import { useState, useMemo } from "react";
import { usePersonel_e02ed2 } from "@/hooks/personel/e02ed2";
import type { PersonelPayments, PersonelType } from "@/lib/types";
import { useTranslation } from "react-i18next";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "lucide-react";
import { format, subMonths } from "date-fns";

interface PersonelModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersonnel: PersonelType | null;
}

export default function PersonnelModal({
  isOpen,
  onClose,
  selectedPersonnel,
}: PersonelModalProps) {
  const { t } = useTranslation();
  const { create_personel_data, update_personel_data } = usePersonel_e02ed2();

  // State for payment form
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PersonelPayments | null>(
    null
  );
  const [paymentPrice, setPaymentPrice] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());

  // State for personnel payments
  const [payments, setPayments] = useState<PersonelPayments[]>(
    selectedPersonnel?.payments || []
  );

  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<"date" | "price">("date");

  // Apply filters and sorting to payments
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let startDate;

      switch (dateFilter) {
        case "1month":
          startDate = subMonths(now, 1);
          break;
        case "3months":
          startDate = subMonths(now, 3);
          break;
        case "6months":
          startDate = subMonths(now, 6);
          break;
        case "1year":
          startDate = subMonths(now, 12);
          break;
        default:
          startDate = new Date(0); // Beginning of time
      }

      result = result.filter(
        (payment) =>
          new Date(payment.date) >= startDate && new Date(payment.date) <= now
      );
    }

    // Apply amount filters
    if (minAmount) {
      result = result.filter(
        (payment) => payment.price >= Number.parseFloat(minAmount)
      );
    }

    if (maxAmount) {
      result = result.filter(
        (payment) => payment.price <= Number.parseFloat(maxAmount)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortField === "date") {
        return sortDirection === "asc"
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return sortDirection === "asc" ? a.price - b.price : b.price - a.price;
      }
    });

    return result;
  }, [payments, dateFilter, minAmount, maxAmount, sortDirection, sortField]);

  // Group payments by month for chart
  const chartData = useMemo(() => {
    const monthlyData: Record<string, number> = {};

    // Get last 12 months
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const monthDate = subMonths(today, i);
      const monthKey = format(monthDate, "MMM yyyy");
      monthlyData[monthKey] = 0;
    }

    // Sum payments by month
    payments.forEach((payment) => {
      const paymentDate = new Date(payment.date);
      // Only include payments from the last 12 months
      if (paymentDate >= subMonths(today, 12)) {
        const monthKey = format(paymentDate, "MMM yyyy");
        if (monthlyData[monthKey] !== undefined) {
          monthlyData[monthKey] += payment.price;
        }
      }
    });

    // Convert to array and sort by date
    return Object.entries(monthlyData)
      .map(([month, amount]) => ({ month, amount }))
      .reverse();
  }, [payments]);

  // Calculate total payments
  const totalPayments = useMemo(() => {
    return payments.reduce((sum, payment) => sum + payment.price, 0);
  }, [payments]);

  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentPrice || !paymentDate) return;

    if (editingPayment) {
      // Update existing payment
      const updatedPayments = payments.map((payment) =>
        payment.id === editingPayment.id
          ? {
              ...payment,
              price: Number.parseFloat(paymentPrice),
              date: paymentDate,
            }
          : payment
      );
      setPayments(updatedPayments);

      // Here you would also update the payment in your backend
      // updatePaymentInBackend(editingPayment.id, parseFloat(paymentPrice), paymentDate)
    } else {
      // Add new payment
      const newPayment: PersonelPayments = {
        id: Date.now(), // Use a proper ID generation in production
        price: Number.parseFloat(paymentPrice),
        date: paymentDate,
      };
      setPayments([...payments, newPayment]);

      // Here you would also save the new payment to your backend
      // savePaymentToBackend(selectedPersonnel?.id, newPayment)
    }

    resetPaymentForm();
  };

  // Handle payment edit
  const handleEditPayment = (payment: PersonelPayments) => {
    setEditingPayment(payment);
    setPaymentPrice(payment.price.toString());
    setPaymentDate(new Date(payment.date));
    setIsAddingPayment(true);
  };

  // Handle payment delete
  const handleDeletePayment = (paymentId: number) => {
    const updatedPayments = payments.filter(
      (payment) => payment.id !== paymentId
    );
    setPayments(updatedPayments);

    // Here you would also delete the payment from your backend
    // deletePaymentFromBackend(selectedPersonnel?.id, paymentId)
  };

  // Reset payment form
  const resetPaymentForm = () => {
    setIsAddingPayment(false);
    setEditingPayment(null);
    setPaymentPrice("");
    setPaymentDate(new Date());
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setPaymentDate(new Date(e.target.value));
    }
  };

  // Toggle sort direction
  const toggleSort = (field: "date" | "price") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  // Reset filters
  const resetFilters = () => {
    setDateFilter("all");
    setMinAmount("");
    setMaxAmount("");
  };

  if (!isOpen) return null;

  // If no personnel is selected, show the create form
  if (!selectedPersonnel) {
    return (
      <div className="modal modal-open">
        <div className="modal-box">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
            {t("personnel.addNewPersonnel")}
          </h3>

          <form action={create_personel_data} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    {t("personnel.fullName")}
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder={t("personnel.enterFullName")}
                  className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                  required
                />
              </div>

              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text text-gray-700 font-medium">
                    {t("common.description")}
                  </span>
                </label>
                <input
                  type="text"
                  name="description"
                  placeholder={t("personnel.enterPosition")}
                  className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="btn btn-ghost text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                onClick={onClose}
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                onClick={onClose}
                className="btn text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
              >
                {t("personnel.addNewPersonnel")}
              </button>
            </div>
          </form>
          <form method="dialog" className="modal-backdrop">
            <button onClick={onClose}>close</button>
          </form>
        </div>
      </div>
    );
  }

  // If personnel is selected, show the two-column layout
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
            {selectedPersonnel.name}
          </h3>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Chart and Stats */}
          <div className="p-6 border-t lg:border-t-0 lg:border-r">
            {/* Personnel Details Section */}
            <div className="mt-6">
              <h4 className="font-semibold mb-4">{t("personnel.details")}</h4>
              <form action={update_personel_data} className="space-y-4">
                <input type="hidden" name="id" value={selectedPersonnel.id} />
                <div className="grid grid-cols-1 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-gray-700 font-medium">
                        {t("personnel.fullName")}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder={t("personnel.enterFullName")}
                      className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                      defaultValue={selectedPersonnel.name}
                      required
                    />
                  </div>

                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text text-gray-700 font-medium">
                        {t("common.description")}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="description"
                      placeholder={t("personnel.enterPosition")}
                      className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                      defaultValue={selectedPersonnel.description}
                      required
                    />
                  </div>
                </div>

                {/* Save Changes Button */}
                <div className="flex justify-end gap-3 mt-4">
                  <button
                    type="submit"
                    className="btn text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
                  >
                    {t("personnel.saveChanges")}
                  </button>
                </div>
              </form>
            </div>

            {/* Payment Statistics */}
            <h4 className="font-semibold mb-4">
              {t("personnel.paymentAnalytics")}
            </h4>
            <div className="stats shadow w-full mb-6">
              <div className="stat">
                <div className="stat-title">{t("personnel.totalPayments")}</div>
                <div className="stat-value text-primary">
                  {formatCurrency(totalPayments)}
                </div>
                <div className="stat-desc">
                  {payments.length} {t("personnel.paymentsRecorded")}
                </div>
              </div>

              <div className="stat">
                <div className="stat-title">
                  {t("personnel.averagePayment")}
                </div>
                <div className="stat-value text-secondary">
                  {payments.length > 0
                    ? formatCurrency(totalPayments / payments.length)
                    : formatCurrency(0)}
                </div>
                <div className="stat-desc">{t("personnel.perPayment")}</div>
              </div>
            </div>

            {/* Payments Chart */}
            <div className="bg-base-100 rounded-box shadow p-4">
              <h4 className="font-medium mb-4">
                {t("personnel.paymentsTrend")}
              </h4>
              <div className="h-80 w-full">
                {chartData.length > 0 ? (
                  <div className="flex items-end h-64 w-full gap-1 overflow-x-hidden">
                    {chartData.map((item, index) => {
                      // Calculate height percentage (max 100%)
                      const maxAmount = Math.max(
                        ...chartData.map((d) => d.amount)
                      );
                      const heightPercent =
                        maxAmount > 0
                          ? Math.max(5, (item.amount / maxAmount) * 100)
                          : 0;

                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center flex-1"
                        >
                          <div
                            className="bg-primary/80 hover:bg-primary w-full rounded-t-sm transition-all duration-200"
                            style={{ height: `${heightPercent}%` }}
                            title={`${item.month}: ${formatCurrency(
                              item.amount
                            )}`}
                          ></div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    {t("personnel.noDataToDisplay")}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Payments List */}
          <div className="p-6 border-t">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-semibold">{t("personnel.payments")}</h4>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingPayment(true)}
                  className="btn btn-sm text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
                  disabled={isAddingPayment}
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  {t("personnel.addPayment")}
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`btn btn-sm ${
                    showFilters ? "btn-primary" : "btn-outline"
                  }`}
                >
                  <FilterIcon className="h-4 w-4 mr-1" />
                  {t("common.filter")}
                </button>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="bg-base-200 p-4 rounded-lg mb-4">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">{t("common.filters")}</h5>
                  <button
                    onClick={resetFilters}
                    className="btn btn-xs btn-ghost"
                  >
                    {t("common.resetFilters")}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        {t("personnel.dateRange")}
                      </span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    >
                      <option value="all">{t("personnel.allTime")}</option>
                      <option value="1month">{t("personnel.lastMonth")}</option>
                      <option value="3months">
                        {t("personnel.last3Months")}
                      </option>
                      <option value="6months">
                        {t("personnel.last6Months")}
                      </option>
                      <option value="1year">{t("personnel.lastYear")}</option>
                    </select>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        {t("personnel.minAmount")}
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="input input-bordered w-full"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">
                        {t("personnel.maxAmount")}
                      </span>
                    </label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className="input input-bordered w-full"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Form */}
            {isAddingPayment && (
              <div className="card bg-base-100 shadow-sm mb-4">
                <div className="card-body pt-4">
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            {t("personnel.amount")}
                          </span>
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={paymentPrice}
                          onChange={(e) => setPaymentPrice(e.target.value)}
                          className="input input-bordered bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                          required
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">
                            {t("personnel.date")}
                          </span>
                        </label>
                        <input
                          type="date"
                          value={
                            paymentDate ? format(paymentDate, "yyyy-MM-dd") : ""
                          }
                          onChange={handleDateChange}
                          className="input input-bordered bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                          required
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        className="btn btn-ghost text-gray-700 bg-gray-100 hover:bg-gray-200"
                        onClick={resetPaymentForm}
                      >
                        {t("common.cancel")}
                      </button>
                      <button
                        type="submit"
                        className="btn text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
                      >
                        {editingPayment
                          ? t("personnel.updatePayment")
                          : t("personnel.addPayment")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Payments Table */}
            <div className="overflow-x-auto">
              {filteredPayments.length > 0 ? (
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th
                        className="cursor-pointer"
                        onClick={() => toggleSort("date")}
                      >
                        <div className="flex items-center">
                          {t("personnel.date")}
                          {sortField === "date" &&
                            (sortDirection === "asc" ? (
                              <ChevronUpIcon className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th
                        className="cursor-pointer"
                        onClick={() => toggleSort("price")}
                      >
                        <div className="flex items-center">
                          {t("personnel.amount")}
                          {sortField === "price" &&
                            (sortDirection === "asc" ? (
                              <ChevronUpIcon className="h-4 w-4 ml-1" />
                            ) : (
                              <ChevronDownIcon className="h-4 w-4 ml-1" />
                            ))}
                        </div>
                      </th>
                      <th className="text-right">{t("common.actions")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{format(new Date(payment.date), "PPP")}</td>
                        <td>{formatCurrency(payment.price)}</td>
                        <td className="text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEditPayment(payment)}
                              className="btn btn-ghost btn-sm text-gray-500 hover:text-primary"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePayment(payment.id)}
                              className="btn btn-ghost btn-sm text-gray-500 hover:text-red-500"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  {payments.length > 0
                    ? t("personnel.noPaymentsMatchFilters")
                    : t("personnel.noPaymentsFound")}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer with Close Button */}
        <div className="p-6 border-t mt-4">
          <div className="flex justify-end">
            <button
              type="button"
              className="btn btn-ghost text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              onClick={onClose}
            >
              {t("common.close")}
            </button>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </div>
    </div>
  );
}
