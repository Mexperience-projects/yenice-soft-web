"use client";

import { useEffect, useState } from "react";
import {
  Users,
  FileEdit,
  Trash2,
  Plus,
  Search,
  User,
  ChevronDown,
  Filter,
  Download,
  Eye,
} from "lucide-react";
import { useClients } from "@/hooks/clients/main";
import type { ClientType } from "@/lib/types";

export default function ClientManagement() {
  const { get_clients_list_list, create_clients_data, clients_list } =
    useClients();

  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState<number | "all">("all");
  const [currentTab, setCurrentTab] = useState("all");
  const [birthdate, setBirthdate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    get_clients_list_list();
  }, []);

  const handleUpdateSubmit = async (formData: FormData) => {
    if (selectedClient) {
      // await update_client_data(formData);
      setIsUpdateModalOpen(false);
      setSelectedClient(null);
      get_clients_list_list(); // Refresh the list
    }
  };

  const handleDeleteSubmit = async () => {
    if (selectedClient) {
      // await delete_client_data(selectedClient.id);
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
      get_clients_list_list(); // Refresh the list
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatBirthdate = (dateString: Date) => {
    const date = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();

    return `${formatDate(dateString)} (${age} years)`;
  };

  // Filter clients based on search term and gender filter
  const filteredClients = clients_list.filter((client: ClientType) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.nationalCo.includes(searchTerm);
    const matchesGender =
      filterGender === "all" || client.gender === filterGender;

    if (currentTab === "all") return matchesSearch && matchesGender;
    // Add more tab filters if needed

    return matchesSearch && matchesGender;
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-primary">Client Management</h1>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn btn-primary gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New Client
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Clients Card */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-sm font-medium text-base-content opacity-70">
                Total Clients
              </h2>
              <div className="flex items-center justify-between mt-2">
                <div className="text-3xl font-bold text-primary">
                  {clients_list.length}
                </div>
                <div className="p-2 bg-primary bg-opacity-20 rounded-full">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <p className="text-xs text-base-content opacity-70 mt-1">
                Active client records
              </p>
            </div>
          </div>

          {/* Male Clients Card */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-sm font-medium text-base-content opacity-70">
                Male Clients
              </h2>
              <div className="flex items-center justify-between mt-2">
                <div className="text-3xl font-bold text-info">
                  {
                    clients_list.filter(
                      (client: ClientType) => client.gender === 1
                    ).length
                  }
                </div>
                <div className="p-2 bg-info bg-opacity-20 rounded-full">
                  <User className="h-5 w-5 text-info" />
                </div>
              </div>
              <p className="text-xs text-base-content opacity-70 mt-1">
                Male client records
              </p>
            </div>
          </div>

          {/* Female Clients Card */}
          <div className="card bg-base-100 shadow-sm">
            <div className="card-body p-4">
              <h2 className="text-sm font-medium text-base-content opacity-70">
                Female Clients
              </h2>
              <div className="flex items-center justify-between mt-2">
                <div className="text-3xl font-bold text-secondary">
                  {
                    clients_list.filter(
                      (client: ClientType) => client.gender === 2
                    ).length
                  }
                </div>
                <div className="p-2 bg-secondary bg-opacity-20 rounded-full">
                  <User className="h-5 w-5 text-secondary" />
                </div>
              </div>
              <p className="text-xs text-base-content opacity-70 mt-1">
                Female client records
              </p>
            </div>
          </div>
        </div>

        {/* Client Records Card */}
        <div className="card bg-base-100 shadow-sm mb-6">
          <div className="card-body p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="card-title">Client Records</h2>
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="h-4 w-4 text-base-content opacity-70" />
                  </div>
                  <input
                    type="search"
                    placeholder="Search by name or ID..."
                    className="input input-bordered pl-10 w-full sm:w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Export Dropdown */}
                <div className="dropdown dropdown-end">
                  <div
                    tabIndex={0}
                    role="button"
                    className="btn btn-outline gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Export
                    <ChevronDown className="h-4 w-4" />
                  </div>
                  <ul
                    tabIndex={0}
                    className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
                  >
                    <li>
                      <a>Export as CSV</a>
                    </li>
                    <li>
                      <a>Export as PDF</a>
                    </li>
                    <li>
                      <a>Print List</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Client Table */}
            {currentTab === "all" && (
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>National ID</th>
                      <th>Birthdate</th>
                      <th>Gender</th>
                      <th className="text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredClients.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="text-center py-6 text-base-content opacity-70"
                        >
                          {searchTerm || filterGender !== "all"
                            ? "No clients match your search criteria."
                            : "No clients found. Add a new client to get started."}
                        </td>
                      </tr>
                    ) : (
                      filteredClients.map((client: ClientType) => (
                        <tr key={client.id}>
                          <td>{client.name}</td>
                          <td>{client.nationalCo}</td>
                          <td>{formatBirthdate(client.birthdate)}</td>
                          <td>
                            <div
                              className={`badge ${
                                client.gender === 1
                                  ? "badge-info"
                                  : "badge-secondary"
                              } badge-outline`}
                            >
                              {client.gender === 1 ? "Male" : "Female"}
                            </div>
                          </td>
                          <td className="text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                className="btn btn-ghost btn-sm btn-square"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setIsViewModalOpen(true);
                                }}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              <button
                                className="btn btn-ghost btn-sm btn-square"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setIsUpdateModalOpen(true);
                                }}
                                title="Edit Client"
                              >
                                <FileEdit className="h-4 w-4" />
                              </button>
                              <button
                                className="btn btn-ghost btn-sm btn-square text-error"
                                onClick={() => {
                                  setSelectedClient(client);
                                  setIsDeleteModalOpen(true);
                                }}
                                title="Delete Client"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {currentTab === "recent" && (
              <div className="py-8 text-center text-base-content opacity-70">
                Recent clients view coming soon
              </div>
            )}

            {currentTab === "active" && (
              <div className="py-8 text-center text-base-content opacity-70">
                Active clients view coming soon
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Client Modal */}
      <dialog className={`modal ${isCreateModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsCreateModalOpen(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Add New Client</h3>
          <p className="py-2 text-base-content opacity-70">
            Enter the client's information below to create a new record.
          </p>

          <form action={create_clients_data} className="mt-4">
            <ClientForm />
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Client
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsCreateModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Update Client Modal */}
      <dialog className={`modal ${isUpdateModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Update Client</h3>
          <p className="py-2 text-base-content opacity-70">
            Edit the client's information below.
          </p>

          <form action={handleUpdateSubmit} className="mt-4">
            {selectedClient && <ClientForm client={selectedClient} />}
            <div className="modal-action">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Client
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsUpdateModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* View Client Modal */}
      <dialog className={`modal ${isViewModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsViewModalOpen(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Client Details</h3>

          {selectedClient && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-base-content opacity-70">
                    Name
                  </h3>
                  <p>{selectedClient.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content opacity-70">
                    National ID
                  </h3>
                  <p>{selectedClient.nationalCo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content opacity-70">
                    Birthdate
                  </h3>
                  <p>{formatBirthdate(selectedClient.birthdate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-base-content opacity-70">
                    Gender
                  </h3>
                  <div
                    className={`badge ${
                      selectedClient.gender === 1
                        ? "badge-info"
                        : "badge-secondary"
                    } badge-outline`}
                  >
                    {selectedClient.gender === 1 ? "Male" : "Female"}
                  </div>
                </div>
              </div>

              <div className="divider"></div>

              <div>
                <h3 className="text-sm font-medium text-base-content opacity-70 mb-2">
                  Visit History
                </h3>
                <div className="bg-base-200 rounded-md p-4 text-center text-base-content opacity-70">
                  Visit history will be displayed here
                </div>
              </div>
            </div>
          )}

          <div className="modal-action">
            <button
              className="btn btn-outline"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsViewModalOpen(false);
                setIsUpdateModalOpen(true);
              }}
            >
              Edit Client
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsViewModalOpen(false)}>close</button>
        </form>
      </dialog>

      {/* Delete Client Modal */}
      <dialog className={`modal ${isDeleteModalOpen ? "modal-open" : ""}`}>
        <div className="modal-box">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg">Delete Client</h3>
          <p className="py-2 text-base-content opacity-70">
            Are you sure you want to delete this client? This action cannot be
            undone.
          </p>

          {selectedClient && (
            <div className="bg-base-200 p-4 rounded-md mt-2">
              <p>
                <span className="font-medium">Name:</span> {selectedClient.name}
              </p>
              <p>
                <span className="font-medium">National ID:</span>{" "}
                {selectedClient.nationalCo}
              </p>
            </div>
          )}

          <div className="modal-action">
            <button
              className="btn btn-outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </button>
            <button className="btn btn-error" onClick={handleDeleteSubmit}>
              Delete Client
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsDeleteModalOpen(false)}>close</button>
        </form>
      </dialog>
    </div>
  );
}

interface ClientFormProps {
  client?: ClientType;
}

function ClientForm({ client }: ClientFormProps = {}) {
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    client?.birthdate ? new Date(client.birthdate) : undefined
  );

  return (
    <div className="grid gap-4 py-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          type="text"
          name="name"
          defaultValue={client?.name || ""}
          placeholder="Enter client's full name"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">National ID</span>
        </label>
        <input
          type="text"
          name="nationalCo"
          defaultValue={client?.nationalCo || ""}
          placeholder="Enter national ID number"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Birthdate</span>
        </label>
        <input
          type="date"
          name="birthdate"
          defaultValue={
            client?.birthdate
              ? new Date(client.birthdate).toISOString().split("T")[0]
              : ""
          }
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Gender</span>
        </label>
        <div className="flex gap-4">
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="radio"
              name="gender"
              value="1"
              className="radio radio-primary"
              defaultChecked={!client || client.gender === 1}
            />
            <span className="label-text">Male</span>
          </label>
          <label className="label cursor-pointer justify-start gap-2">
            <input
              type="radio"
              name="gender"
              value="2"
              className="radio radio-secondary"
              defaultChecked={client?.gender === 2}
            />
            <span className="label-text">Female</span>
          </label>
        </div>
      </div>
    </div>
  );
}
