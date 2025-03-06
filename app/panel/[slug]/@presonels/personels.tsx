"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePersonel_e02ed2 } from "@/hooks/personel/e02ed2";
import Personel_e02ed2_create from "@/components/personel/e02ed2_create";
import Personel_e02ed2_update from "@/components/personel/e02ed2_update";
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
import type { PersonelType, } from "@/lib/types";

export default function PersonnelPage() {
  const {
    get_personel_list_list,
    create_personel_data,
    update_personel_data,
    delete_personel_data,
    personel_list,
  } = usePersonel_e02ed2();

  const [activeTab, setActiveTab] = useState<"create" | "update" | "list">("list");
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonelType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    get_personel_list_list();
  }, [get_personel_list_list]);

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

  const handleCreateSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    await create_personel_data(new FormData(e.currentTarget));
    setActiveTab("list");
    e.currentTarget.reset();
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

  const filteredPersonnel = personel_list.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-md sticky top-0 z-30">
        <div className="navbar-start">
          <div className="dropdown">
            <label
              tabIndex={0}
              className="btn btn-ghost lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </label>
            {isMobileMenuOpen && (
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
              >
                <li>
                  <a className="font-semibold">Dashboard</a>
                </li>
                <li>
                  <a>Personnel</a>
                </li>
                <li>
                  <a>Departments</a>
                </li>
                <li>
                  <a>Reports</a>
                </li>
              </ul>
            )}
          </div>
          <a className="btn btn-ghost normal-case text-xl">
            Personnel Management
          </a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <a className="font-semibold">Dashboard</a>
            </li>
            <li>
              <a>Personnel</a>
            </li>
            <li>
              <a>Departments</a>
            </li>
            <li>
              <a>Reports</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <button
            onClick={openModal}
            className="btn btn-primary btn-sm md:btn-md"
          >
            <Users className="h-4 w-4 md:mr-2" />
            <span className="hidden md:inline">Manage Personnel</span>
          </button>
        </div>
      </div>

      <div className="container mx-auto p-2 md:p-4">
        {/* Stats */}
        <div className="stats shadow w-full bg-base-100 mb-4 md:mb-6 flex-col md:flex-row">
          <div className="stat">
            <div className="stat-figure text-primary">
              <Users className="h-8 w-8" />
            </div>
            <div className="stat-title">Total Personnel</div>
            <div className="stat-value text-primary">
              {personel_list.length}
            </div>
            <div className="stat-desc">Active team members</div>
          </div>

          <div className="stat">
            <div className="stat-figure text-secondary">
              <RefreshCw className="h-8 w-8" />
            </div>
            <div className="stat-title">Last Updated</div>
            <div className="stat-value text-secondary">Just now</div>
            <div className="stat-desc">Personnel data is up to date</div>
          </div>
        </div>

        {/* Search and View Controls */}
        <div className="bg-base-100 rounded-lg shadow-md p-3 md:p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search personnel..."
                className="input input-bordered w-full pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
        </div>

        {/* Table View */}

        <div className="bg-base-100 rounded-lg shadow-md p-3 md:p-4">
          <h2 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">
            Personnel List
          </h2>

          {/* Desktop Table - Hidden on small screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPersonnel.map((personnel, i) => (
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
            {filteredPersonnel.map((personnel, i) => (
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
                            onClick={() =>
                                // handleDeletePersonnel(personnel.id)
                              }
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

          {filteredPersonnel.length === 0 && (
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
              {activeTab === "list" && "Personnel List"}
              {activeTab === "create" && "Add New Personnel"}
              {activeTab === "update" && "Edit Personnel"}
            </h3>

            <div className="tabs tabs-boxed mb-6">
              <a
                className={`tab ${activeTab === "list" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("list")}
              >
                List
              </a>
              <a
                className={`tab ${activeTab === "create" ? "tab-active" : ""}`}
                onClick={() => setActiveTab("create")}
              >
                Add New
              </a>
              {selectedPersonnel && (
                <a
                  className={`tab ${activeTab === "update" ? "tab-active" : ""
                    }`}
                  onClick={() => setActiveTab("update")}
                >
                  Edit
                </a>
              )}
            </div>

            {activeTab === "list" && (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Position</th>
                      <th>Department</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {personel_list.map((personnel, i) => (
                      <tr key={i} className="hover">
                        <td>{personnel.name}</td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-primary btn-xs"
                            // onClick={() => handlePersonnelSelect(personnel)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-error btn-xs"
                              onClick={() => { }
                                // handleDeletePersonnel(personnel.id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
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
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <Personel_e02ed2_create />
                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setActiveTab("list")}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save Personnel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "update" && selectedPersonnel && (
              <div className="bg-base-100 rounded-lg">
                <form onSubmit={handleUpdateSubmit} className="space-y-4">
                  {/* <input type="hidden" name="id" value={selectedPersonnel.id} /> */}
                  <Personel_e02ed2_update data={selectedPersonnel} />
                  <div className="modal-action">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => setActiveTab("list")}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Personnel
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
