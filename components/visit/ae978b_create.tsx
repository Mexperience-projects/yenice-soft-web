"use client";

import type React from "react";

import { useState } from "react";
import { User, Briefcase, Package, Calendar, CreditCard } from "lucide-react";

export default function Visit_ae978b_create() {
  const [formData, setFormData] = useState({
    client: "",
    service: "",
    items: "",
    datetime: "",
    payments: "",
  });

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
          required
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
          required
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
          type="number"
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
          required
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
          type="number"
          value={formData.payments}
          onChange={handleChange}
          className="input input-bordered w-full"
          placeholder="Payment amount"
        />
      </div>
    </div>
  );
}
