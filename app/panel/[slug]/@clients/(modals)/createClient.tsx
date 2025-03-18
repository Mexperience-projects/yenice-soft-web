"use client";

import type React from "react";

import ClientForm from "@/components/client/client-form";
import { useTranslation } from "react-i18next";
import type { ClientType } from "@/lib/types";
import { useState, useEffect } from "react";

interface CreateClientModal {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (form_: FormData) => void;
  defaultValues?: ClientType;
}

export default function CreateClientModal({
  isOpen,
  onClose,
  onSubmit,
  defaultValues,
}: CreateClientModal) {
  const { t } = useTranslation();
  const [isFormValid, setIsFormValid] = useState(false);

  // Function to check form validity
  const checkFormValidity = (form: HTMLFormElement) => {
    return form.checkValidity();
  };

  // Effect to reset form validity when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      // Reset form validity when modal opens
      const form = document.querySelector(
        'form[action="#"]'
      ) as HTMLFormElement;
      if (form) {
        setIsFormValid(checkFormValidity(form));
      }
    }
  }, [isOpen]);

  // Handle form input changes to validate in real-time
  const handleFormChange = (e: React.FormEvent) => {
    const form = e.currentTarget as HTMLFormElement;
    setIsFormValid(checkFormValidity(form));
  };

  return (
    <dialog
      className={`modal z-[99999999999999999999999] ${isOpen ? "modal-open" : ""}`}
    >
      <div className="modal-box max-w-2xl bg-white rounded-xl shadow-lg ">
        <form method="dialog">
          <button
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            onClick={onClose}
          >
            ✕
          </button>
        </form>
        <h3 className="font-bold text-lg text-gray-800 flex items-center ">
          <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
          {t("clients.addNewClient")}
        </h3>
        <p className="py-2 text-gray-600">{t("clients.enterFullName")}</p>

        <form
          action="#"
          onChange={handleFormChange}
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            onSubmit(formData);
            onClose();
          }}
          className="mt-4 "
        >
          <input type="hidden" name="id" value={defaultValues?.id} />
          <ClientForm defaultValues={defaultValues} />
          <div className="flex justify-end gap-2 mt-6 ">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
              onClick={onClose}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              disabled={!isFormValid}
              className={`px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg transition-all duration-300 ${
                !isFormValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:from-primary/90 hover:to-secondary/90"
              }`}
            >
              {t("common.create")}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>{t("common.close")}</button>
      </form>
    </dialog>
  );
}
