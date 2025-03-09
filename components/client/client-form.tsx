"use client";

import { useState, useEffect } from "react";
import { ClientType } from "@/lib/types";
import {
  Calendar,
  User,
  Users,
  CreditCard,
  CalendarDays,
  Info,
} from "lucide-react";

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
      newErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.nationalCo.trim()) {
      newErrors.nationalCo = "National ID is required";
      isValid = false;
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "Birthdate is required";
      isValid = false;
    } else {
      const selectedDate = new Date(formData.birthdate);
      const today = new Date();

      if (selectedDate > today) {
        newErrors.birthdate = "Birthdate cannot be in the future";
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
            Client Information
          </h2>

          <div className="divider my-0"></div>

          {/* Name Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <User className="h-4 w-4" />
                Full Name
              </span>
              <span className="label-text-alt text-error">{errors.name}</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter client's full name"
              className={`input input-bordered w-full ${
                errors.name ? "input-error" : ""
              }`}
            />
            <label className="label">
              <span className="label-text-alt text-base-content opacity-60">
                Client's legal full name
              </span>
            </label>
          </div>

          {/* National ID Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                National ID
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
              placeholder="Enter national ID number"
              className={`input input-bordered w-full ${
                errors.nationalCo ? "input-error" : ""
              }`}
            />
            <label className="label">
              <span className="label-text-alt text-base-content opacity-60">
                Government-issued identification number
              </span>
            </label>
          </div>

          {/* Birthdate Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text flex items-center gap-1">
                <CalendarDays className="h-4 w-4" />
                Birthdate
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
                  Age: {calculateAge(formData.birthdate)} years
                </div>
              )}
            </div>
            <label className="label">
              <span className="label-text-alt text-base-content opacity-60">
                Client's date of birth
              </span>
            </label>
          </div>

          {/* Gender Field */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Gender</span>
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
                <span className="label-text">Male</span>
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
                <span className="label-text">Female</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Information Card (Optional) */}
      <div className="card bg-base-100 shadow-sm">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <Info className="h-5 w-5" />
            Additional Information
          </h2>

          <div className="divider my-0"></div>

          <div className="bg-base-200 rounded-lg p-4 text-center text-base-content opacity-70">
            Additional client fields can be added here (address, phone, email,
            etc.)
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-2 mt-6">
        <button type="button" className="btn btn-outline">
          Cancel
        </button>
        <button
          type="submit"
          className={`btn btn-primary ${isSubmitting ? "loading" : ""}`}
          disabled={isSubmitting}
        >
          {client ? "Update Client" : "Create Client"}
        </button>
      </div>
    </div>
  );
}
