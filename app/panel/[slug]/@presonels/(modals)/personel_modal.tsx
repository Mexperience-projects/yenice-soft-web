"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { usePersonel_e02ed2 } from "@/hooks/personel/e02ed2";
import type { PersonelPayments, PersonelType } from "@/lib/types";
import { useTranslation } from "react-i18next";
import {
  PencilIcon,
  PlusIcon,
  TrashIcon,
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
  const [payments, setPayments] = useState<PersonelPayments[]>([]);

  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<"date" | "price">("date");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedPersonnel) setPayments(selectedPersonnel.payments);
  }, [selectedPersonnel]);

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

  // Calculate total payments
  const totalPayments = useMemo(() => {
    return payments.reduce((sum, payment) => sum + payment.price, 0);
  }, [payments]);

  // Handle payment form submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentPrice || !paymentDate) return;

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

    setPayments(updatedPayments);

    // Update the hidden input value
    const paymentsInput = document.querySelector(
      'input[name="payments"]'
    ) as HTMLInputElement;
    if (paymentsInput) {
      paymentsInput.value = JSON.stringify(updatedPayments);
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

  // If no personnel is selected, show the same layout but with empty fields
  if (!selectedPersonnel) {
    // Use the same layout but with the create_personel_data action
    return (
      <div className="modal modal-open">
        <div className="modal-box max-w-5xl p-0">
          <div className="p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
              {t("personnel.addNewPersonnel")}
            </h3>
            <div className="flex gap-2">
              <button
                type="submit"
                form="create-personnel-form"
                disabled={isLoading}
                className="btn btn-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    {t("common.saving")}
                  </>
                ) : (
                  t("personnel.addNewPersonnel")
                )}
              </button>
              <button
                type="button"
                className="btn btn-sm btn-ghost text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
                onClick={onClose}
              >
                {t("common.close")}
              </button>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Chart and Stats */}
            <div className="p-4 border-t lg:border-t-0 lg:border-r">
              {/* Personnel Details Section */}
              <div className="mt-2">
                <h4 className="font-semibold mb-2">Details</h4>
                <form
                  id="create-personnel-form"
                  action={async (formData) => {
                    setIsLoading(true);
                    await create_personel_data(formData);
                    setIsLoading(false);
                    onClose();
                  }}
                  className="space-y-3"
                >
                  <div className="grid grid-cols-1 gap-3">
                    <div className="form-control w-full">
                      <label className="label py-1">
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
                      <label className="label py-1">
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
                    <div className="form-control w-full">
                      <label className="label py-1">
                        <span className="label-text text-gray-700 font-medium">
                          {t("common.price")}
                        </span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        max="100"
                        placeholder="20 %"
                        name="precent"
                        className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                        required
                      />
                    </div>
                    <input
                      type="hidden"
                      name="payments"
                      value={JSON.stringify([])}
                    />
                  </div>
                </form>
              </div>

              {/* Payment Statistics - Empty State */}
              <h4 className="font-semibold mb-2 mt-4">Payment Analytics</h4>
              <div className="stats shadow w-full mb-4 text-sm">
                <div className="stat py-2">
                  <div className="stat-title">Total Payments</div>
                  <div className="stat-value text-primary text-xl">
                    {formatCurrency(0)}
                  </div>
                  <div className="stat-desc">0 payments recorded</div>
                </div>

                <div className="stat py-2">
                  <div className="stat-title">Average Payment</div>
                  <div className="stat-value text-secondary text-xl">
                    {formatCurrency(0)}
                  </div>
                  <div className="stat-desc">per payment</div>
                </div>
              </div>
            </div>

            {/* Right Column - Payments List */}
            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold">Payments</h4>
                <div className="text-gray-500 text-sm">
                  Save personnel first to add payments
                </div>
              </div>

              {/* Empty Payments Table */}
              <div className="overflow-x-auto h-[300px] overflow-y-auto">
                <div className="text-center py-6 text-gray-500">
                  {t("personnel.noPaymentsFound")}
                </div>
              </div>
            </div>
          </div>

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
      <div className="modal-box max-w-5xl p-0">
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
            {selectedPersonnel.name}
          </h3>
          <div className="flex gap-2">
            <button
              type="submit"
              form="update-personnel-form"
              disabled={isLoading}
              className="btn btn-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  {t("common.saving")}
                </>
              ) : (
                t("personnel.saveChanges")
              )}
            </button>
            <button
              type="button"
              className="btn btn-sm btn-ghost text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200"
              onClick={onClose}
            >
              {t("common.close")}
            </button>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left Column - Chart and Stats */}
          <div className="p-4 lg:border-r">
            {/* Personnel Details Section */}
            <div className="mt-2">
              <h4 className="font-semibold mb-2">Details</h4>
              <form
                id="update-personnel-form"
                action={async (formData) => {
                  setIsLoading(true);
                  await update_personel_data(formData);
                  setIsLoading(false);
                  onClose();
                }}
                className="space-y-3"
              >
                <input type="hidden" name="id" value={selectedPersonnel.id} />
                <input
                  type="hidden"
                  name="payments"
                  value={JSON.stringify(payments)}
                />
                <div className="grid grid-cols-1 gap-3">
                  <div className="form-control w-full">
                    <label className="label py-1">
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
                    <label className="label py-1">
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
                  <div className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-sm">
                        {t("common.price")}
                      </span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      placeholder="20 %"
                      name="precent"
                      defaultValue={selectedPersonnel.precent}
                      onChange={(e) => setPaymentPrice(e.target.value)}
                      className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Payment Statistics */}
            <h4 className="font-semibold mb-2 mt-4">Payment Analytics</h4>
            <div className="stats shadow w-full mb-4 text-sm">
              <div className="stat py-2">
                <div className="stat-title">Total Payments</div>
                <div className="stat-value text-primary text-xl">
                  {formatCurrency(totalPayments)}
                </div>
                <div className="stat-desc">
                  {payments.length} payments recorded
                </div>
              </div>

              <div className="stat py-2">
                <div className="stat-title">Average Payment</div>
                <div className="stat-value text-secondary text-xl">
                  {payments.length > 0
                    ? formatCurrency(totalPayments / payments.length)
                    : formatCurrency(0)}
                </div>
                <div className="stat-desc">per payment</div>
              </div>
            </div>
          </div>

          {/* Right Column - Payments List */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="font-semibold">Payments</h4>

              <div className="flex gap-2">
                <button
                  onClick={() => setIsAddingPayment(true)}
                  className="btn btn-sm text-white enabled:bg-gradient-to-r from-primary 
                  to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
                  disabled={isAddingPayment}
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add Payment
                </button>
              </div>
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
                        <input
                          type="date"
                          value={
                            paymentDate ? format(paymentDate, "yyyy-MM-dd") : ""
                          }
                          onChange={handleDateChange}
                          className="input input-bordered input-sm bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                          required
                        />
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
                        className="btn btn-sm text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
                      >
                        {t("common.save")}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Payments Table */}
            <div className="overflow-x-auto h-[300px] overflow-y-auto">
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
                    ? "No payments match filters"
                    : "No payments found"}
                </div>
              )}
            </div>
          </div>
        </div>

        <form method="dialog" className="modal-backdrop">
          <button onClick={onClose}>close</button>
        </form>
      </div>
    </div>
  );
}
