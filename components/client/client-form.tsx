"use client";

import type React from "react";

import { useState } from "react";
import type { ClientType } from "@/lib/types";
import { User, Users, CreditCard, CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ClientFormProps {
  client?: ClientType;
  onSubmit?: (formData: FormData) => void;
  isSubmitting?: boolean;
}

export default function ClientForm({
  client,
  onSubmit,
  isSubmitting = false,
}: ClientFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: client?.name || "",
    nationalCo: client?.nationalCo || "",
    birthdate: client?.birthdate
      ? new Date(client.birthdate).toISOString().split("T")[0]
      : "",
    gender: client?.gender?.toString() || "1",
  });

  const [errors, setErrors] = useState({
    name: "",
    nationalCo: "",
    birthdate: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.name.trim()) {
      newErrors.name = t("clients.nameRequired");
      isValid = false;
    }

    if (!formData.nationalCo.trim()) {
      newErrors.nationalCo = t("clients.nationalIdRequired");
      isValid = false;
    }

    if (!formData.birthdate) {
      newErrors.birthdate = t("clients.birthdateRequired");
      isValid = false;
    } else {
      const selectedDate = new Date(formData.birthdate);
      const today = new Date();

      if (selectedDate > today) {
        newErrors.birthdate = t("clients.birthdateFuture");
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (onSubmit) {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      if (client?.id) {
        formDataObj.append("id", client.id.toString());
      }

      onSubmit(formDataObj);
    }
  };

  const calculateAge = (birthdate: string) => {
    if (!birthdate) return "";

    const birthDate = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  return (
    <div className="space-y-6">
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <Users className="h-5 w-5" />
            {t("clients.clientInformation")}
          </h2>

          <div className="divider my-0"></div>

          {/* Name Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <User className="h-4 w-4" />
                {t("clients.fullName")}
              </span>
              <span className="label-text-alt text-error">{errors.name}</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder={t("clients.enterFullName")}
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : ""
              }`}
            />
            <label className="label">
              <span className="label-text-alt text-base-content opacity-60">
                {t("clients.legalFullName")}
              </span>
            </label>
          </div>

          {/* National ID Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                {t("clients.nationalId")}
              </span>
              <span className="label-text-alt text-error">
                {errors.nationalCo}
              </span>
            </label>
            <input
              type="text"
              name="nationalCo"
              value={formData.nationalCo}
              onChange={handleChange}
              placeholder={t("clients.enterNationalId")}
              className={`input input-bordered w-full ${
                errors.nationalCo ? "input-error" : ""
              }`}
            />
            <label className="label">
              <span className="label-text-alt text-base-content opacity-60">
                {t("clients.governmentId")}
              </span>
            </label>
          </div>

          {/* Birthdate Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                {t("clients.birthdate")}
              </span>
              <span className="label-text-alt text-error">
                {errors.birthdate}
              </span>
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className={`input input-bordered w-full ${
                  errors.birthdate ? "input-error" : ""
                }`}
              />
              {formData.birthdate && (
                <div className="badge badge-neutral self-center whitespace-nowrap">
                  {t("clients.age")}: {calculateAge(formData.birthdate)}{" "}
                  {t("clients.years")}
                </div>
              )}
            </div>
            <label className="label">
              <span className="label-text-alt text-base-content opacity-60">
                {t("clients.dateOfBirth")}
              </span>
            </label>
          </div>

          {/* Gender Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">{t("clients.gender")}</span>
            </label>
            <div className="flex flex-wrap gap-4">
              <label className="label cursor-pointer justify-start gap-2 border rounded-lg px-4 py-2 hover:bg-base-200 transition-colors">
                <input
                  type="radio"
                  name="gender"
                  value="1"
                  className="radio radio-primary"
                  checked={formData.gender === "1"}
                  onChange={handleChange}
                />
                <span className="label-text">{t("clients.male")}</span>
              </label>
              <label className="label cursor-pointer justify-start gap-2 border rounded-lg px-4 py-2 hover:bg-base-200 transition-colors">
                <input
                  type="radio"
                  name="gender"
                  value="2"
                  className="radio radio-secondary"
                  checked={formData.gender === "2"}
                  onChange={handleChange}
                />
                <span className="label-text">{t("clients.female")}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
