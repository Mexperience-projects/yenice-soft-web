"use client";

import { useVisits } from "@/hooks/visit/ae978b";
// import Visit_ae978b_read from "@/components/visit/ae978b_read";
import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/modal";
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
import VisitForm from "./(modals)/visitForm";
import { useTranslation } from "react-i18next";
import type { VisitType } from "@/lib/types";

export default function VisitManagement() {
  const { t } = useTranslation();
  const { get_visit_list_list, visit_list, delete_visit_data } = useVisits();

  const [selectedVisit, setSelectedVisit] = useState<VisitType | undefined>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    get_visit_list_list();
  }, [
    isCreateModalOpen,
    isUpdateModalOpen,
    isDeleteModalOpen,
    isViewModalOpen,
  ]);

  const handleOperationComplete = () => {
    // Close all modals
    setIsCreateModalOpen(false);
    setIsUpdateModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsViewModalOpen(false);
    // Reset selected visit
    setSelectedVisit(undefined);
    // Refresh the list
    get_visit_list_list();
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    if (selectedVisit) {
      await delete_visit_data(selectedVisit.id);
      handleOperationComplete();
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
            {t("visits.management")}
          </h1>
          <p className="text-gray-600 ml-5">{t("visits.manageAndTrack")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("visits.totalVisits")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-secondary">
                    {visit_list.length}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("visits.activeVisitRecords")}
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
                  {t("visits.upcomingVisits")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-primary">
                    {
                      visit_list.filter(
                        (v) =>
                          v.operations.filter(
                            (o) => new Date(o.datetime) > new Date()
                          ).length > 0
                      ).length
                    }
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("visits.scheduledForFuture")}
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
                  {t("visits.lastUpdated")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-gray-700">
                    {t("inventory.justNow")}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("visits.dataUpToDate")}
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
                {t("visits.visitRecords")}
              </h2>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                    placeholder={t("visits.searchVisits")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <button
                  onClick={() => {
                    setIsCreateModalOpen(true);
                  }}
                  className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("visits.addNewVisit")}</span>
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
                    {t("visits.client")}
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    {t("visits.service")}
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    {t("visits.dateTime")}
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    {t("common.status")}
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">
                    {t("common.actions")}
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
                          {t("visits.noVisitsFound")}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          {searchTerm
                            ? t("visits.tryDifferentSearch")
                            : t("visits.createNewToStart")}
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
                  visit_list.map((visit, index) => {
                    const isPast =
                      visit_list.filter(
                        (v) =>
                          v.operations.filter(
                            (o) => new Date(o.datetime) > new Date()
                          ).length > 0
                      ).length == 0;

                    return (
                      <tr
                        key={index}
                        className="bg-white border-b hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {visit.client.name}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {visit.operations.map((o) =>
                            o.service.map((s) => <p>{s.name}</p>)
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                            {visit.operations.length} operation
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {isPast ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {t("visits.completed")}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              <Calendar className="h-3 w-3 mr-1" />
                              {t("visits.scheduled")}
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
                              title={t("common.view")}
                            >
                              <Users className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVisit(visit);
                                setIsUpdateModalOpen(true);
                              }}
                              className="text-gray-600 hover:text-secondary bg-gray-100 hover:bg-secondary/10 p-2 rounded-lg transition-colors"
                              title={t("common.edit")}
                            >
                              <FileEdit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedVisit(visit);
                                setIsDeleteModalOpen(true);
                              }}
                              className="text-gray-600 hover:text-red-500 bg-gray-100 hover:bg-red-50 p-2 rounded-lg transition-colors"
                              title={t("common.delete")}
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
                {t("common.showing")}{" "}
                <span className="font-medium">{visit_list.length}</span>{" "}
                {t("common.of")}{" "}
                <span className="font-medium">{visit_list.length}</span>{" "}
                {t("visits.visits")}
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200">
                  {t("visits.previous")}
                </button>
                <button className="px-3 py-1 text-sm text-white bg-primary rounded-md hover:bg-primary/90">
                  1
                </button>
                <button className="px-3 py-1 text-sm text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200">
                  {t("visits.next")}
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
            {t("visits.visitDetails")}
          </h2>
          {/* {selectedVisit && <Visit_ae978b_read data={selectedVisit} />} */}
          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              onClick={() => setIsViewModalOpen(false)}
            >
              {t("common.close")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Create/Update Visit Modal */}
      <VisitForm
        isOpen={isCreateModalOpen || isUpdateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setIsUpdateModalOpen(false);
          setSelectedVisit(undefined);
        }}
        onComplete={handleOperationComplete}
        selectedVisit={selectedVisit}
      />
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
            {t("visits.deleteVisit")}
          </h2>
          <p className="text-gray-600 text-center mb-6">
            {t("visits.deleteVisitConfirm")}
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
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-all duration-300"
              >
                {t("common.delete")}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
