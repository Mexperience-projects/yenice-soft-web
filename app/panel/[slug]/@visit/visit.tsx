"use client";

import { useVisit_ae978b, type visit_ae978bType } from "@/hooks/visit/ae978b";
import Visit_ae978b_read from "@/components/visit/ae978b_read";
import { useEffect, useState } from "react";
import Visit_6b7e2d_update from "@/components/visit/6b7e2d_update";
import { Modal } from "@/components/ui/modal";
import Visit_ae978b_create from "@/components/visit/ae978b_create";
import { PlusCircle, Users, FileEdit, Trash2, RefreshCw } from "lucide-react";

export default function VisitManagement() {
  const { get_visit_list_list, create_visit_data, visit_list } =
    useVisit_ae978b();

  const [selectedVisit, setSelectedVisit] = useState<
    visit_ae978bType | undefined
  >();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    get_visit_list_list();
  }, []);

  const handleCreateSubmit = async (formData: FormData) => {
    await create_visit_data(formData);
    setIsCreateModalOpen(false);
    get_visit_list_list(); // Refresh the list
  };

  const handleUpdateSubmit = async (formData: FormData) => {
    if (selectedVisit) {
      // await update_visit_data(formData);
      setIsUpdateModalOpen(false);
      setSelectedVisit(undefined);
      get_visit_list_list(); // Refresh the list
    }
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    if (selectedVisit) {
      //   await delete_visit_data(formData as any)
      setIsDeleteModalOpen(false);
      setSelectedVisit(undefined);
      get_visit_list_list(); // Refresh the list
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex">
              <div className="flex-1">
                <h2 className="text-sm font-medium text-gray-500">
                  Total Visits
                </h2>
                <div className="mt-2 flex items-baseline">
                  <p className="text-3xl font-bold text-blue-600">
                    {visit_list.length}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Active visit records
                </p>
              </div>
              <div className="flex items-center justify-center bg-blue-100 rounded-full p-3">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex">
              <div className="flex-1">
                <h2 className="text-sm font-medium text-gray-500">
                  Last Updated
                </h2>
                <div className="mt-2">
                  <p className="text-2xl font-bold text-emerald-500">
                    Just now
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Visit data is up to date
                </p>
              </div>
              <div className="flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="relative flex-1 max-w-md">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  className="block w-full p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search visits..."
                />
              </div>
              <div className="flex items-center">
                <span className="mr-2 text-sm text-gray-600">View:</span>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-medium text-blue-600">Visit List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Client
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Service
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {visit_list.length === 0 ? (
                  <tr className="bg-white border-b">
                    <td colSpan={4} className="px-6 py-4 text-center">
                      No visits found. Create a new visit to get started.
                    </td>
                  </tr>
                ) : (
                  visit_list.map((visit, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{visit.client}</td>
                      <td className="px-6 py-4">{visit.service}</td>
                      <td className="px-6 py-4">
                        {formatDate(visit.datetime)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedVisit(visit);
                              setIsViewModalOpen(true);
                            }}
                            className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                            title="View Details"
                          >
                            <Users className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVisit(visit);
                              setIsUpdateModalOpen(true);
                            }}
                            className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                            title="Edit Visit"
                          >
                            <FileEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedVisit(visit);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:bg-red-100 p-1 rounded"
                            title="Delete Visit"
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
        </div>
      </div>

      {/* Create Visit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Create New Visit
          </h2>
          <Visit_ae978b_create />
        </div>
      </Modal>

      {/* View Visit Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Visit Details
          </h2>
          {selectedVisit && <Visit_ae978b_read data={selectedVisit} />}
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              onClick={() => setIsViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* Update Visit Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Update Visit</h2>
          <form action={handleUpdateSubmit}>
            {selectedVisit && <Visit_6b7e2d_update visit={selectedVisit} />}
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                Update Visit
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Visit Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Delete Visit</h2>
          <form action={handleDeleteSubmit}>
            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
