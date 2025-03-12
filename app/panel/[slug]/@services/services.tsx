"use client";

import { useServices_10cd39 } from "@/hooks/services/10cd39";
import { useEffect, useState } from "react";
import type { ServicesType } from "@/lib/types";
import {
  Edit,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Briefcase,
  AlertCircle,
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { usePersonel_e02ed2 } from "@/hooks/personel/e02ed2";
import { useTranslation } from "react-i18next";
import FormModal from "./(modals)/form";
import { useItems_691d50 } from "@/hooks/items/691d50";

export default function ServicesPage() {
  const { t } = useTranslation();

  const { get_services_list_list, delete_services_data, services_list } =
    useServices_10cd39();
  const { get_personel_list_list, personel_list } = usePersonel_e02ed2();
  const { get_items_list_list, items_list } = useItems_691d50();

  const [servicesModal, setServicesModal] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "update">("create");
  const [selectedService, setSelectedService] = useState<
    ServicesType | undefined
  >();
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<number | null>(null);

  useEffect(() => {
    get_services_list_list();
    get_personel_list_list();
    get_items_list_list();
  }, []);

  const handleEdit = (service: ServicesType) => {
    setSelectedService(service);
    setModalMode("update");
    setServicesModal(true);
  };

  const handleDelete = async (serviceId: number) => {
    setServiceToDelete(serviceId);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (serviceToDelete !== null) {
      await delete_services_data(serviceToDelete);
      setDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  const handleAddNew = () => {
    setSelectedService(undefined);
    setModalMode("create");
    setServicesModal(true);
  };

  const filteredServices = services_list.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
            {t("services.management")}
          </h1>
          <p className="text-gray-600 ml-5">
            {t("services.manageYourOfferings")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("services.totalServices")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-secondary">
                    {services_list.length}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("services.activeOfferings")}
                </p>
              </div>
              <div className="flex items-center justify-center bg-secondary/10 rounded-full p-3">
                <Briefcase className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("services.lastUpdated")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-gray-700">
                    {t("inventory.justNow")}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("services.dataUpToDate")}
                </p>
              </div>
              <button
                onClick={get_services_list_list}
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
                {t("services.servicesList")}
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                    placeholder={t("services.searchServices")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <button
                  onClick={handleAddNew}
                  className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("services.addNewService")}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Services Table */}
          {filteredServices.length === 0 ? (
            <div className="p-8 text-center">
              <div className="bg-gray-50 p-6 rounded-lg inline-block mb-4">
                <Briefcase className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {t("services.noServicesFound")}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {searchQuery
                  ? t("services.noServicesMatch")
                  : t("services.noServicesYet")}
              </p>
              <button
                onClick={handleAddNew}
                className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none px-4 py-2.5 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>{t("services.addNewService")}</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">
                      {t("common.name")}
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      {t("common.description")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 font-medium text-right"
                    >
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredServices.map((service, i) => (
                    <tr
                      key={i}
                      className={`bg-white border-b hover:bg-gray-50 transition-colors duration-150 ${
                        i % 2 === 1 ? "bg-gray-50" : ""
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {service.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 max-w-md truncate">
                        {service.description}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEdit(service)}
                            className="px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            {t("common.edit")}
                          </button>
                          <button
                            onClick={() => handleDelete(service.id || 0)}
                            className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t("common.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Table Footer */}
          {filteredServices.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {t("common.showing")}{" "}
                <span className="font-medium">{filteredServices.length}</span>{" "}
                {t("common.of")}{" "}
                <span className="font-medium">{services_list.length}</span>{" "}
                {t("services.services")}
              </div>
            </div>
          )}
        </div>
      </div>

      <FormModal
        isOpen={servicesModal}
        onClose={() => setServicesModal(false)}
        selectedService={selectedService}
        personnel={personel_list}
        items={items_list}
      />

      {/* Delete Modal */}
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-500">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 text-center">
            {t("services.deleteService")}
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {t("services.deleteServiceConfirm")}
          </p>
          <div className="flex justify-center gap-3 mt-6">
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
              onClick={() => setDeleteModal(false)}
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300"
              onClick={confirmDelete}
            >
              {t("common.delete")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
