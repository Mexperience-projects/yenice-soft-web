"use client";

import type React from "react";

import { useEffect, useState } from "react";
import type { ClientType } from "@/lib/types";
import { User, Users, CreditCard, CalendarDays, Phone } from "lucide-react";
import { useTranslation } from "react-i18next";

interface ClientFormProps {
  onSubmit?: (formData: FormData) => void;
  isSubmitting?: boolean;
  defaultValues?: ClientType;
}

export default function ClientForm({ defaultValues }: ClientFormProps) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState<Omit<ClientType, "id">>({
    name: "",
    nationalCo: "",
    birthdate: new Date(),
    gender: 1,
    phone: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    nationalCo: "",
    birthdate: "",
    phone: "",
  });
  console.log(formData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  useEffect(() => {
    if (defaultValues) {
      setFormData(defaultValues);
    }
  }, [defaultValues]);

  const calculateAge = (birthdate: Date) => {
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

          {/* Phone Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <Phone className="h-4 w-4" />
                {t("clients.phone")}
              </span>
              <span className="label-text-alt text-error">{errors.phone}</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone || ""}
              onChange={handleChange}
              placeholder={t("clients.enterPhone")}
              className={`input input-bordered w-full ${
                errors.phone ? "input-error" : ""
              }`}
            />
            <label className="label">
              <span className="label-text-alt text-base-content opacity-60">
                {t("clients.contactNumber")}
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
                value={
                  formData.birthdate
                    ? new Date(formData.birthdate).toISOString().split("T")[0]
                    : ""
                }
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
                  checked={formData.gender === 1}
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
                  checked={formData.gender === 2}
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
