"use client";

import { useVisit_ae978b, type visit_ae978bType } from "@/hooks/visit/ae978b";
import Visit_ae978b_read from "@/components/visit/ae978b_read";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Visit_ae978b_create from "@/components/visit/ae978b_create";
import {
  Users,
  FileEdit,
  Trash2,
  RefreshCw,
  Plus,
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import ClientForm from "@/components/client/client-form";
import { useClients } from "@/hooks/clients/main";

export default function VisitManagement() {
  const {
    get_visit_list_list,
    create_visit_data,
    visit_list,
    delete_visit_data,
    update_visit_data,
  } = useVisit_ae978b();
  const { create_clients_data } = useClients();

  const [selectedVisit, setSelectedVisit] = useState<
    visit_ae978bType | undefined
  >();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isClientCreateModalOpen, setIsClientCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    get_visit_list_list();
  }, []);

  const handleDeleteSubmit = async (formData: FormData) => {
    if (selectedVisit) {
      delete_visit_data(selectedVisit.id);
      setIsDeleteModalOpen(false);
      setSelectedVisit(undefined);
      get_visit_list_list(); // Refresh the list
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Filter visits based on search term

  const handleCreateSubmit = async (formData: FormData) => {
    await create_visit_data(formData);
    setIsCreateModalOpen(false);
    get_visit_list_list();
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
            Visit Management
          </h1>
          <p className="text-gray-600 ml-5">
            Manage and track all client visits
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Total Visits
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-secondary">
                    {visit_list.length}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Active visit records
                </p>
              </div>
              <div className="flex items-center justify-center bg-secondary/10 rounded-full p-3">
                <Users className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Upcoming Visits
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-primary">
                    {
                      visit_list.filter(
                        (v) => new Date(v.datetime) > new Date()
                      ).length
                    }
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Scheduled for future dates
                </p>
              </div>
              <div className="flex items-center justify-center bg-primary/10 rounded-full p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  Last Updated
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-gray-700">Just now</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Visit data is up to date
                </p>
              </div>
              <button
                onClick={() => get_visit_list_list()}
                className="flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full p-3 hover:from-primary/20 hover:to-secondary/20 transition-all duration-300"
              >
                <RefreshCw className="h-6 w-6 text-secondary" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
                Visit Records
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                    placeholder="Search visits..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Visit</span>
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visit_list.length === 0 ? (
                  <tr className="bg-white">
                    <td colSpan={5} className="px-6 py-8 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="bg-gray-100 p-3 rounded-full mb-3">
                          <Calendar className="h-6 w-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">
                          No visits found
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {searchTerm
                            ? "Try a different search term"
                            : "Create a new visit to get started"}
                        </p>
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm("")}
                            className="mt-3 text-primary hover:text-primary/80 text-sm font-medium"
                          >
                            Clear search
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  visit_list.map((visit, index) => {
                    const visitDate = new Date(visit.datetime);
                    const isPast = visitDate < new Date();

                    return (
                      <tr
                        key={index}
                        className="bg-white border-b hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {visit.client.name}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {visit.service}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            {formatDate(visit.datetime)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isPast ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Completed
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Calendar className="h-3 w-3 mr-1" />
                              Scheduled
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => {
                                setSelectedVisit(visit);
                                setIsViewModalOpen(true);
                              }}
                              className="text-gray-600 hover:text-primary bg-gray-100 hover:bg-primary/10 p-2 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Users className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVisit(visit);
                                setIsUpdateModalOpen(true);
                              }}
                              className="text-gray-600 hover:text-secondary bg-gray-100 hover:bg-secondary/10 p-2 rounded-lg transition-colors"
                              title="Edit Visit"
                            >
                              <FileEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVisit(visit);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-gray-600 hover:text-red-500 bg-gray-100 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title="Delete Visit"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {visit_list.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing <span className="font-medium">{visit_list.length}</span>{" "}
                of <span className="font-medium">{visit_list.length}</span>{" "}
                visits
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200">
                  Previous
                </button>
                <button className="px-3 py-1 text-sm text-white bg-primary rounded-md hover:bg-primary/90">
                  1
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Visit Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
            Visit Details
          </h2>
          {selectedVisit && <Visit_ae978b_read data={selectedVisit} />}
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Create/Update Visit Modal */}
      <Modal
        isOpen={isCreateModalOpen || isUpdateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsUpdateModalOpen(false);
          setSelectedVisit(undefined);
        }}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
            {isUpdateModalOpen ? "Update Visit" : "Create New Visit"}
          </h2>
          <form
            action={
              isUpdateModalOpen && selectedVisit
                ? update_visit_data
                : handleCreateSubmit
            }
          >
            {selectedVisit && (
              <input name="id" type="hidden" value={selectedVisit.id} />
            )}
            <Visit_ae978b_create
              openNewClient={() => setIsClientCreateModalOpen(true)}
            />
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setIsUpdateModalOpen(false);
                  setSelectedVisit(undefined);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              >
                {isUpdateModalOpen ? "Update Visit" : "Create Visit"}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Visit Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedVisit(undefined);
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-500">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2 text-gray-800 text-center">
            Delete Visit
          </h2>
          <p className="text-gray-600 text-center mb-6">
            Are you sure you want to delete this visit? This action cannot be
            undone.
          </p>
          <form action={handleDeleteSubmit}>
            <div className="flex justify-center gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedVisit(undefined);
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                Delete Visit
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Create Client Modal */}
      <dialog
        className={`modal ${isClientCreateModalOpen ? "modal-open" : ""}`}
      >
        <div className="modal-box max-w-2xl bg-white rounded-xl shadow-lg">
          <form method="dialog">
            <button
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => setIsClientCreateModalOpen(false)}
            >
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-gray-800 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
            Add New Client
          </h3>
          <p className="py-2 text-gray-600">
            Enter the client's information below to create a new record.
          </p>

          <form
            action={(form_) => {
              create_clients_data(form_);
              setIsClientCreateModalOpen(false);
            }}
            className="mt-4"
          >
            <ClientForm />
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
                onClick={() => setIsClientCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              >
                Create Client
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button onClick={() => setIsClientCreateModalOpen(false)}>
            close
          </button>
        </form>
      </dialog>
    </div>
  );
}
