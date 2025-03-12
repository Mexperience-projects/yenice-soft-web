"use client";

import { useServices_10cd39 } from "@/hooks/services/10cd39";
import type { ServicesType, PersonelType, ItemsType } from "@/lib/types";
import { useTranslation } from "react-i18next";
import { Modal } from "@/components/ui/modal";
import { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  DollarSign,
  Users,
  Package,
  FileText,
  Tag,
  Check,
  ChevronDown,
  Search,
} from "lucide-react";

interface ModalProps {
  onClose: () => void;
  isOpen: boolean;
  selectedService?: ServicesType;
  personnel: PersonelType[];
  items: ItemsType[];
}

export default function ServiceModal({
  isOpen,
  onClose,
  selectedService,
  personnel = [],
  items = [],
}: ModalProps) {
  const { create_services_data, update_services_data } = useServices_10cd39();
  const { t } = useTranslation();
  const [selectedPersonnel, setSelectedPersonnel] = useState<number[]>([]);
  const [serviceItems, setServiceItems] = useState<
    { itemId: number; count: number }[]
  >([]);
  const [isPersonnelDropdownOpen, setIsPersonnelDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedService) {
      // setSelectedPersonnel(selectedService.personel.map((p) => p.id))
      // setServiceItems(
      //   selectedService.items.map((item) => ({
      //     itemId: item.item[0],
      //     count: item.count,
      //   })),
      // )
    } else {
      setSelectedPersonnel([]);
      setServiceItems([]);
    }
  }, [selectedService]);

  useEffect(() => {
    if (!isPersonnelDropdownOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsPersonnelDropdownOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isPersonnelDropdownOpen]);

  const addServiceItem = () => {
    setServiceItems([...serviceItems, { itemId: 0, count: 1 }]);
  };

  const removeServiceItem = (index: number) => {
    const newItems = [...serviceItems];
    newItems.splice(index, 1);
    setServiceItems(newItems);
  };

  const updateServiceItem = (index: number, itemId: number, count: number) => {
    const newItems = [...serviceItems];
    newItems[index] = { itemId, count };
    setServiceItems(newItems);
  };

  const togglePersonnel = (id: number) => {
    if (selectedPersonnel.includes(id)) {
      setSelectedPersonnel(
        selectedPersonnel.filter((personId) => personId !== id)
      );
    } else {
      setSelectedPersonnel([...selectedPersonnel, id]);
    }
  };

  const getSelectedPersonnelNames = () => {
    if (selectedPersonnel.length === 0)
      return t("services.noPersonnelSelected");

    const names = selectedPersonnel
      .map((id) => {
        const person = personnel.find((p) => p.id === id);
        return person?.name;
      })
      .filter(Boolean);

    if (names.length <= 2) return names.join(", ");
    return `${names.length} ${t("services.personnelSelected")}`;
  };

  const filteredPersonnel = personnel.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (person.description &&
        person.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-8 bg-gradient-to-br from-base-100 to-base-200 rounded-xl shadow-xl max-w-5xl mx-auto">
        <h3 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
          <div className="w-1.5 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></div>
          {selectedService === undefined
            ? t("services.addNewService")
            : t("services.editService")}
        </h3>

        <form
          action={(formData) => {
            selectedPersonnel.forEach((id, index) => {
              formData.append(`personel[${index}]`, id.toString());
            });

            serviceItems.forEach((item, index) => {
              formData.append(`items[${index}][item]`, item.itemId.toString());
              formData.append(`items[${index}][count]`, item.count.toString());
            });

            if (selectedService) update_services_data(formData);
            else create_services_data(formData);
            onClose();
          }}
        >
          <input type="hidden" name="id" value={selectedService?.id} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Basic Information */}
            <div className="space-y-6">
              <div className="card bg-base-100 shadow-lg rounded-xl overflow-hidden border border-base-300/30">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300/30">
                  <h3 className="font-semibold flex items-center text-base">
                    <Tag className="h-4 w-4 mr-2 text-primary" />
                    {t("services.basicInfo")}
                  </h3>
                </div>
                <div className="p-6">
                  {/* Service Name */}
                  <div className="form-control mb-5">
                    <label className="label">
                      <span className="label-text font-medium text-sm">
                        {t("services.name")}
                      </span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={selectedService?.name}
                      placeholder={t("services.namePlaceholder")}
                      className="input input-bordered w-full focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      required
                    />
                  </div>

                  {/* Price */}
                  <div className="form-control mb-5">
                    <label className="label">
                      <span className="label-text font-medium text-sm">
                        {t("services.price")}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        name="price"
                        defaultValue={selectedService?.price}
                        placeholder="0.00"
                        className="input input-bordered w-full pl-8 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        min="0"
                        step="0.01"
                        required
                      />
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 bg-base-200 rounded-full p-0.5">
                        <DollarSign className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium text-sm">
                        {t("services.description")}
                      </span>
                    </label>
                    <div className="relative">
                      <textarea
                        name="description"
                        defaultValue={selectedService?.description}
                        placeholder={t("services.descriptionPlaceholder")}
                        className="textarea textarea-bordered h-32 w-full focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                      <div className="absolute top-3 right-3 text-gray-400 bg-base-200 rounded-full p-1.5">
                        <FileText className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personnel Selection - Dropdown with Checkboxes */}
              <div className="card bg-base-100 shadow-lg rounded-xl overflow-hidden border border-base-300/30">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300/30">
                  <h3 className="font-semibold flex items-center text-base">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    {t("services.personnel")}
                  </h3>
                </div>
                <div className="p-6">
                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      className={`input input-bordered w-full flex items-center justify-between text-left transition-all ${
                        isPersonnelDropdownOpen
                          ? "border-primary ring-2 ring-primary/20"
                          : ""
                      }`}
                      onClick={() =>
                        setIsPersonnelDropdownOpen(!isPersonnelDropdownOpen)
                      }
                    >
                      <span
                        className={
                          selectedPersonnel.length === 0 ? "text-gray-500" : ""
                        }
                      >
                        {getSelectedPersonnelNames()}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                          isPersonnelDropdownOpen ? "transform rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isPersonnelDropdownOpen && (
                      <div
                        className="fixed inset-0 z-[60]"
                        onClick={() => setIsPersonnelDropdownOpen(false)}
                      >
                        <div
                          className="absolute z-[70]"
                          style={{
                            top:
                              dropdownRef.current?.getBoundingClientRect()
                                .bottom + "px",
                            left:
                              dropdownRef.current?.getBoundingClientRect()
                                .left + "px",
                            width: dropdownRef.current?.offsetWidth + "px",
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="bg-base-100 border border-base-300 rounded-lg shadow-xl max-h-60 overflow-auto animate-in fade-in-0 zoom-in-95 duration-100 w-full">
                            <div className="p-3 sticky top-0 bg-base-100 border-b border-base-300 z-10">
                              <div className="relative">
                                <input
                                  type="text"
                                  placeholder={t("services.searchPersonnel")}
                                  className="input input-sm input-bordered w-full pl-8"
                                  value={searchTerm}
                                  onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                  }
                                />
                                <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                              </div>
                            </div>

                            {filteredPersonnel.length > 0 ? (
                              <ul className="py-1">
                                {filteredPersonnel.map((person) => (
                                  <li key={person.id}>
                                    <button
                                      type="button"
                                      className="w-full px-3 py-2 text-left hover:bg-base-200 flex items-center justify-between transition-colors"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        togglePersonnel(person.id);
                                      }}
                                    >
                                      <div className="flex items-center">
                                        <div
                                          className={`w-5 h-5 rounded-md flex items-center justify-center mr-2 transition-all ${
                                            selectedPersonnel.includes(
                                              person.id
                                            )
                                              ? "bg-primary border-primary"
                                              : "border border-gray-400"
                                          }`}
                                        >
                                          {selectedPersonnel.includes(
                                            person.id
                                          ) && (
                                            <Check className="h-3 w-3 text-white" />
                                          )}
                                        </div>
                                        <div>
                                          <div className="font-medium">
                                            {person.name}
                                          </div>
                                          {person.description && (
                                            <div className="text-xs text-gray-500">
                                              {person.description}
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="p-3 text-center text-gray-500 text-sm">
                                {searchTerm
                                  ? t("services.noPersonnelFound")
                                  : t("services.noPersonnelAvailable")}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {selectedPersonnel.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {selectedPersonnel.map((id) => {
                        const person = personnel.find((p) => p.id === id);
                        if (!person) return null;

                        return (
                          <div
                            key={id}
                            className="badge badge-primary badge-lg gap-1 p-3 bg-primary/10 text-primary border-primary/20"
                          >
                            {person.name}
                            <button
                              type="button"
                              className="ml-1 hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                              onClick={() => togglePersonnel(id)}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Service Items */}
            <div className="card bg-base-100 shadow-lg rounded-xl overflow-hidden border border-base-300/30 h-fit">
              <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300/30">
                <h3 className="font-semibold flex items-center text-base">
                  <Package className="h-4 w-4 mr-2 text-primary" />
                  {t("services.items")}
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {serviceItems.length > 0 ? (
                    serviceItems.map((serviceItem, index) => (
                      <div
                        key={index}
                        className="bg-base-200/50 p-4 rounded-xl grid grid-cols-12 gap-3 items-center border border-base-300/50 hover:shadow-md transition-all"
                      >
                        <div className="col-span-7">
                          <label className="label p-0 mb-1">
                            <span className="label-text text-xs font-medium">
                              {t("services.item")}
                            </span>
                          </label>
                          <select
                            className="select select-bordered w-full text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            value={serviceItem.itemId}
                            onChange={(e) =>
                              updateServiceItem(
                                index,
                                Number.parseInt(e.target.value),
                                serviceItem.count
                              )
                            }
                          >
                            <option value="0" disabled>
                              {t("services.selectItem")}
                            </option>
                            {items.map((item) => (
                              <option key={item.id} value={item.id}>
                                {item.name} (${item.price})
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-span-3">
                          <label className="label p-0 mb-1">
                            <span className="label-text text-xs font-medium">
                              {t("services.count")}
                            </span>
                          </label>
                          <input
                            type="number"
                            className="input input-bordered w-full text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                            min="1"
                            value={serviceItem.count}
                            onChange={(e) =>
                              updateServiceItem(
                                index,
                                serviceItem.itemId,
                                Number.parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="col-span-2 self-end">
                          <button
                            type="button"
                            className="btn btn-circle btn-sm btn-error btn-outline hover:bg-error hover:text-white transition-colors"
                            onClick={() => removeServiceItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="bg-base-200/50 rounded-xl p-8 text-center border border-dashed border-base-300">
                      <Package className="h-12 w-12 mx-auto mb-3 text-gray-400" />
                      <p className="text-gray-500 text-sm mb-2">
                        {t("services.noItemsAdded")}
                      </p>
                      <p className="text-xs text-gray-400">
                        {t("services.clickBelowToAddItems")}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-outline btn-primary w-full group hover:bg-primary hover:text-white transition-all duration-300"
                    onClick={addServiceItem}
                  >
                    <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                    {t("services.addItem")}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8">
            <button
              type="button"
              className="btn btn-ghost hover:bg-base-300 transition-colors"
              onClick={onClose}
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="btn bg-gradient-to-r from-primary to-secondary text-white hover:from-primary/90 hover:to-secondary/90 border-none shadow-md hover:shadow-lg transition-all"
            >
              {selectedService === undefined
                ? t("services.createService")
                : t("services.updateService")}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
