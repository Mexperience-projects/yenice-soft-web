"use client";

import { useState, useEffect, useRef } from "react";
import { DollarSign, Percent, Search, Check } from "lucide-react";
import type { ServicesType } from "@/lib/types";
import {
  personel_e02ed2Type,
  usePersonel_e02ed2,
} from "@/hooks/personel/e02ed2";
import { useAppDispatch } from "@/store/HOCs";

// Mock data for personnel - replace with actual API call

interface ServicesProps {
  initialData?: ServicesType;
}

export default function ServicesUpdateForm({ initialData }: ServicesProps) {
  const [selectedPersonnel, setSelectedPersonnel] = useState<number | null>(
    null
  );
  const [personnelSearch, setPersonnelSearch] = useState("");
  const [showPersonnelDropdown, setShowPersonnelDropdown] = useState(false);
  const personnelDropdownRef = useRef<HTMLDivElement>(null);
  const { personel_list } = usePersonel_e02ed2();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        personnelDropdownRef.current &&
        !personnelDropdownRef.current.contains(event.target as Node)
      ) {
        setShowPersonnelDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
    return person ? person.name : `Personnel ${selectedPersonnel}`;
  };

  return (
    <div className="card bg-base-100 ">
      <div className="card-body">
        <h2 className="card-title text-lg font-bold mb-4">
          {initialData ? "Update Service" : "Create New Service"}
        </h2>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Name</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={initialData?.name}
                className="input input-bordered w-full"
                placeholder="Service name"
              />
            </div>

            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Price</span>
              </label>
              <label className="input-group">
                <span></span>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  defaultValue={initialData?.price}
                  className="input input-bordered w-full"
                  placeholder="0.00"
                />
              </label>
            </div>
          </div>

          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={initialData?.description}
              className="textarea textarea-bordered w-full"
              placeholder="Service description"
            />
          </div>

          <div className="form-control w-full" ref={personnelDropdownRef}>
            <label className="label">
              <span className="label-text">Personnel</span>
            </label>
            <div className="relative w-full">
              <div
                className="input input-bordered flex justify-between items-center cursor-pointer w-full"
                onClick={() => setShowPersonnelDropdown(true)}
              >
                <span className="text-sm">
                  {selectedPersonnel
                    ? getSelectedPersonnelName()
                    : "Select personnel"}
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
                        placeholder="Search personnel..."
                        className="input input-sm input-ghost w-full focus:outline-none"
                        value={personnelSearch}
                        onChange={(e) => setPersonnelSearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <ul className="menu menu-compact py-2 max-h-60 overflow-y-auto">
                      {filteredPersonnel.length === 0 ? (
                        <li className="disabled text-center py-2 text-sm opacity-50">
                          No personnel found
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

            {/* Hidden input to store selected personnel ID as an array */}
            <input
              type="hidden"
              name="personel"
              value={
                selectedPersonnel ? JSON.stringify([selectedPersonnel]) : "[]"
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">personnel Expense</span>
              </label>
              <label className="input-group">
                <span></span>
                <input
                  id="personel_fixed_fee"
                  name="personel_fixed_fee"
                  type="number"
                  step="0.01"
                  min="0"
                  defaultValue={initialData?.personel_fixed_fee}
                  className="input input-bordered w-full"
                  placeholder="0.00"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
