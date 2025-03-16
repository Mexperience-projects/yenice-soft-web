"use client";

import { useEffect, useState } from "react";
import {
  RefreshCw,
  CreditCard,
  Search,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import type { PaymentsType } from "@/lib/types";
import { usePayments } from "@/hooks/payments/main";
import { useVisits } from "@/hooks/visit/ae978b";
import { useTranslation } from "react-i18next";

export default function PaymentsManagement() {
  const { t } = useTranslation();

  // State for payments data
  const [filteredPayments, setFilteredPayments] = useState<PaymentsType[]>([]);
  const {
    get_payments_list_list,
    payments_list,
    loading,
    delete_payments_data,
  } = usePayments();
  const { get_visit_list_list, visit_list } = useVisits();

  // State for CRUD operations
  const [selectedPayment, setSelectedPayment] = useState<PaymentsType | null>(
    null
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // State for form inputs
  const [formData, setFormData] = useState({
    visit_id: 0,
    price: 0,
    paid: false,
  });

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<any>({});

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    get_payments_list_list();
    get_visit_list_list();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...payments_list];

    // Apply search term
    if (searchTerm) {
      result = result.filter(
        (payment) =>
          payment.visit?.client?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          payment.id.toString().includes(searchTerm) ||
          payment.price.toString().includes(searchTerm) ||
          (payment.visit?.id &&
            payment.visit.id.toString().includes(searchTerm))
      );
    }

    // Apply filters
    if (filters.paid !== undefined) {
      // result = result.filter((payment) => payment.paid === filters.paid);
    }

    if (filters.visit_id) {
      // result = result.filter(
      //   (payment) => payment.visit.id === filters.visit_id
      // );
    }

    if (filters.author_id) {
      // result = result.filter(
      //   (payment) => payment.author.id === filters.author_id
      // );
    }

    if (filters.min_price) {
      result = result.filter((payment) => payment.price >= filters.min_price!);
    }

    if (filters.max_price) {
      result = result.filter((payment) => payment.price <= filters.max_price!);
    }

    if (filters.date_from) {
      // result = result.filter(
      //   (payment) =>
      //     payment.created_at &&
      //     new Date(payment.created_at) >= new Date(filters.date_from!)
      // );
    }

    if (filters.date_to) {
      // result = result.filter(
      //   (payment) =>
      //     payment.created_at &&
      //     new Date(payment.created_at) <= new Date(filters.date_to!)
      // );
    }

    setFilteredPayments(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [payments_list, searchTerm, filters]);

  // CRUD operations
  const handleCreatePayment = () => {
    // In a real app, you would make an API call
    // const newPayment: PaymentsType = {
    //   id: payments.length + 1,
    //   visit:
    //     mockVisits.find(
    //       (v) => v.id === Number.parseInt(formData.visit_id.toString())
    //     ) || mockVisits[0],
    //   price: formData.price,
    //   paid: formData.paid,
    //   author: mockUsers[0], // Assuming current user
    //   created_at: new Date(),
    // };
    // setPayments([...payments, newPayment]);
    // setIsCreateModalOpen(false);
    // resetForm();
  };

  const handleUpdatePayment = () => {
    if (!selectedPayment) return;
    // setPayments(updatedPayments);
    setIsUpdateModalOpen(false);
    setSelectedPayment(null);
    resetForm();
  };

  const handleDeletePayment = () => {
    if (!selectedPayment) return;
    delete_payments_data(selectedPayment.id);
    setIsDeleteModalOpen(false);
    setSelectedPayment(null);
  };

  const resetForm = () => {
    setFormData({ visit_id: 0, price: 0, paid: false });
  };

  const openVisitModal = (payment: PaymentsType) => {
    setSelectedPayment(payment);
    setIsUpdateModalOpen(true);
  };

  // Pagination
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);
  const paginatedPayments = filteredPayments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Formatting helpers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString();
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({});
    setSearchTerm("");
    setIsFilterOpen(false);
  };

  // Calculate stats
  const paidPayments = payments_list.filter((p) => p.paid).length;
  const unpaidPayments = payments_list.length - paidPayments;
  const paidPercentage =
    payments_list.length > 0
      ? Math.round((paidPayments / payments_list.length) * 100)
      : 0;
  const unpaidPercentage =
    payments_list.length > 0
      ? Math.round((unpaidPayments / payments_list.length) * 100)
      : 0;

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
            {t("payments.title")}
          </h1>
          <p className="text-gray-600 ml-5">{t("payments.subtitle")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("payments.totalPayments")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-secondary">
                    {payments_list.length}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("payments.allPaymentRecords")}
                </p>
              </div>
              <div className="flex items-center justify-center bg-secondary/10 rounded-full p-3">
                <CreditCard className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("payments.paidPayments")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-green-600">
                    {paidPayments}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {paidPercentage}% {t("payments.ofTotal")}
                </p>
              </div>
              <div className="flex items-center justify-center bg-green-100 rounded-full p-3">
                <Check className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("payments.unpaidPayments")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-red-500">
                    {unpaidPayments}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {unpaidPercentage}% {t("payments.ofTotal")}
                </p>
              </div>
              <div className="flex items-center justify-center bg-red-100 rounded-full p-3">
                <X className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="p-5 border-b border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="relative w-full md:w-1/3">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={t("payments.searchPayments")}
                  className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <button
                  className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg flex items-center gap-2 transition-colors"
                  onClick={get_payments_list_list}
                >
                  <RefreshCw className="h-4 w-4" />
                  {t("common.refresh")}
                </button>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="p-5 border-t border-gray-100 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {t("payments.paymentStatus")}
                  </label>
                  <select
                    className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                    value={
                      filters.paid === undefined
                        ? ""
                        : filters.paid
                          ? "paid"
                          : "unpaid"
                    }
                    onChange={(e) => {
                      if (e.target.value === "") {
                        const { paid, ...rest } = filters;
                        setFilters(rest);
                      } else {
                        setFilters({
                          ...filters,
                          paid: e.target.value === "paid",
                        });
                      }
                    }}
                  >
                    <option value="">{t("payments.allStatuses")}</option>
                    <option value="paid">{t("payments.paid")}</option>
                    <option value="unpaid">{t("payments.unpaid")}</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {t("payments.minPrice")}
                  </label>
                  <input
                    type="number"
                    className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                    placeholder={t("payments.minPrice")}
                    value={filters.min_price || ""}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        const { min_price, ...rest } = filters;
                        setFilters(rest);
                      } else {
                        setFilters({
                          ...filters,
                          min_price: Number.parseInt(e.target.value),
                        });
                      }
                    }}
                  />
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {t("payments.maxPrice")}
                  </label>
                  <input
                    type="number"
                    className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                    placeholder={t("payments.maxPrice")}
                    value={filters.max_price || ""}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        const { max_price, ...rest } = filters;
                        setFilters(rest);
                      } else {
                        setFilters({
                          ...filters,
                          max_price: Number.parseInt(e.target.value),
                        });
                      }
                    }}
                  />
                </div>

                <div className="form-control">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    {t("payments.dateRange")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                      value={
                        filters.date_from
                          ? new Date(filters.date_from)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        if (e.target.value === "") {
                          const { date_from, ...rest } = filters;
                          setFilters(rest);
                        } else {
                          setFilters({
                            ...filters,
                            date_from: new Date(e.target.value),
                          });
                        }
                      }}
                    />
                    <span className="self-center text-gray-500">
                      {t("payments.to")}
                    </span>
                    <input
                      type="date"
                      className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                      value={
                        filters.date_to
                          ? new Date(filters.date_to)
                              .toISOString()
                              .split("T")[0]
                          : ""
                      }
                      onChange={(e) => {
                        if (e.target.value === "") {
                          const { date_to, ...rest } = filters;
                          setFilters(rest);
                        } else {
                          setFilters({
                            ...filters,
                            date_to: new Date(e.target.value),
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4 gap-2">
                <button
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
                  onClick={resetFilters}
                >
                  {t("common.clearFilters")}
                </button>
                <button
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
                  onClick={() => setIsFilterOpen(false)}
                >
                  {t("payments.applyFilters")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payments Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <CreditCard className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                {t("payments.noPaymentsFound")}
              </h3>
              <p className="text-gray-600 max-w-md">
                {Object.keys(filters).length > 0 || searchTerm
                  ? t("payments.adjustFilters")
                  : t("payments.noPaymentRecords")}
              </p>
              {Object.keys(filters).length > 0 || searchTerm ? (
                <button
                  className="mt-6 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
                  onClick={resetFilters}
                >
                  {t("common.clearFilters")}
                </button>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-4 font-medium">
                        {t("common.id")}
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        {t("payments.visit")}
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        {t("payments.patient")}
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        {t("common.price")}
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        {t("common.status")}
                      </th>
                      <th scope="col" className="px-6 py-4 font-medium">
                        {t("common.date")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPayments.map((payment, index) => (
                      <tr
                        key={payment.id}
                        className={`bg-white border-b hover:bg-gray-50 transition-colors duration-150 ${
                          index % 2 === 1 ? "bg-gray-50" : ""
                        }`}
                      >
                        <td className="px-6 py-4 font-mono text-gray-700">
                          {payment.id}
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {payment.visit ? `#${payment.visit.id}` : "N/A"}
                        </td>
                        <td className="px-6 py-4 font-medium text-gray-900">
                          {payment.client?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-gray-900">
                          {formatCurrency(payment.price)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              payment.paid
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {payment.paid
                              ? t("payments.paid")
                              : t("payments.unpaid")}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">
                          {formatDate(payment.date)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex justify-center">
                  <div className="flex items-center gap-1">
                    <button
                      className="p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-gradient-to-r from-primary to-secondary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}

                    <button
                      className="p-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:pointer-events-none"
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
