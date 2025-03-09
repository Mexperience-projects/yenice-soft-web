"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePersonel_e02ed2 } from "@/hooks/personel/e02ed2";
import Personel_e02ed2_create from "@/components/personel/e02ed2_create";
import {
  Plus,
  Users,
  RefreshCw,
  Edit,
  Trash,
  Phone,
  Mail,
  Calendar,
  Menu,
  Search,
} from "lucide-react";
import type { PersonelType } from "@/lib/types";

export default function PersonnelPage() {
  const {
    get_personel_list_list,
    create_personel_data,
    update_personel_data,
    personel_list,
  } = usePersonel_e02ed2();

  const [activeTab, setActiveTab] = useState<"create" | "update" | "list">(
    "list"
  );
  const [selectedPersonnel, setSelectedPersonnel] =
    useState<PersonelType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    get_personel_list_list();
  }, []);

  const openModal = (): void => {
    setIsModalOpen(true);
    const modal = document.getElementById(
      "personnel_modal"
    ) as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
    const modal = document.getElementById(
      "personnel_modal"
    ) as HTMLDialogElement | null;
    if (modal) modal.close();
  };

  const handlePersonnelSelect = (personnel: PersonelType): void => {
    setSelectedPersonnel(personnel);
    setActiveTab("update");
  };

  const handleUpdateSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await update_personel_data(new FormData(e.currentTarget));
    setActiveTab("list");
  };

  const handleDeletePersonnel = async (id: string): Promise<void> => {
    if (window.confirm("Are you sure you want to delete this personnel?")) {
      // await delete_personel_data({ id });
      setActiveTab("list");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      <div className="mx-auto p-2 md:p-4 container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-500">
                Total Visits
              </h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-blue-600">
                  {personel_list.length}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Active visit records</p>
            </div>
            <div className="flex items-center justify-center bg-blue-100 rounded-full p-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div>
              <div className="text-gray-600 text-sm">Last Updated</div>
              <div className="text-teal-500 text-4xl font-bold">Just now</div>
              <div className="text-gray-500 text-xs">
                Services data is up to date
              </div>
            </div>
            <button className="bg-teal-100 p-3 rounded-full text-teal-500 hover:bg-teal-200 transition-colors">
              <RefreshCw className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-base-100 rounded-lg shadow-md p-3 md:p-4">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">
              Personnel List
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden md:inline">
                View:
              </span>
              <button
                onClick={() => {
                  setActiveTab("create");
                  openModal();
                }}
                className="btn btn-primary btn-sm gap-1"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden md:inline">Add New</span>
              </button>
            </div>
          </div>

          {/* Desktop Table - Hidden on small screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {personel_list.map((personnel, i) => (
                  <tr key={i} className="hover">
                    <td className="font-medium">{personnel.name}</td>
                    <td>{personnel.description}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => {
                            // handlePersonnelSelect(personnel);
                            openModal();
                          }}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </button>
                        <button
                          className="btn btn-error btn-xs"
                          // onClick={() => handleDeletePersonnel(personnel.id)}
                        >
                          <Trash className="h-3 w-3 mr-1" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Table Alternative - Visible only on small screens */}
          <div className="md:hidden">
            {personel_list.map((personnel, i) => (
              <div
                key={i}
                className="card bg-base-100 border border-base-300 mb-3"
              >
                <div className="card-body p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-primary">
                        {personnel.name}
                      </h3>
                    </div>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-xs">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          className="inline-block w-5 h-5 stroke-current"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                          ></path>
                        </svg>
                      </label>
                      <ul
                        tabIndex={0}
                        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                      >
                        <li>
                          <a
                            onClick={() => {
                              // handlePersonnelSelect(personnel);
                              openModal();
                            }}
                          >
                            <Edit className="h-4 w-4" /> Edit
                          </a>
                        </li>
                        <li>
                          <a
                            // onClick={() => handleDeletePersonnel(personnel)}
                            className="text-error"
                          >
                            <Trash className="h-4 w-4" /> Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="divider my-1"></div>
                  <p>{personnel.description}</p>
                </div>
              </div>
            ))}
          </div>

          {personel_list.length === 0 && (
            <div className="alert alert-info mt-4">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current flex-shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
                <span>
                  No personnel records found. Add your first personnel record!
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-6 right-6">
          <button
            onClick={() => {
              setActiveTab("create");
              openModal();
            }}
            className="btn btn-primary btn-circle btn-lg shadow-lg"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>

        <dialog id="personnel_modal" className="modal">
          <div className="modal-box max-w-4xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>

            <h3 className="font-bold text-xl mb-6 text-primary">
              {activeTab === "create" && "Add New Personnel"}
            </h3>

            {activeTab === "list" && (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                </table>

                {personel_list.length === 0 && (
                  <div className="alert alert-info">
                    <div>
                      <span>
                        No personnel records found. Add your first personnel
                        record!
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "create" && (
              <div className="bg-base-100 rounded-lg">
                <form action={create_personel_data} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Full Name</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter full name"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>

                    <div className="form-control w-full">
                      <label className="label">
                        <span className="label-text">Description</span>
                      </label>
                      <input
                        type="text"
                        name="description"
                        placeholder="Enter position"
                        className="input input-bordered w-full"
                        required
                      />
                    </div>
                  </div>
                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setActiveTab("list")}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      onClick={closeModal}
                      className="btn btn-primary"
                    >
                      Save Personnel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}
