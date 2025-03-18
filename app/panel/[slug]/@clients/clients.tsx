"use client";

import { useEffect, useState } from "react";
import {
  Users,
  FileEdit,
  Trash2,
  Plus,
  Search,
  User,
  AlertCircle,
  Calendar,
} from "lucide-react";
import { useClients } from "@/hooks/clients/main";
import type { ClientType } from "@/lib/types";
import { Modal } from "@/components/ui/modal";
import { useTranslation } from "react-i18next";
import ClientModal from "./(modals)/createClient";
export default function ClientManagement() {
  const { t } = useTranslation();

  const {
    get_clients_list_list,
    create_clients_data,
    clients_list,
    update_clients_data,
    delete_clients_data,
  } = useClients();

  const [selectedClient, setSelectedClient] = useState<ClientType | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGender, setFilterGender] = useState<number | "all">("all");
  const [currentTab, setCurrentTab] = useState("all");

  useEffect(() => {
    get_clients_list_list();
  }, []);

  const handleUpdateSubmit = async (formData: FormData) => {
    if (selectedClient) {
      setIsUpdateModalOpen(false);
      update_clients_data(formData);
      setSelectedClient(null);
    }
  };

  const handleDeleteSubmit = async () => {
    if (selectedClient) {
      setIsDeleteModalOpen(false);
      delete_clients_data(selectedClient.id);
      setSelectedClient(null);
    }
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("tr-TR");
  };

  const formatBirthdate = (dateString: Date) => {
    const date = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();

    return `${date.toLocaleDateString("tr-TR")} (${age} ${t("clients.years")})`;
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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen relative">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
            {t("clients.title")}
          </h1>
          <p className="text-gray-600 ml-5">{t("clients.subtitle")}</p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={() => {
              setIsCreateModalOpen(true);
              setSelectedClient(null);
            }}
            className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300"
          >
            <Plus className="h-4 w-4" />
            <span>{t("clients.addNewClient")}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Total Clients Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("clients.totalClients")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-secondary">
                    {clients_list.length}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("clients.activeClientRecords")}
                </p>
              </div>
              <div className="flex items-center justify-center bg-secondary/10 rounded-full p-3">
                <Users className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </div>

          {/* Male Clients Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("clients.maleClients")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-primary">
                    {
                      clients_list.filter(
                        (client: ClientType) => client.gender === 1
                      ).length
                    }
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("clients.maleClientRecords")}
                </p>
              </div>
              <div className="flex items-center justify-center bg-primary/10 rounded-full p-3">
                <User className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          {/* Female Clients Card */}
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("clients.femaleClients")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-secondary">
                    {
                      clients_list.filter(
                        (client: ClientType) => client.gender === 2
                      ).length
                    }
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("clients.femaleClientRecords")}
                </p>
              </div>
              <div className="flex items-center justify-center bg-secondary/10 rounded-full p-3">
                <User className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </div>
        </div>

        {/* Client Records Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
                {t("clients.clientRecords")}
              </h2>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Search Input */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                    placeholder={t("clients.searchByNameOrId")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Client Table */}
          {currentTab === "all" && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-medium">
                      {t("clients.name")}
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      {t("clients.nationalId")}
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      {t("clients.birthdate")}
                    </th>
                    <th scope="col" className="px-6 py-4 font-medium">
                      {t("clients.gender")}
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
                  {filteredClients.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-gray-100 p-3 rounded-full mb-3">
                            <Users className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            {t("clients.noClientsFound")}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            {searchTerm || filterGender !== "all"
                              ? t("clients.noClientsMatch")
                              : t("clients.addClientToStart")}
                          </p>
                          {searchTerm && (
                            <button
                              onClick={() => setSearchTerm("")}
                              className="mt-3 text-primary hover:text-primary/80 text-sm font-medium"
                            >
                              {t("common.clearSearch")}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredClients.map((client: ClientType, index) => (
                      <tr
                        key={client.id}
                        className={`bg-white border-b hover:bg-gray-50 transition-colors duration-150 ${
                          index % 2 === 1 ? "bg-gray-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {client.name}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {client.nationalCo}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formatBirthdate(client.birthdate)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              client.gender === 1
                                ? "bg-primary/10 text-primary"
                                : "bg-secondary/10 text-secondary"
                            }`}
                          >
                            {client.gender === 1
                              ? t("clients.male")
                              : t("clients.female")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            <button
                              className="p-1.5 bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors"
                              onClick={() => {
                                setSelectedClient(client);
                                setIsUpdateModalOpen(true);
                              }}
                              title={t("common.edit")}
                            >
                              <FileEdit className="h-4 w-4 text-secondary" />
                            </button>
                            <button
                              className="p-1.5 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                              onClick={() => {
                                setSelectedClient(client);
                                setIsDeleteModalOpen(true);
                              }}
                              title={t("common.delete")}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
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
            <div className="p-12 text-center text-gray-500">
              {t("clients.recentViewComingSoon")}
            </div>
          )}

          {currentTab === "active" && (
            <div className="p-12 text-center text-gray-500">
              {t("clients.activeViewComingSoon")}
            </div>
          )}
        </div>
      </div>

      <ClientModal
        isOpen={isCreateModalOpen || isUpdateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsUpdateModalOpen(false);
          setSelectedClient(null);
        }}
        onSubmit={selectedClient ? update_clients_data : create_clients_data}
        defaultValues={selectedClient || undefined}
      />

      {/* Delete Client Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="p-6">
          <div className="flex items-center justify-center mb-4 text-red-500">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-2 text-gray-800 text-center">
            {t("clients.deleteClient")}
          </h3>
          <p className="text-gray-600 text-center mb-6">
            {t("clients.deleteClientConfirm")}
          </p>

          {selectedClient && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t("clients.name")}:</span>
                  <span className="font-medium text-gray-800">
                    {selectedClient.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("clients.nationalId")}:
                  </span>
                  <span className="font-medium text-gray-800">
                    {selectedClient.nationalCo}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {t("clients.birthdate")}:
                  </span>
                  <span className="font-medium text-gray-800">
                    {formatDate(selectedClient.birthdate)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-center gap-3">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              {t("common.cancel")}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300"
              onClick={handleDeleteSubmit}
            >
              {t("common.delete")}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

interface ClientFormProps {
  client?: ClientType;
}

function ClientForm({ client }: ClientFormProps = {}) {
  const { t } = useTranslation();
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    client?.birthdate ? new Date(client.birthdate) : undefined
  );

  return (
    <div className="space-y-4">
      <div className="form-control w-full">
        <label className="text-sm font-medium text-gray-700 mb-1">
          {t("clients.fullName")}
        </label>
        <input
          type="text"
          name="name"
          defaultValue={client?.name || ""}
          placeholder={t("clients.enterFullName")}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="text-sm font-medium text-gray-700 mb-1">
          {t("clients.nationalId")}
        </label>
        <input
          type="text"
          name="nationalCo"
          defaultValue={client?.nationalCo || ""}
          placeholder={t("clients.enterNationalId")}
          className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="text-sm font-medium text-gray-700 mb-1">
          {t("clients.birthdate")}
        </label>
        <div className="relative">
          <input
            type="date"
            name="birthdate"
            defaultValue={
              client?.birthdate
                ? new Date(client.birthdate).toISOString().split("T")[0]
                : ""
            }
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
            required
            onChange={(e) => {
              if (e.target.value) {
                const [year, month, day] = e.target.value.split("-");
                // This doesn't change the actual value, just helps visualize the format
                e.target.setAttribute(
                  "data-display-format",
                  `${day}/${month}/${year}`
                );
              }
            }}
          />
          {client?.birthdate && (
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center px-2.5 opacity-0">
              <span className="text-gray-700 text-sm">
                {new Date(client.birthdate).getDate()}/
                {new Date(client.birthdate).getMonth() + 1}/
                {new Date(client.birthdate).getFullYear()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="form-control">
        <label className="text-sm font-medium text-gray-700 mb-1">
          {t("clients.gender")}
        </label>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="1"
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 focus:ring-primary"
              defaultChecked={!client || client.gender === 1}
            />
            <span className="ml-2 text-sm text-gray-700">
              {t("clients.male")}
            </span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="gender"
              value="2"
              className="w-4 h-4 text-secondary bg-gray-100 border-gray-300 focus:ring-secondary"
              defaultChecked={client?.gender === 2}
            />
            <span className="ml-2 text-sm text-gray-700">
              {t("clients.female")}
            </span>
          </label>
        </div>
      </div>
    </div>
  );
}
