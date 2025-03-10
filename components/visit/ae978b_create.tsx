"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import {
  Briefcase,
  Package,
  Calendar,
  CreditCard,
  Search,
  Plus,
  Minus,
  X,
  Check,
  Edit,
  Trash2,
} from "lucide-react";
import {
  type services_10cd39Type,
  useServices_10cd39,
} from "@/hooks/services/10cd39";
import { type items_691d50Type, useItems_691d50 } from "@/hooks/items/691d50";
import { useClients } from "@/hooks/clients/main";
import {
  ItemsType,
  OperationType,
  PaymentsType,
  ServicesType,
} from "@/lib/types";
import { cn } from "@/lib/utils";

interface VisitProps {
  initial?: OperationType;
  readonly?: boolean;
  setFormData: (newValue: OperationType) => void;
}

export default function VisitCreateForm({
  initial,
  readonly,
  setFormData: updateFormData,
}: VisitProps) {
  const [formData, setFormData] = useState(initial);

  // New payment form state
  const [newPayment, setNewPayment] = useState<PaymentsType>({
    id: -1,
    date: new Date(),
    description: "",
    price: 0,
    paid: false,
  });

  useEffect(() => {
    setFormData(initial);
    console.log(initial);
  }, [initial]);

  useEffect(() => {
    if (!formData) return;
    updateFormData(formData);
  }, [formData]);

  // Edit payment state
  const [editingPayment, setEditingPayment] = useState<PaymentsType | null>(
    null
  );

  const [serviceSearch, setServiceSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");

  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [showItemDropdown, setShowItemDropdown] = useState(false);

  const serviceDropdownRef = useRef<HTMLDivElement>(null);
  const itemDropdownRef = useRef<HTMLDivElement>(null);
  const { services_list } = useServices_10cd39();
  const { items_list } = useItems_691d50();

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
    if (!formData) return;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewPaymentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    setNewPayment((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "price"
          ? Number.parseFloat(value)
          : value,
    }));
  };

  const handleServiceSelect = (service: ServicesType) => {
    setFormData((prev) => {
      if (!prev) return;
      if (prev.service.includes(service))
        return {
          ...prev,
          service: [
            ...prev.service.filter((preService) => preService !== service),
          ],
        };
      return {
        ...prev,
        service: [
          ...prev.service.filter((preService) => preService !== service),
          service,
        ],
      };
    });
  };

  const handleItemSelect = (itemId: ItemsType) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return;
      // Check if item is already selected
      const existingItemIndex = prev.items.findIndex(
        (item) => item.item.id === itemId.id
      );
      if (existingItemIndex !== -1) {
        // Remove item if already selected
        const updatedItems = [...prev.items];
        updatedItems.splice(existingItemIndex, 1);
        return { ...prev, items: updatedItems };
      } else {
        // Add item with default quantity of 1
        return {
          ...prev,
          items: [
            ...prev.items,
            {
              id: (prev.items.length + 1) * -1,
              count: 1,
              visit: -1,
              item: itemId,
            },
          ],
        };
      }
    });
  };

  const updateItemQuantity = (itemId: ItemsType["id"], change: number) => {
    if (!formData) return;
    setFormData((prev) => {
      if (!prev) return;
      const updatedItems = prev.items.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            count: Math.max(1, item.count + change),
          };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  const addPayment = () => {
    if (!formData) return;
    if (newPayment.description && newPayment.price > 0) {
      const paymentId = editingPayment?.id || -1;

      setFormData((prev: any) => {
        let updatedPayments;

        if (editingPayment) {
          // Update existing payment
          updatedPayments = prev.payments.map((payment: any) =>
            payment.id === editingPayment.id
              ? { ...newPayment, id: editingPayment.id }
              : payment
          );
        } else {
          // Add new payment
          updatedPayments = [
            ...prev.payments,
            { ...newPayment, id: paymentId },
          ];
        }

        return { ...prev, payments: updatedPayments };
      });

      // Reset form
      setNewPayment({
        id: -1,
        date: new Date(),
        description: "",
        price: 0,
        paid: false,
      });

      setEditingPayment(null);
    }
  };

  const editPayment = (payment: PaymentsType) => {
    setNewPayment({
      id: payment.id,
      date: payment.date,
      description: payment.description,
      price: payment.price,
      paid: payment.paid,
    });
    setEditingPayment(payment);
  };

  const deletePayment = (paymentId: number) => {
    if (!formData) return;
    setFormData({
      ...formData,
      payments: formData.payments.filter((payment) => payment.id !== paymentId),
    });

    if (editingPayment?.id === paymentId) {
      setEditingPayment(null);
      setNewPayment({
        id: -1,
        date: new Date(),
        description: "",
        price: 0,
        paid: false,
      });
    }
  };

  const filteredServices = services_list.filter((service) => service.name);

  const filteredItems = items_list.filter((item) =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

  const removeService = (service: ServicesType) => {
    if (!formData) return;
    setFormData({
      ...formData,
      service: formData.service.filter((preService) => preService !== service),
    });
  };

  const removeItem = (itemId: ItemsType["id"]) => {
    if (!formData) return;
    setFormData({
      ...formData,
      items: formData.items.filter((item) => item.id !== itemId),
    });
  };

  const isItemSelected = (itemId: ItemsType["id"]) => {
    if (!formData) return;
    return formData.items.some((item) => item.item.id === itemId);
  };

  const calculateTotalPayment = () => {
    if (!formData) return;
    return formData.payments.reduce(
      (total, payment) => total + payment.price,
      0
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Services Field */}
          <div className="form-control" ref={serviceDropdownRef}>
            <label className="label">
              <span className="label-text flex items-center gap-2 text-gray-700 font-medium">
                <div className="bg-secondary/10 p-1 rounded-full">
                  <Briefcase className="h-4 w-4 text-secondary" />
                </div>
                Services
              </span>
            </label>
            <div className="relative w-full">
              <div
                className={cn(
                  "input input-bordered flex justify-between items-center",
                  "w-full bg-gray-50 border-gray-200",
                  {
                    "cursor-pointer": !readonly,
                    "bg-gray-100 text-gray-500": readonly,
                  }
                )}
                onClick={() => {
                  if (!readonly) setShowServiceDropdown(true);
                }}
              >
                <span className="text-sm">
                  {(formData?.service.length || 0) > 0
                    ? `${(formData?.service || []).length} service(s) selected`
                    : "Select services"}
                </span>
                <Search className="h-4 w-4 opacity-50" />
              </div>

              {showServiceDropdown && (
                <div className="absolute z-30 bg-white shadow-lg rounded-lg w-full mt-1 border border-gray-100">
                  <div className="p-2">
                    <div className="flex items-center border-b border-gray-100 pb-2">
                      <Search className="h-4 w-4 mr-2 opacity-50" />
                      <input
                        disabled={readonly}
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
                                (formData?.service || []).includes(service)
                                  ? "bg-primary/10 text-primary"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleServiceSelect(service);
                              }}
                            >
                              <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">
                                  <input
                                    disabled={readonly}
                                    type="checkbox"
                                    className="checkbox checkbox-sm checkbox-primary"
                                    checked={(formData?.service || []).includes(
                                      service
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

            {formData && formData.service.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {formData.service.map((service) => (
                  <div
                    key={service.id}
                    className="badge bg-secondary/10 text-secondary gap-1 border-0"
                  >
                    {service.name}
                    <button
                      className="btn btn-ghost btn-xs btn-circle"
                      onClick={() => removeService(service)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Items Field */}
          <div className="form-control" ref={itemDropdownRef}>
            <label className="label">
              <span className="label-text flex items-center gap-2 text-gray-700 font-medium">
                <div className="bg-primary/10 p-1 rounded-full">
                  <Package className="h-4 w-4 text-primary" />
                </div>
                Items
              </span>
            </label>
            <div className="relative w-full">
              <div
                className={cn(
                  "input input-bordered flex justify-between items-center",
                  "w-full bg-gray-50 border-gray-200",
                  {
                    "cursor-pointer": !readonly,
                    "bg-gray-100 text-gray-500": readonly,
                  }
                )}
                onClick={() => {
                  if (!readonly) setShowItemDropdown(true);
                }}
              >
                <span className="text-sm">
                  {formData && formData.service.length > 0
                    ? `${formData.service.length} item(s) selected`
                    : "Select items"}
                </span>
                <Search className="h-4 w-4 opacity-50" />
              </div>

              {showItemDropdown && (
                <div className="absolute z-30 bg-white shadow-lg rounded-lg w-full mt-1 border border-gray-100">
                  <div className="p-2">
                    <div className="flex items-center border-b border-gray-100 pb-2">
                      <Search className="h-4 w-4 mr-2 opacity-50" />
                      <input
                        disabled={readonly}
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
                                isItemSelected(item.id)
                                  ? "bg-primary/10 text-primary"
                                  : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleItemSelect(item);
                              }}
                            >
                              <div className="form-control">
                                <label className="label cursor-pointer justify-start gap-2">
                                  <input
                                    disabled={readonly}
                                    type="checkbox"
                                    className="checkbox checkbox-sm checkbox-primary"
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

            {formData && formData.items.length > 0 && (
              <div className="mt-2 space-y-2">
                {formData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.item.name}</span>
                    </div>
                    {readonly ? (
                      <span className="text-center px-2">
                        count: {item.count}
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          className="btn btn-sm btn-circle bg-gray-100 hover:bg-gray-200 border-0"
                          onClick={() => updateItemQuantity(item.id, -1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center">{item.count}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-circle bg-gray-100 hover:bg-gray-200 border-0"
                          onClick={() => updateItemQuantity(item.id, 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-circle bg-red-50 hover:bg-red-100 border-0 text-red-500"
                          onClick={() => removeItem(item.id)}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date & Time Field */}
          <div className="form-control">
            <label className="label">
              <span className="label-text flex items-center gap-2 text-gray-700 font-medium">
                <div className="bg-secondary/10 p-1 rounded-full">
                  <Calendar className="h-4 w-4 text-secondary" />
                </div>
                Date
              </span>
            </label>
            <input
              disabled={readonly}
              id="datetime"
              name="datetime"
              type="date"
              value={new Date(
                formData?.datetime || Date.now()
              ).toLocaleDateString("en-CA")}
              onChange={handleChange}
              className="input input-bordered w-full bg-gray-50 border-gray-200 focus:border-secondary focus:ring-secondary"
              required
            />
          </div>

          {/* Payments Section - Full Width */}
          <div className="col-span-1 md:col-span-2">
            <div className="form-control">
              <label className="label">
                <span className="label-text flex items-center gap-2 text-gray-700 font-medium">
                  <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-1 rounded-full">
                    <CreditCard className="h-4 w-4 text-secondary" />
                  </div>
                  Payments
                </span>
                <span className="label-text-alt text-gray-500">
                  Total: {calculateTotalPayment()}{" "}
                  {formData &&
                    formData.payments.length > 0 &&
                    `(${formData.payments.length} entries)`}
                </span>
              </label>

              {/* Add/Edit Payment Form */}
              {!readonly && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-700">Date</span>
                    </label>
                    <input
                      disabled={readonly}
                      type="date"
                      name="date"
                      value={newPayment.date.toString()}
                      onChange={handleNewPaymentChange}
                      className="input input-bordered w-full bg-white border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="form-control md:col-span-2">
                    <label className="label">
                      <span className="label-text text-gray-700">
                        Description
                      </span>
                    </label>
                    <input
                      disabled={readonly}
                      type="text"
                      name="description"
                      value={newPayment.description}
                      onChange={handleNewPaymentChange}
                      placeholder="Enter payment description"
                      className="input input-bordered w-full bg-white border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text text-gray-700">Amount</span>
                    </label>
                    <input
                      disabled={readonly}
                      type="number"
                      name="price"
                      value={newPayment.price}
                      onChange={handleNewPaymentChange}
                      min="0"
                      className="input input-bordered w-full bg-white border-gray-200 focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label cursor-pointer">
                      <span className="label-text text-gray-700">Paid</span>
                      <input
                        disabled={readonly}
                        type="checkbox"
                        name="paid"
                        checked={newPayment.paid}
                        onChange={handleNewPaymentChange as any}
                        className="checkbox checkbox-primary"
                      />
                    </label>
                  </div>

                  <div className="md:col-span-3 flex justify-end items-end">
                    <button
                      type="button"
                      className="btn enabled:bg-gradient-to-r from-primary to-secondary disabled:bg-gray-200
                      hover:from-primary/90 hover:to-secondary/90 text-white border-0"
                      onClick={addPayment}
                      disabled={
                        !newPayment.description || newPayment.price <= 0
                      }
                    >
                      {editingPayment ? "Update Payment" : "Add Payment"}
                    </button>
                  </div>
                </div>
              )}

              {/* Payment List */}
              {formData && formData.payments.length > 0 ? (
                <div className="overflow-x-auto border border-gray-100 rounded-lg">
                  <table className="table table-compact w-full">
                    <thead className="bg-gray-50 text-gray-700">
                      <tr>
                        <th className="font-medium">Date</th>
                        <th className="font-medium">Description</th>
                        <th className="font-medium">Amount</th>
                        <th className="font-medium">Status</th>
                        {!readonly && <th className="font-medium">Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {formData.payments.map((payment) => (
                        <tr
                          key={payment.id}
                          className={
                            payment.paid ? "bg-green-50" : "hover:bg-gray-50"
                          }
                        >
                          <td>{new Date(payment.date).toLocaleDateString()}</td>
                          <td>{payment.description}</td>
                          <td>{payment.price}</td>
                          <td>
                            <div className="flex items-center gap-2">
                              <div
                                className={`btn btn-xs ${
                                  payment.paid
                                    ? "bg-green-100 hover:bg-green-200 text-green-700 border-0"
                                    : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-0"
                                }`}
                              >
                                {payment.paid ? (
                                  <>
                                    <Check className="h-3 w-3 mr-1" /> Paid
                                  </>
                                ) : (
                                  "Unpaid"
                                )}
                              </div>
                            </div>
                          </td>
                          {!readonly && (
                            <td className="flex items-center gap-1">
                              <button
                                className="btn btn-xs bg-blue-50 hover:bg-blue-100 text-blue-600 border-0"
                                onClick={() => editPayment(payment)}
                              >
                                <Edit className="h-3 w-3" />
                              </button>
                              <button
                                className="btn btn-xs bg-red-50 hover:bg-red-100 text-red-500 border-0"
                                onClick={() => deletePayment(payment.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg border border-gray-100">
                  No payments added yet
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
