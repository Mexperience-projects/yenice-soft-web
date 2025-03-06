"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  User,
  Briefcase,
  Package,
  Calendar,
  CreditCard,
  Search,
  Plus,
  Minus,
  X,
} from "lucide-react";
import {
  services_10cd39Type,
  useServices_10cd39,
} from "@/hooks/services/10cd39";
import { items_691d50Type, useItems_691d50 } from "@/hooks/items/691d50";

// Mock data - replace with actual API calls
const mockServices = [
  { id: "1", name: "Consultation" },
  { id: "2", name: "Treatment" },
  { id: "3", name: "Follow-up" },
  { id: "4", name: "Therapy" },
  { id: "5", name: "Assessment" },
];

const mockItems = [
  { id: "1", name: "Medication A" },
  { id: "2", name: "Medication B" },
  { id: "3", name: "Equipment X" },
  { id: "4", name: "Supply Y" },
  { id: "5", name: "Tool Z" },
];

interface SelectedItem {
  id: string;
  quantity: number;
}

export default function VisitCreateForm() {
  const [services, setServices] = useState<services_10cd39Type[]>([]);
  const [items, setItems] = useState<items_691d50Type[]>([]);

  const [formData, setFormData] = useState({
    client: "",
    selectedServices: [] as string[],
    selectedItems: [] as SelectedItem[],
    datetime: "",
    payment: 0,
  });

  const [serviceSearch, setServiceSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");

  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);

  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const itemDropdownRef = useRef<HTMLDivElement>(null);
  const { get_services_list_list, services_list } = useServices_10cd39();
  const { get_items_list_list, items_list } = useItems_691d50();

  // Fetch services and items from server
  useEffect(() => {
    get_services_list_list();
    setServices(services_list);
    get_items_list_list();
    setItems(items_list);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        serviceDropdownRef.current &&
        !serviceDropdownRef.current.contains(event.target as Node)
      ) {
        setShowServiceDropdown(false);
      }
      if (
        itemDropdownRef.current &&
        !itemDropdownRef.current.contains(event.target as Node)
      ) {
        setShowItemDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (serviceId: string) => {
    setFormData((prev) => {
      const selectedServices = prev.selectedServices.includes(serviceId)
        ? prev.selectedServices.filter((id) => id !== serviceId)
        : [...prev.selectedServices, serviceId];

      return { ...prev, selectedServices };
    });
  };

  const handleItemSelect = (itemId: string) => {
    setFormData((prev) => {
      // Check if item is already selected
      const existingItemIndex = prev.selectedItems.findIndex(
        (item) => item.id === itemId
      );

      if (existingItemIndex !== -1) {
        // Remove item if already selected
        const updatedItems = [...prev.selectedItems];
        updatedItems.splice(existingItemIndex, 1);
        return { ...prev, selectedItems: updatedItems };
      } else {
        // Add item with default quantity of 1
        return {
          ...prev,
          selectedItems: [...prev.selectedItems, { id: itemId, quantity: 1 }],
        };
      }
    });
  };

  const updateItemQuantity = (itemId: string, change: number) => {
    setFormData((prev) => {
      const updatedItems = prev.selectedItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: Math.max(1, item.quantity + change),
          };
        }
        return item;
      });

      return { ...prev, selectedItems: updatedItems };
    });
  };

  const adjustPayment = (amount: number) => {
    setFormData((prev) => ({
      ...prev,
      payment: Math.max(0, prev.payment + amount),
    }));
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const removeService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter((id) => id !== serviceId),
    }));
  };

  const removeItem = (itemId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedItems: prev.selectedItems.filter((item) => item.id !== itemId),
    }));
  };

  const isItemSelected = (itemId: string) => {
    return formData.selectedItems.some((item) => item.id === itemId);
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <User className="h-4 w-4" /> Client
              </span>
            </label>
            <input
              id="client"
              name="client"
              value={formData.client}
              onChange={handleChange}
              placeholder="Enter client name"
              className="input input-bordered w-full"
              required
            />
          </div>

          {/* Services Field */}
          <div className="form-control" ref={serviceDropdownRef}>
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Briefcase className="h-4 w-4" /> Services
              </span>
            </label>
            <div className="relative w-full">
              <div
                className="input input-bordered flex justify-between items-center cursor-pointer w-full"
                onClick={() => setShowServiceDropdown(true)}
              >
                <span className="text-sm">
                  {formData.selectedServices.length > 0
                    ? `${formData.selectedServices.length} service(s) selected`
                    : "Select services"}
                </span>
                <Search className="h-4 w-4 opacity-50" />
              </div>

              {showServiceDropdown && (
                <div className="absolute z-30 bg-base-100 shadow-lg rounded-box w-full mt-1">
                  <div className="p-2">
                    <div className="flex items-center border-b border-base-300 pb-2">
                      <Search className="h-4 w-4 mr-2 opacity-50" />
                      <input
                        type="text"
                        placeholder="Search services..."
                        className="input input-sm input-ghost w-full focus:outline-none"
                        value={serviceSearch}
                        onChange={(e) => setServiceSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className="menu menu-compact py-2 max-h-60 overflow-y-auto">
                      {filteredServices.length === 0 ? (
                        <li className="disabled text-center py-2 text-sm opacity-50">
                          No services found
                        </li>
                      ) : (
                        filteredServices.map((service) => (
                          <li key={service.id}>
                            <a
                              className={`flex items-center ${
                                formData.selectedServices.includes(service.id)
                                  ? "active"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleServiceSelect(service.id);
                              }}
                            >
                              <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">
                                  <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm"
                                    checked={formData.selectedServices.includes(
                                      service.id
                                    )}
                                    readOnly
                                  />
                                  <span>{service.name}</span>
                                </label>
                              </div>
                            </a>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {formData.selectedServices.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.selectedServices.map((id) => {
                  const service = services.find((s) => s.id === id);
                  return service ? (
                    <div key={id} className="badge badge-secondary gap-1">
                      {service.name}
                      <button
                        className="btn btn-ghost btn-xs btn-circle"
                        onClick={() => removeService(id)}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Items Field */}
          <div className="form-control" ref={itemDropdownRef}>
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <Package className="h-4 w-4" /> Items
              </span>
            </label>
            <div className="relative w-full">
              <div
                className="input input-bordered flex justify-between items-center cursor-pointer w-full"
                onClick={() => setShowItemDropdown(true)}
              >
                <span className="text-sm">
                  {formData.selectedItems.length > 0
                    ? `${formData.selectedItems.length} item(s) selected`
                    : "Select items"}
                </span>
                <Search className="h-4 w-4 opacity-50" />
              </div>

              {showItemDropdown && (
                <div className="absolute z-30 bg-base-100 shadow-lg rounded-box w-full mt-1">
                  <div className="p-2">
                    <div className="flex items-center border-b border-base-300 pb-2">
                      <Search className="h-4 w-4 mr-2 opacity-50" />
                      <input
                        type="text"
                        placeholder="Search items..."
                        className="input input-sm input-ghost w-full focus:outline-none"
                        value={itemSearch}
                        onChange={(e) => setItemSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className="menu menu-compact py-2 max-h-60 overflow-y-auto">
                      {filteredItems.length === 0 ? (
                        <li className="disabled text-center py-2 text-sm opacity-50">
                          No items found
                        </li>
                      ) : (
                        filteredItems.map((item) => (
                          <li key={item.id}>
                            <a
                              className={`flex items-center ${
                                isItemSelected(item.id) ? "active" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleItemSelect(item.id);
                              }}
                            >
                              <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">
                                  <input
                                    type="checkbox"
                                    className="checkbox checkbox-sm"
                                    checked={isItemSelected(item.id)}
                                    readOnly
                                  />
                                  <span>{item.name}</span>
                                </label>
                              </div>
                            </a>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {formData.selectedItems.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.selectedItems.map((selectedItem) => {
                  const item = items.find((i) => i.id === selectedItem.id);
                  return item ? (
                    <div
                      key={selectedItem.id}
                      className="flex items-center justify-between bg-base-200 p-2 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-circle btn-ghost"
                          onClick={() =>
                            updateItemQuantity(selectedItem.id, -1)
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center">
                          {selectedItem.quantity}
                        </span>
                        <button
                          type="button"
                          className="btn btn-sm btn-circle btn-ghost"
                          onClick={() => updateItemQuantity(selectedItem.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-circle btn-ghost text-error"
                          onClick={() => removeItem(selectedItem.id)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Date & Time Field */}
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

          {/* Payment Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Payment
              </span>
            </label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                className="btn btn-outline btn-square btn-sm"
                onClick={() => adjustPayment(-100)}
              >
                <Minus className="h-4 w-4" />
              </button>
              <input
                id="payment"
                name="payment"
                type="number"
                value={formData.payment}
                onChange={handleChange}
                className="input input-bordered w-full"
                min="0"
              />
              <button
                type="button"
                className="btn btn-outline btn-square btn-sm"
                onClick={() => adjustPayment(100)}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button type="submit" className="btn btn-primary w-full">
            Create Visit
          </button>
        </div>
      </div>
    </div>
  );
}
