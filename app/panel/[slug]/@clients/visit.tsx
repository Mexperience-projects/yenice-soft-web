"use client";

import { useClients } from "@/hooks/clients/main";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
import Client_ae978b_create from "@/components/client/ae978b_create";
import {
  PlusCircle,
  Users,
  FileEdit,
  Trash2,
  RefreshCw,
  Plus,
} from "lucide-react";

export default function clientManagement() {
  const { get_clients_list_list, create_clients_data, clients_list } =
    useClients();

  const [selectedclient, setSelectedclient] = useState<ClientTypes>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    get_clients_list_list();
  }, []);

  const handleUpdateSubmit = async (formData: FormData) => {
    if (selectedclient) {
      // await update_client_data(formData);
      setIsUpdateModalOpen(false);
      setSelectedclient(undefined);
      get_clients_list_list(); // Refresh the list
    }
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    if (selectedclient) {
      //   await delete_client_data(formData as any)
      setIsDeleteModalOpen(false);
      setSelectedclient(undefined);
      get_clients_list_list(); // Refresh the list
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-500">
                Total clients
              </h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-blue-600">
                  {clients_list.length}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Active client records
              </p>
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
            <h2 className="text-lg font-medium text-blue-600">client List</h2>
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
                {clients_list.length === 0 ? (
                  <tr className="bg-white border-b">
                    <td colSpan={4} className="px-6 py-4 text-center">
                      No clients found. Create a new client to get started.
                    </td>
                  </tr>
                ) : (
                  clients_list.map((client, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">{client.client}</td>
                      <td className="px-6 py-4">{client.service}</td>
                      <td className="px-6 py-4">
                        {formatDate(client.datetime)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedclient(client);
                              setIsViewModalOpen(true);
                            }}
                            className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                            title="View Details"
                          >
                            <Users className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedclient(client);
                              setIsUpdateModalOpen(true);
                            }}
                            className="text-blue-600 hover:bg-blue-100 p-1 rounded"
                            title="Edit client"
                          >
                            <FileEdit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedclient(client);
                              setIsDeleteModalOpen(true);
                            }}
                            className="text-red-600 hover:bg-red-100 p-1 rounded"
                            title="Delete client"
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

      {/* Update client Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Update client
          </h2>
          <form action={create_clients_data}>
            <Client_ae978b_create />
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
                Create client
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete client Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Delete client
          </h2>
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
