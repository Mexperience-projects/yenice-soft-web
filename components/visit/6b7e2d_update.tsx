"use client";

import type React from "react";

import { useState, useEffect } from "react";
import type { visit_ae978bType } from "@/hooks/visit/ae978b";
import { User, Briefcase, Package, Calendar, CreditCard } from "lucide-react";
import { VisitType } from "@/lib/types";

interface VisitProps {
  visit?: visit_ae978bType;
}

export default function Visit_6b7e2d_update({ visit }: VisitProps) {
  const [formData, setFormData] = useState({
    client: "",
    service: "",
    items: "",
    datetime: "",
    payments: "",
  });

  useEffect(() => {
    if (visit) {
      // Format the date for the datetime-local input
      const date = new Date(visit.datetime);
      const formattedDate = date.toISOString().slice(0, 16);

      setFormData({
        client: String(visit.client),
        service: String(visit.service),
        items: String(visit.items || ""),
        datetime: formattedDate,
        payments: String(visit.payments || ""),
      });
    }
  }, [visit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <User className="h-4 w-4" /> Client
          </span>
        </label>
        <input
          id="client"
          name="client"
          type="text"
          value={formData.client}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Select client"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <Briefcase className="h-4 w-4" /> Service
          </span>
        </label>
        <input
          id="service"
          name="service"
          type="text"
          value={formData.service}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Select service"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <Package className="h-4 w-4" /> Items
          </span>
        </label>
        <input
          id="items"
          name="items"
          type="text"
          value={formData.items}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Number of items"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <Calendar className="h-4 w-4" /> Date & Time
          </span>
        </label>
        <input
          id="datetime"
          name="datetime"
          type="datetime-local"
          value={formData.datetime}
          onChange={handleChange}
          className="input input-bordered w-full"
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text flex items-center gap-2">
            <CreditCard className="h-4 w-4" /> Payments
          </span>
        </label>
        <input
          id="payments"
          name="payments"
          type="text"
          value={formData.payments}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Payment amount"
        />
      </div>

      {/* Hidden field for the visit ID if needed */}
      {visit && <input type="hidden" name="id" value={visit.id} />}
    </div>
  );
}
