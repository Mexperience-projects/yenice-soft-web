"use client";

import { useServices_10cd39 } from "@/hooks/services/10cd39";
import { useEffect, useState } from "react";
import type { ServicesType } from "@/lib/types";
import { Edit, Plus, RefreshCw, Search, Trash2, Users } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import Services_10cd39_create from "@/components/services/10cd39_create";
import Services_10cd39_update from "@/components/services/10cd39_update";

export default function ServicesPage() {
  const {
    get_services_list_list,
    create_services_data,
    update_services_data,
    delete_services_data,
    services_list,
  } = useServices_10cd39();

  const [servicesModal, setServicesModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedService, setSelectedService] = useState<ServicesType | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    get_services_list_list();
  }, []);

  const handleEdit = (service: ServicesType) => {
    setSelectedService(service);
    setModalMode("update");
    setServicesModal(true);
  };

  const handleDelete = async (serviceId: number) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await delete_services_data(serviceId);
    }
  };

  const handleAddNew = () => {
    setSelectedService(null);
    setModalMode("create");
    setServicesModal(true);
  };

  const filteredServices = services_list.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const refreshData = () => {
    get_services_list_list();
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 ">
      <div className="container">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div>
              <div className="text-gray-600 text-sm">Total Services</div>
              <div className="text-indigo-600 text-4xl font-bold">
                {services_list.length}
              </div>
              <div className="text-gray-500 text-xs">
                Active service offerings
              </div>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
              <Users className="h-6 w-6" />
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
            <button
              onClick={refreshData}
              className="bg-teal-100 p-3 rounded-full text-teal-500 hover:bg-teal-200 transition-colors"
            >
              <RefreshCw className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Services List */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex flex-row justify-between">
            <h2 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">
              Services List
            </h2>
            <div className="flex items-center">
              <span className="mr-2 text-gray-600">View:</span>
              <button
                onClick={handleAddNew}
                className="btn btn-primary btn-sm gap-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add New
              </button>
            </div>
          </div>

          {filteredServices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No services found</p>
              <button
                onClick={handleAddNew}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4 py-2 flex items-center mx-auto"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add New Service
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      Description
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service, i) => (
                    <tr
                      key={i}
                      className={`border-b border-gray-100 hover:bg-gray-50 ${
                        i % 2 === 1 ? "bg-gray-50" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-gray-800">
                        {service.name}
                      </td>
                      <td className="py-3 px-4 text-gray-600 max-w-md truncate">
                        {service.description}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleEdit(service)}
                          className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm mr-2 hover:bg-indigo-700"
                        >
                          <Edit className="h-4 w-4 inline mr-1" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(service.id || 0)}
                          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                        >
                          <Trash2 className="h-4 w-4 inline mr-1" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Modal */}
      <Modal isOpen={servicesModal} onClose={() => setServicesModal(false)}>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">
            {modalMode === "create" ? "Add New Service" : "Edit Service"}
          </h2>

          {modalMode === "create" ? (
            <form
              action={async (formData) => {
                await create_services_data(formData);
                setServicesModal(false);
              }}
            >
              <Services_10cd39_create />
              <div className="flex justify-end mt-6 gap-2">
                <button
                  type="button"
                  onClick={() => setServicesModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Create Service
                </button>
              </div>
            </form>
          ) : (
            <form
              action={async (formData) => {
                await update_services_data(formData);
                setServicesModal(false);
              }}
            >
              {selectedService && (
                <>
                  <input type="hidden" name="id" value={selectedService.id} />
                  <Services_10cd39_update initialData={selectedService} />
                  <div className="flex justify-end mt-6 gap-2">
                    <button
                      type="button"
                      onClick={() => setServicesModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Update Service
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
}
