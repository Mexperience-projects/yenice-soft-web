"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { DollarSign, Search, Check, Plus, Minus } from "lucide-react";
import type { ItemsType, ServicesType } from "@/lib/types";
import { usePersonel_e02ed2 } from "@/hooks/personel/e02ed2";
import { useAppDispatch } from "@/store/HOCs";
import { useTranslation } from "react-i18next";
import { useItems_691d50 } from "@/hooks/items/691d50";

interface ServicesProps {
  initialData?: ServicesType;
  onSubmit?: (data: any) => void;
}

export default function ServicesUpdateForm({
  initialData,
  onSubmit,
}: ServicesProps) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  // State for form data
  const [formData, setFormData] = useState<{
    name: string;
    price: number;
    description: string;
    personel_id: number | null;
    personel_fixed_fee: number;
    personel_precent_fee: number;
    items: Array<{
      id: number;
      count: number;
      visit: number;
      item: ItemsType;
    }>;
  }>({
    name: initialData?.name || "",
    price: initialData?.price || 0,
    description: initialData?.description || "",
    personel_id: initialData?.personel?.id || null,
    personel_fixed_fee: initialData?.personel_fixed_fee || 0,
    personel_precent_fee: initialData?.personel_precent_fee || 0,
    items: initialData?.items ? [] : [], // We'll populate this with actual item objects
  });

  // Personnel selection state
  const [selectedPersonnel, setSelectedPersonnel] = useState<number | null>(
    initialData?.personel?.id || null
  );
  const [personnelSearch, setPersonnelSearch] = useState("");
  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false);
  const personnelDropdownRef = useRef<HTMLDivElement>(null);
  const { personel_list } = usePersonel_e02ed2();

  // Item selection state
  const [showItemModal, setShowItemModal] = useState(false);
  const [itemSearch, setItemSearch] = useState("");
  const { items_list, get_items_list_list } = useItems_691d50();
  const itemModalRef = useRef<HTMLDivElement>(null);

  // Fetch items on component mount
  useEffect(() => {
    get_items_list_list();
  }, []);

  // Update formData when selectedPersonnel changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      personel_id: selectedPersonnel,
    }));
  }, [selectedPersonnel]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        personnelDropdownRef.current &&
        !personnelDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPersonnelDropdown(false);
      }

      if (
        itemModalRef.current &&
        !itemModalRef.current.contains(event.target as Node) &&
        showItemModal
      ) {
        // Don't close the modal when clicking outside, only with the buttons
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showItemModal]);

  const handlePersonnelSelect = (personnelId: number) => {
    setSelectedPersonnel(personnelId);
    setShowPersonnelDropdown(false);
  };

  const filteredPersonnel = personel_list.filter((person) =>
    person.name.toLowerCase().includes(personnelSearch.toLowerCase())
  );

  // Get personnel name for display
  const getSelectedPersonnelName = () => {
    if (!selectedPersonnel) return "";
    const person = personel_list.find((p) => p.id === selectedPersonnel);
    return person
      ? person.name
      : `${t("personnel.title")} ${selectedPersonnel}`;
  };

  // Filter items based on search
  const filteredItems = items_list.filter((item) =>
    item.name.toLowerCase().includes(itemSearch.toLowerCase())
  );

  // Check if an item is selected
  const isItemSelected = (itemId: number) => {
    return formData.items.some((item) => item.item.id === itemId);
  };

  // Handle item selection
  const handleItemSelect = (item: ItemsType) => {
    setFormData((prev) => {
      // Check if item is already selected
      const existingItemIndex = prev.items.findIndex(
        (i) => i.item.id === item.id
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
              id: Date.now(), // Use timestamp as temporary ID
              count: 1,
              visit: -1, // Placeholder value
              item: item,
            },
          ],
        };
      }
    });
  };

  // Update item quantity
  const updateItemQuantity = (itemId: number, increment: boolean) => {
    setFormData((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.item.id === itemId) {
          return {
            ...item,
            count: increment ? item.count + 1 : Math.max(1, item.count - 1),
          };
        }
        return item;
      });
      return { ...prev, items: updatedItems };
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Get form values
    const form = e.target as HTMLFormElement;
    const formValues = {
      name: form.name.valueOf,
      price: Number.parseFloat(form.price.value),
      description: form.description.value,
      personel_id: selectedPersonnel,
      personel_fixed_fee: Number.parseFloat(form.personel_fixed_fee.value),
      // Include selected items
      items: formData.items.map((item) => ({
        id: item.item.id,
        count: item.count,
      })),
    };

    // If no items are selected, send an empty array
    if (formValues.items.length === 0) {
      formValues.items = [];
    }

    // Call onSubmit prop if provided
    if (onSubmit) {
      onSubmit(formValues);
    }

    // You can also dispatch an action here if needed
    console.log("Form submitted with data:", formValues);
  };

  return (
    <div className="card bg-base-100">
      <div className="card-body">
        <h2 className="card-title text-lg font-bold mb-4">
          {initialData
            ? t("services.editService")
            : t("services.addNewService")}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">{t("common.name")}</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder={t("services.serviceName")}
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">{t("common.price")}</span>
              </label>
              <label className="input-group">
                <span>
                  <DollarSign className="h-4 w-4" />
                </span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number.parseFloat(e.target.value),
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="0.00"
                />
              </label>
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">{t("common.description")}</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="textarea textarea-bordered w-full"
              placeholder={t("services.serviceDescription")}
            />
          </div>

          <div className="form-control w-full" ref={personnelDropdownRef}>
            <label className="label">
              <span className="label-text">{t("personnel.title")}</span>
            </label>
            <div className="relative w-full">
              <div
                className="input input-bordered flex justify-between items-center cursor-pointer w-full"
                onClick={() => setShowPersonnelDropdown(true)}
              >
                <span className="text-sm">
                  {selectedPersonnel
                    ? getSelectedPersonnelName()
                    : t("services.selectPersonnel")}
                </span>
                <Search className="h-4 w-4 opacity-50" />
              </div>

              {showPersonnelDropdown && (
                <div className="absolute z-30 bg-base-100 shadow-lg rounded-box w-full mt-1">
                  <div className="p-2">
                    <div className="flex items-center border-b border-base-300 pb-2">
                      <Search className="h-4 w-4 mr-2 opacity-50" />
                      <input
                        type="text"
                        placeholder={t("services.searchPersonnel")}
                        className="input input-sm input-ghost w-full focus:outline-none"
                        value={personnelSearch}
                        onChange={(e) => setPersonnelSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className="menu menu-compact py-2 max-h-60 overflow-y-auto">
                      {filteredPersonnel.length === 0 ? (
                        <li className="disabled text-center py-2 text-sm opacity-50">
                          {t("services.noPersonnelFound")}
                        </li>
                      ) : (
                        filteredPersonnel.map((person) => (
                          <li key={person.id}>
                            <a
                              className={`flex items-center ${
                                selectedPersonnel === person.id ? "active" : ""
                              }`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handlePersonnelSelect(person.id);
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span>{person.name}</span>
                                {selectedPersonnel === person.id && (
                                  <Check className="h-4 w-4" />
                                )}
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

            {/* Hidden input to store selected personnel ID */}
            <input
              type="hidden"
              name="personel_id"
              value={selectedPersonnel || undefined}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">
                  {t("services.personnelExpense")}
                </span>
              </label>
              <label className="input-group">
                <span>
                  <DollarSign className="h-4 w-4" />
                </span>
                <input
                  id="personel_fixed_fee"
                  name="personel_fixed_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.personel_fixed_fee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      personel_fixed_fee: Number.parseFloat(e.target.value),
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="0.00"
                />
              </label>
            </div>
          </div>

          {/* Item Selection Section */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">{t("inventory.selectItems")}</span>
            </label>
            <button
              type="button"
              className="btn btn-outline w-full justify-between"
              onClick={() => setShowItemModal(true)}
            >
              <span>
                {formData.items.length > 0
                  ? `${formData.items.length} ${t("inventory.itemsSelected", {
                      count: formData.items.length,
                    })}`
                  : t("inventory.selectItems")}
              </span>
              <Search className="h-4 w-4 opacity-50" />
            </button>
          </div>

          {/* Selected Items Preview */}
          {formData.items.length > 0 && (
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="font-medium mb-2">
                {t("inventory.selectedItems")}
              </h3>
              <ul className="space-y-2">
                {formData.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex justify-between items-center"
                  >
                    <span>{item.item.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        ${item.item.price} × {item.count} = $
                        {(item.item.price * item.count).toFixed(2)}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end mt-6">
            <button type="submit" className="btn btn-primary">
              {initialData ? t("common.update") : t("common.create")}
            </button>
          </div>
        </div>
      </div>

      {/* Item Selection Modal */}
      {showItemModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl" ref={itemModalRef}>
            <h3 className="font-bold text-lg mb-4">
              {t("inventory.selectItems")}
            </h3>

            {/* Search bar */}
            <div className="form-control mb-4">
              <div className="input-group">
                <input
                  type="text"
                  placeholder={t("inventory.searchItems")}
                  className="input input-bordered w-full"
                  value={itemSearch}
                  onChange={(e) => setItemSearch(e.target.value)}
                />
                <button type="button" className="btn btn-square">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Items list */}
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="w-16">{t("common.select")}</th>
                    <th>{t("inventory.itemName")}</th>
                    <th>{t("inventory.itemPrice")}</th>
                    <th className="text-right">
                      {t("inventory.currentStock")}
                    </th>
                    <th className="text-right">
                      {t("inventory.orderQuantity")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">
                        {t("inventory.noItemsFound")}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item) => {
                      const isSelected = isItemSelected(item.id);
                      const selectedItem = formData.items.find(
                        (i) => i.item.id === item.id
                      );

                      return (
                        <tr
                          key={item.id}
                          className={isSelected ? "bg-primary/5" : ""}
                        >
                          <td>
                            <input
                              type="checkbox"
                              className="checkbox checkbox-primary"
                              checked={isSelected}
                              onChange={() => handleItemSelect(item)}
                            />
                          </td>
                          <td className="font-medium">{item.name}</td>
                          <td>${item.price}</td>
                          <td className="text-right">{item.count}</td>
                          <td>
                            {isSelected && selectedItem && (
                              <div className="flex items-center justify-end">
                                <button
                                  type="button"
                                  className="btn btn-xs btn-circle btn-ghost"
                                  onClick={() =>
                                    updateItemQuantity(item.id, false)
                                  }
                                  disabled={selectedItem.count <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </button>
                                <span className="mx-2 font-bold">
                                  {selectedItem.count}
                                </span>
                                <button
                                  type="button"
                                  className="btn btn-xs btn-circle btn-ghost"
                                  onClick={() =>
                                    updateItemQuantity(item.id, true)
                                  }
                                  disabled={selectedItem.count >= item.count}
                                >
                                  <Plus className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Selected items summary */}
            {formData.items.length > 0 && (
              <div className="mt-4 p-4 bg-base-200 rounded-lg">
                <h4 className="font-bold mb-2">
                  {t("inventory.selectedItems")} ({formData.items.length})
                </h4>
                <ul className="space-y-1">
                  {formData.items.map((selectedItem) => (
                    <li key={selectedItem.id} className="flex justify-between">
                      <span>
                        {selectedItem.item.name} × {selectedItem.count}
                      </span>
                      <span>
                        $
                        {(selectedItem.item.price * selectedItem.count).toFixed(
                          2
                        )}
                      </span>
                    </li>
                  ))}
                  <li className="border-t border-base-300 pt-2 mt-2 font-bold flex justify-between">
                    <span>{t("common.total")}</span>
                    <span>
                      $
                      {formData.items
                        .reduce(
                          (total, item) => total + item.item.price * item.count,
                          0
                        )
                        .toFixed(2)}
                    </span>
                  </li>
                </ul>
              </div>
            )}

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setShowItemModal(false)}
              >
                {t("common.close")}
              </button>

              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setShowItemModal(false)}
              >
                {t("common.confirm")}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setShowItemModal(false)}
          ></div>
        </div>
      )}
    </div>
  );
}
