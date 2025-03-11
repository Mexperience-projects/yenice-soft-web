"use client";

import { useEffect, useState } from "react";
import { usePersonel_e02ed2 } from "@/hooks/personel/e02ed2";
import {
  Plus,
  Users,
  RefreshCw,
  Edit,
  Trash,
  UserPlus,
  UserCheck,
} from "lucide-react";
import type { PersonelType, UsersType } from "@/lib/types";
import { useTranslation } from "react-i18next";
import UserModal from "./(modals)/user_modal";

export default function usersPage() {
  const { t } = useTranslation();

  const {
    get_personel_list_list,
    create_personel_data,
    update_personel_data,
    delete_personel_data,
    personel_list,
  } = usePersonel_e02ed2();

  const [activeTab, setActiveTab] = useState<"create" | "update" | "list">(
    "list"
  );
  const [selectedusers, setSelectedusers] = useState<UsersType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    get_personel_list_list();
  }, [isModalOpen]);

  const openModal = (): void => {
    setIsModalOpen(true);
    const modal = document.getElementById(
      "users_modal"
    ) as HTMLDialogElement | null;
    if (modal) modal.showModal();
  };

  const closeModal = (): void => {
    setIsModalOpen(false);
  };

  const handleusersSelect = (users: PersonelType): void => {
    setSelectedusers(users);
    setActiveTab("update");
  };

  const handleDeleteusers = async (personel: PersonelType): Promise<void> => {
    if (window.confirm(t("users.deleteConfirm"))) {
      delete_personel_data(personel.id);
      setActiveTab("list");
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="mx-auto p-2 md:p-6 container">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
            {t("users.title")}
          </h1>
          <p className="text-gray-600 ml-5">{t("users.subtitle")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("users.totalusers")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-secondary">
                    {personel_list.length}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("users.activeTeamMembers")}
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
                  {t("users.availableStaff")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-primary">
                    {personel_list.length}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("users.readyForAssignment")}
                </p>
              </div>
              <div className="flex items-center justify-center bg-primary/10 rounded-full p-3">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("users.lastUpdated")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-gray-700">
                    {t("users.justNow")}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("users.usersUpToDate")}
                </p>
              </div>
              <button
                onClick={() => get_personel_list_list()}
                className="flex items-center justify-center bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full p-3 hover:from-primary/20 hover:to-secondary/20 transition-all duration-300"
              >
                <RefreshCw className="h-6 w-6 text-secondary" />
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
                {t("users.usersRecords")}
              </h2>

              <button
                onClick={() => {
                  setActiveTab("create");
                  openModal();
                }}
                className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                <span>{t("users.addNewusers")}</span>
              </button>
            </div>
          </div>

          {/* Desktop Table - Hidden on small screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    {t("common.name")}
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    {t("common.description")}
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {personel_list.map((users, i) => (
                  <tr
                    key={i}
                    className="bg-white border-b hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {users.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {users.description}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          className="px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors flex items-center gap-1"
                          onClick={() => {
                            handleusersSelect(users);
                            openModal();
                          }}
                        >
                          <Edit className="h-3.5 w-3.5" />
                          {t("common.edit")}
                        </button>
                        <button
                          className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                          onClick={() => handleDeleteusers(users)}
                        >
                          <Trash className="h-3.5 w-3.5" />
                          {t("common.delete")}
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
            {personel_list.map((users, i) => (
              <div key={i} className="border-b border-gray-100 p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{users.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {users.description}
                    </p>
                  </div>
                  <div className="dropdown dropdown-end">
                    <label
                      tabIndex={0}
                      className="btn btn-ghost btn-sm rounded-lg"
                    >
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
                      className="dropdown-content z-[1] menu p-2 shadow bg-white rounded-lg w-52 border border-gray-100"
                    >
                      <li>
                        <a
                          onClick={() => {
                            handleusersSelect(users);
                            openModal();
                          }}
                          className="flex items-center gap-2 text-secondary hover:bg-secondary/10"
                        >
                          <Edit className="h-4 w-4" /> {t("common.edit")}
                        </a>
                      </li>
                      <li>
                        <a
                          onClick={() => handleDeleteusers(users)}
                          className="flex items-center gap-2 text-red-500 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4" /> {t("common.delete")}
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {personel_list.length === 0 && (
            <div className="p-8 text-center">
              <div className="bg-gray-50 p-6 rounded-lg inline-block mb-4">
                <UserPlus className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {t("users.nousersRecords")}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                {t("users.nousersFound")}
              </p>
              <button
                onClick={() => {
                  setActiveTab("create");
                  openModal();
                }}
                className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none px-4 py-2.5 rounded-lg flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                <span>{t("users.addFirstusers")}</span>
              </button>
            </div>
          )}

          {/* Table Footer */}
          {personel_list.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {t("common.showing")}{" "}
                <span className="font-medium">{personel_list.length}</span>{" "}
                {t("users.usersRecords").toLowerCase()}
              </div>
            </div>
          )}
        </div>

        <div className="fixed bottom-6 right-6 md:hidden">
          <button
            onClick={() => {
              setActiveTab("create");
              openModal();
            }}
            className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none h-14 w-14 rounded-full shadow-lg flex items-center justify-center"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>
      <UserModal
        onClose={() => {
          closeModal();
          setSelectedusers(null);
        }}
        selecteduser={selectedusers}
        isOpen={isModalOpen}
      />
    </div>
  );
}
