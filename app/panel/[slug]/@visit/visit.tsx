"use client";

import { useVisit_ae978b, type visit_ae978bType } from "@/hooks/visit/ae978b";
import Visit_ae978b_read from "@/components/visit/ae978b_read";
import { useEffect, useState } from "react";
import Visit_6b7e2d_update from "@/components/visit/6b7e2d_update";
import { Modal } from "@/components/ui/modal";
import Visit_ae978b_create from "@/components/visit/ae978b_create";
import {
  PlusCircle,
  Users,
  FileEdit,
  Trash2,
  RefreshCw,
  Plus,
} from "lucide-react";

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
      <div className="container mx-auto px-4 py-6  container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-500">
                Total Visits
              </h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-blue-600">
                  {visit_list.length}
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

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b flex flex-row justify-between">
            <h2 className="text-lg font-medium text-blue-600">Visit List</h2>
            <div className="flex items-center">
              <span className="mr-2 text-sm text-gray-600">View:</span>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn btn-primary btn-sm gap-1"
              >
                <Plus className="h-4 w-4" />
                Add New
              </button>
            </div>
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
