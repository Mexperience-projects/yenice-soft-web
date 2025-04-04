"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { usePersonel_e02ed2 } from "@/hooks/personel/e02ed2";
import type { PersonelPayments, PersonelType } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { PlusIcon } from "lucide-react";
import PersonnelPaymentsModal from "./personnel-payments-modal";

interface PersonnelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPersonnel?: PersonelType;
}

export default function PersonnelDetailsModal({
  isOpen,
  onClose,
  selectedPersonnel,
}: PersonnelDetailsModalProps) {
  const { t } = useTranslation();
  const { create_personel_data, update_personel_data } = usePersonel_e02ed2();

  // State for form validation
  const [createFormValid, setCreateFormValid] = useState(false);
  const [updateFormValid, setUpdateFormValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // State for payments modal
  const [isPaymentsModalOpen, setIsPaymentsModalOpen] = useState(false);
  const [isDetailsModalOpen, setisDetailsModalOpen] = useState(true);

  // Add this state to track payments
  const [personnelPayments, setPersonnelPayments] = useState<
    PersonelPayments[]
  >([]);

  // Add this useEffect to initialize payments when the selected personnel changes
  useEffect(() => {
    if (selectedPersonnel) {
      setPersonnelPayments(selectedPersonnel.payments || []);
    }
  }, [selectedPersonnel]);

  useEffect(() => {
    if (selectedPersonnel) {
      // Set update form as valid initially since we're editing existing data
      setUpdateFormValid(true);
    } else {
      // Reset create form validity when opening a new form
      setCreateFormValid(false);
    }
  }, [selectedPersonnel]);

  // Handle form input changes
  const handleCreateFormChange = (e: React.FormEvent) => {
    const form = e.currentTarget as HTMLFormElement;
    setCreateFormValid(form.checkValidity());
  };

  const handleUpdateFormChange = (e: React.FormEvent) => {
    const form = e.currentTarget as HTMLFormElement;
    setUpdateFormValid(form.checkValidity());
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  const openPaymentsModal = () => {
    setIsPaymentsModalOpen(true);
  };

  const closePaymentsModal = (updatedPayments?: PersonelPayments[]) => {
    if (updatedPayments) {
      // Update the payments in the details modal
      setPersonnelPayments(updatedPayments);
    }
    setIsPaymentsModalOpen(false);
    setisDetailsModalOpen(true);
  };

  // Handle form submission for updating personnel
  const handleUpdatePersonnel = async (formData: FormData) => {
    setIsLoading(true);

    // Make sure we're using the latest payments data
    formData.set("payments", JSON.stringify(personnelPayments));

    try {
      // Send all data to the server
      await update_personel_data(formData);
      onClose();
    } catch (error) {
      console.error("Failed to update personnel:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  // Calculate total payments if personnel exists
  const totalPayments = personnelPayments.reduce(
    (sum, payment) => sum + payment.price,
    0
  );

  // If no personnel is selected, show the create form
  if (!selectedPersonnel) {
    return (
      <div className="modal modal-open">
        <div className="modal-box max-w-2xl p-0">
          <div className="p-4 flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center">
              <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
              {t("personnel.addNewPersonnel")}
            </h3>
            <div className="flex gap-2">
              <button
                type="submit"
                form="create-personnel-form"
                disabled={isLoading || !createFormValid}
                className={`btn btn-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary border-none ${
                  !createFormValid || isLoading
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

          <div className="p-4 border-t">
            {/* Personnel Details Section */}
            <div className="mt-2">
              <h4 className="font-semibold mb-2">{t("analytics.details")}</h4>
              <form
                id="create-personnel-form"
                onChange={handleCreateFormChange}
                action={async (formData) => {
                  setIsLoading(true);
                  try {
                    await create_personel_data(formData);
                    onClose();
                  } catch (error) {
                    console.error("Failed to create personnel:", error);
                  } finally {
                    setIsLoading(false);
                  }
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
                      step="1"
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
            <h4 className="font-semibold mb-2 mt-4">
              {t("analytics.paymentanalytics")}
            </h4>
            <div className="stats shadow w-full mb-4 text-sm">
              <div className="stat py-2">
                <div className="stat-title">{t("analytics.totalPayments")}</div>
                <div className="stat-value text-primary text-xl">
                  {formatCurrency(0)}
                </div>
                <div className="stat-desc">
                  0 {t("analytics.paymentsRecorded")}
                </div>
              </div>

              <div className="stat py-2">
                <div className="stat-title">
                  {t("analytics.averagePayment")}
                </div>
                <div className="stat-value text-secondary text-xl">
                  {formatCurrency(0)}
                </div>
                <div className="stat-desc">{t("analytics.perPayment")}</div>
              </div>
            </div>

            <div className="text-center py-4 text-gray-500">
              {t("payments.savePersonnelFirst")}
            </div>
          </div>

          <div className="modal-backdrop" onClick={onClose}></div>
        </div>
      </div>
    );
  }

  // If personnel is selected, show the edit form
  return (
    <>
      <div className="modal modal-open">
        {isDetailsModalOpen && (
          <div className="modal-box max-w-2xl p-0">
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 flex items-center">
                <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
                {selectedPersonnel.name}
              </h3>
              <div className="flex gap-2">
                <button
                  type="submit"
                  form="update-personnel-form"
                  disabled={isLoading || !updateFormValid}
                  className={`btn btn-sm text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary border-none ${
                    !updateFormValid || isLoading
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

            <div className="p-4 border-t">
              {/* Personnel Details Section */}
              <div className="mt-2">
                <h4 className="font-semibold mb-2">{t("analytics.details")}</h4>
                <form
                  id="update-personnel-form"
                  onChange={handleUpdateFormChange}
                  action={(formData) => handleUpdatePersonnel(formData)}
                  className="space-y-3"
                >
                  <input type="hidden" name="id" value={selectedPersonnel.id} />
                  <input
                    type="hidden"
                    name="payments"
                    value={JSON.stringify(personnelPayments)}
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
                        step="1"
                        min="0"
                        max="100"
                        placeholder="20 %"
                        name="precent"
                        defaultValue={selectedPersonnel.precent}
                        className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary"
                        required
                      />
                    </div>
                  </div>
                </form>
              </div>

              {/* Payment Statistics */}
              <h4 className="font-semibold mb-2 mt-4">
                {t("analytics.paymentanalytics")}
              </h4>
              <div className="stats shadow w-full mb-4 text-sm">
                <div className="stat py-2">
                  <div className="stat-title">
                    {t("analytics.totalPayments")}
                  </div>
                  <div className="stat-value text-primary text-xl">
                    {formatCurrency(totalPayments)}
                  </div>
                  <div className="stat-desc">
                    {personnelPayments.length} {t("analytics.paymentsRecorded")}
                  </div>
                </div>

                <div className="stat py-2">
                  <div className="stat-title">
                    {t("analytics.averagePayment")}
                  </div>
                  <div className="stat-value text-secondary text-xl">
                    {personnelPayments.length > 0
                      ? formatCurrency(totalPayments / personnelPayments.length)
                      : formatCurrency(0)}
                  </div>
                  <div className="stat-desc">{t("analytics.perPayment")}</div>
                </div>
              </div>

              {/* Button to open payments modal */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={openPaymentsModal}
                  className="btn btn-md text-white enabled:bg-gradient-to-r from-primary 
              to-secondary hover:from-primary/90 hover:to-secondary/90 border-none"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  {t("payments.managePayments")}
                </button>
              </div>
            </div>

            <div className="modal-backdrop" onClick={onClose}></div>
          </div>
        )}

        {/* Payments Modal */}
        {isPaymentsModalOpen && (
          <PersonnelPaymentsModal
            isOpen={isPaymentsModalOpen}
            onOpen={() => setisDetailsModalOpen(false)}
            onClose={(updatedPayments) => {
              closePaymentsModal(updatedPayments);
            }}
            selectedPersonnel={{
              ...selectedPersonnel,
              payments: personnelPayments,
            }}
          />
        )}
      </div>
    </>
  );
}
