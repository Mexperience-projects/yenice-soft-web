"use client";

import type React from "react";
import { useState } from "react";
import { useuser_e02ed2 } from "@/hooks/user/e02ed2";
import { useTranslation } from "react-i18next";
import { UsersType } from "@/lib/types";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  selecteduser: UsersType | null;
}

export default function userModal({
  isOpen,
  onClose,
  selecteduser,
}: UserModalProps) {
  const { t } = useTranslation();
  const { create_user_data, update_user_data } = useuser_e02ed2();

  // State for payment form
  const [isAddingPayment, setIsAddingPayment] = useState(false);

  const [paymentPrice, setPaymentPrice] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());

  // State for user payments

  // State for filters
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [sortField, setSortField] = useState<"date" | "price">("date");

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

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

  // If no user is selected, show the same layout but with empty fields
  if (!selecteduser) {
    // Create an empty user object to use the same layout
    const emptyuser = {
      id: "",
      name: "",
      description: "",
      payments: [],
    };

    // Use the same layout but with the create_user_data action
    return (
      <div className="modal modal-open">
        <div className="modal-box max-w-5xl p-0">
          <div className="p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
              {t("user.addNewuser")}
            </h3>
            <div className="flex gap-2">
              <button
                type="submit"
                form="create-user-form"
                disabled={isLoading}
                className="btn btn-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    {t("common.saving")}
                  </>
                ) : (
                  t("user.addNewuser")
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

          <div className="p-4 border-t lg:border-t-0 lg:border-r">
            {/* user Details Section */}
            <div className="mt-2">
              <h4 className="font-semibold mb-2">Details</h4>
              <form
                id="create-user-form"
                action={async (formData) => {
                  setIsLoading(true);
                  await create_user_data(formData);
                  setIsLoading(false);
                  onClose();
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 gap-3">
                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text text-gray-700 font-medium">
                        {t("user.fullName")}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder={t("user.enterFullName")}
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
                      placeholder={t("user.enterPosition")}
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
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={onClose}>close</button>
          </form>
        </div>
      </div>
    );
  }

  // If user is selected, show the two-column layout
  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-5xl p-0">
        <div className="p-4 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
            {selecteduser.name}
          </h3>
          <div className="flex gap-2">
            <button
              type="submit"
              form="update-user-form"
              disabled={isLoading}
              className="btn btn-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
            >
              {isLoading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  {t("common.saving")}
                </>
              ) : (
                t("user.saveChanges")
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="p-4 border-t lg:border-t-0 lg:border-r">
            <div className="mt-2">
              <h4 className="font-semibold mb-2">Details</h4>
              <form
                id="update-user-form"
                action={async (formData) => {
                  setIsLoading(true);
                  await update_user_data(formData);
                  setIsLoading(false);
                  onClose();
                }}
                className="space-y-3"
              >
                <div className="grid grid-cols-1 gap-3">
                  <div className="form-control w-full">
                    <label className="label py-1">
                      <span className="label-text text-gray-700 font-medium">
                        {t("user.fullName")}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      placeholder={t("user.enterFullName")}
                      className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                      defaultValue={selecteduser.name}
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
                      placeholder={t("user.enterPosition")}
                      className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                      defaultValue={selecteduser.description}
                      required
                    />
                  </div>
                </div>
              </form>
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
