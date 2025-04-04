"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import type { PersonelPayments, PersonelType } from "@/lib/types";
import { useTranslation } from "react-i18next";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Calendar,
} from "lucide-react";
import { format, subMonths } from "date-fns";

interface PersonnelPaymentsModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: (updatedPayments?: PersonelPayments[]) => void;
  selectedPersonnel: PersonelType;
}

export default function PersonnelPaymentsModal({
  isOpen,
  onOpen,
  onClose,
  selectedPersonnel,
}: PersonnelPaymentsModalProps) {
  const { t } = useTranslation();

  // State for payment form
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<
    PersonelPayments | undefined
  >(undefined);
  const [paymentPrice, setPaymentPrice] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());
  const [displayDate, setDisplayDate] = useState("");

  // State for personnel payments
  const [payments, setPayments] = useState<PersonelPayments[]>([]);

  // Success message state
  const [showSuccess, setShowSuccess] = useState(false);

  // State for filters
  const [dateFilter, setDateFilter] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<"date" | "price">("date");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Form validation state
  const [paymentFormValid, setPaymentFormValid] = useState(false);

  useEffect(() => {
    onOpen();
    if (selectedPersonnel) {
      // Initialize payments from the selected personnel
      const formattedPayments = selectedPersonnel.payments;
      setPayments(formattedPayments);
    }
  }, [selectedPersonnel, onOpen]);

  // Check payment form validity
  useEffect(() => {
    setPaymentFormValid(!!paymentPrice && !!paymentDate);
  }, [paymentPrice, paymentDate]);

  // Update display date when payment date changes
  useEffect(() => {
    if (paymentDate) {
      const day = paymentDate.getDate().toString().padStart(2, "0");
      const month = (paymentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = paymentDate.getFullYear();
      setDisplayDate(`${day}/${month}/${year}`);
    } else {
      setDisplayDate("");
    }
  }, [paymentDate]);

  // Hide success message after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Apply filters and sorting to payments
  const filteredPayments = useMemo(() => {
    let result = [...payments];

    // Apply date filter
    if (dateFilter !== "all") {
      const now = new Date();
      let startDate: Date;

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

      result = result.filter((payment) => {
        const paymentDate = new Date(payment.date);
        return paymentDate >= startDate && paymentDate <= now;
      });
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

  // Calculate total payments
  const totalPayments = useMemo(() => {
    return payments.reduce((sum, payment) => sum + payment.price, 0);
  }, [payments]);

  // Update payments locally
  const updatePayments = (updatedPayments: PersonelPayments[]) => {
    setPayments(updatedPayments);
    setShowSuccess(true);
    // We don't save to server here, just update local state
  };

  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentPrice || !paymentDate) return;

    setIsLoading(true);

    let updatedPayments: PersonelPayments[] = [];

    if (editingPayment) {
      // Update existing payment
      updatedPayments = payments.map((payment) =>
        payment.id === editingPayment.id
          ? {
              ...payment,
              price: Number.parseFloat(paymentPrice),
              date: paymentDate,
            }
          : payment
      );
    } else {
      // Add new payment
      const newPayment: PersonelPayments = {
        id: Date.now(), // Use a proper ID generation in production
        price: Number.parseFloat(paymentPrice),
        date: paymentDate,
      };
      updatedPayments = [...payments, newPayment];
    }

    // Update local state only
    updatePayments(updatedPayments);
    resetPaymentForm();
    setIsLoading(false);
  };

  // Handle payment edit
  const handleEditPayment = (payment: PersonelPayments) => {
    setEditingPayment(payment);
    setPaymentPrice(payment.price.toString());
    const date = new Date(payment.date);
    setPaymentDate(date);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    setDisplayDate(`${day}/${month}/${year}`);
    setIsAddingPayment(true);
  };

  // Handle payment delete
  const handleDeletePayment = (paymentId: number) => {
    setIsLoading(true);
    const updatedPayments = payments.filter(
      (payment) => payment.id !== paymentId
    );
    updatePayments(updatedPayments);
    setIsLoading(false);
  };

  // Reset payment form
  const resetPaymentForm = () => {
    setIsAddingPayment(false);
    setEditingPayment(undefined);
    setPaymentPrice("");
    setPaymentDate(new Date());
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    setDisplayDate(`${day}/${month}/${year}`);
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const date = new Date(e.target.value);
      setPaymentDate(date);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      setDisplayDate(`${day}/${month}/${year}`);
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

  return (
    <div className="modal modal-open">
      <div
        className="modal-box max-w-3xl p-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
            {t("payments.paymentsFor")} {selectedPersonnel.name}
          </h3>
          <button
            type="button"
            className="btn btn-sm btn-ghost text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
            onClick={() => onClose(payments)}
          >
            {t("common.close")}
          </button>
        </div>

        <div className="p-4 border-t">
          {/* Success Message */}
          {showSuccess && (
            <div className="alert alert-success mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{t("common.savedSuccessfully")}</span>
            </div>
          )}

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="select select-sm select-bordered"
            >
              <option value="all">{t("filters.allTime")}</option>
              <option value="1month">{t("filters.lastMonth")}</option>
              <option value="3months">{t("filters.last3Months")}</option>
              <option value="6months">{t("filters.last6Months")}</option>
              <option value="1year">{t("filters.lastYear")}</option>
            </select>
            <input
              type="number"
              placeholder={t("filters.minAmount")}
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="input input-sm input-bordered"
            />
            <input
              type="number"
              placeholder={t("filters.maxAmount")}
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              className="input input-sm input-bordered"
            />
            <button onClick={resetFilters} className="btn btn-sm btn-ghost">
              {t("filters.reset")}
            </button>
            <div className="flex-grow"></div>
            <button
              onClick={() => setIsAddingPayment(true)}
              className="btn btn-sm text-white enabled:bg-gradient-to-r from-primary 
              to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
              disabled={isAddingPayment}
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              {t("payments.addPayment")}
            </button>
          </div>

          {/* Payment Form */}
          {isAddingPayment && (
            <div className="card bg-base-100 shadow-sm mb-3">
              <div className="card-body p-3">
                <form onSubmit={handlePaymentSubmit} className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text text-sm">
                          {t("common.price")}
                        </span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={paymentPrice}
                        onChange={(e) => setPaymentPrice(e.target.value)}
                        className="input input-bordered input-sm bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label py-1">
                        <span className="label-text text-sm">
                          {t("common.date")}
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={
                            paymentDate ? format(paymentDate, "yyyy-MM-dd") : ""
                          }
                          onChange={handleDateChange}
                          className="input input-bordered input-sm bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary opacity-0 absolute inset-0 z-10"
                          required
                        />
                        <div className="input input-bordered input-sm bg-gray-50 border-gray-200 flex items-center justify-between">
                          {displayDate || t("common.selectDate")}
                          <Calendar className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="btn btn-sm btn-ghost text-gray-700 bg-gray-100 hover:bg-gray-200"
                      onClick={resetPaymentForm}
                    >
                      {t("common.cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={!paymentFormValid || isLoading}
                      className={`btn btn-sm text-white bg-gradient-to-r from-primary to-secondary border-none ${
                        !paymentFormValid || isLoading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:from-primary/90 hover:to-secondary/90"
                      }`}
                    >
                      {isLoading ? (
                        <>
                          <span className="loading loading-spinner loading-xs"></span>
                          {t("common.saving")}
                        </>
                      ) : (
                        t("common.save")
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Payments Table */}
          <div className="overflow-x-auto h-[400px] overflow-y-auto">
            {filteredPayments.length > 0 ? (
              <table className="table table-zebra table-sm w-full">
                <thead className="sticky top-0 bg-base-100 z-10">
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
                            className="btn btn-ghost btn-xs text-gray-500 hover:text-primary"
                          >
                            <PencilIcon className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
                            className="btn btn-ghost btn-xs text-gray-500 hover:text-red-500"
                          >
                            <TrashIcon className="h-3 w-3" />
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
                  ? t("payments.noPaymentsMatchFilters")
                  : t("payments.noPaymentsFound")}
              </div>
            )}
          </div>

          {/* Payment Statistics */}
          <div className="stats shadow w-full mt-4 text-sm">
            <div className="stat py-2">
              <div className="stat-title">{t("analytics.totalPayments")}</div>
              <div className="stat-value text-primary text-xl">
                {formatCurrency(totalPayments)}
              </div>
              <div className="stat-desc">
                {payments.length} {t("analytics.paymentsRecorded")}
              </div>
            </div>

            <div className="stat py-2">
              <div className="stat-title">{t("analytics.averagePayment")}</div>
              <div className="stat-value text-secondary text-xl">
                {payments.length > 0
                  ? formatCurrency(totalPayments / payments.length)
                  : formatCurrency(0)}
              </div>
              <div className="stat-desc">{t("analytics.perPayment")}</div>
            </div>
          </div>
        </div>

        <div className="modal-backdrop" onClick={() => onClose(payments)}></div>
      </div>
    </div>
  );
}
