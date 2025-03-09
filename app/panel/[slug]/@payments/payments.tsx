"use client";

import { useEffect, useState } from "react";
import {
  PlusCircle,
  FileEdit,
  Trash2,
  RefreshCw,
  CreditCard,
  Search,
  ChevronLeft,
  ChevronRight,
  Eye,
  Filter,
  Check,
  X,
} from "lucide-react";
import { ClientType, PaymentsType, VisitType } from "@/lib/types";
import { usePayments } from "@/hooks/payments/main";
import { useVisit_6b7e2d } from "@/hooks/visit/6b7e2d";
import { useVisit_ae978b } from "@/hooks/visit/ae978b";

export default function PaymentsManagement() {
  // State for payments data
  const [filteredPayments, setFilteredPayments] = useState<PaymentsType[]>([]);
  const {
    get_payments_list_list,
    payments_list,
    loading,
    delete_payments_data,
  } = usePayments();
  const { get_visit_list_list, visit_list } = useVisit_ae978b();

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
      // result = result.filter(
      //   (payment) =>
      //     payment.visit.patient_name
      //       .toLowerCase()
      //       .includes(searchTerm.toLowerCase()) ||
      //     payment.id.toString().includes(searchTerm) ||
      //     payment.price.toString().includes(searchTerm)
      // );
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
    setFormData({
      visit_id: 0,
      price: 0,
      paid: false,
    });
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

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-primary">
              Payments Management
            </h1>
            <p className="text-base-content/70">
              Manage all your payment transactions
            </p>
          </div>
          <button className="btn btn-primary mt-4 md:mt-0" disabled>
            New visits create automaticly payments
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-primary">
                <CreditCard className="h-8 w-8" />
              </div>
              <div className="stat-title">Total Payments</div>
              <div className="stat-value text-primary">
                {payments_list.length}
              </div>
              <div className="stat-desc">All payment records</div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-success">
                <Check className="h-8 w-8" />
              </div>
              <div className="stat-title">Paid Payments</div>
              <div className="stat-value text-success">
                {/* {payments.filter((p) => p.paid).length} */}
              </div>
              <div className="stat-desc">
                {/* {(
                  (payments.filter((p) => p.paid).length / payments.length) *
                  100
                ).toFixed(0)} */}
                % of total
              </div>
            </div>
          </div>

          <div className="stats shadow">
            <div className="stat">
              <div className="stat-figure text-error">
                <X className="h-8 w-8" />
              </div>
              <div className="stat-title">Unpaid Payments</div>
              <div className="stat-value text-error">
                {/* {payments.filter((p) => !p.paid).length} */}
              </div>
              <div className="stat-desc">
                {/* {(
                  (payments.filter((p) => !p.paid).length / payments.length) *
                  100
                ).toFixed(0)} */}
                % of total
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-base-100 rounded-box p-4 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="form-control w-full md:w-1/3">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search payments..."
                  className="input input-bordered w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square">
                  <Search className="h-5 w-5" />
                </button>
              </div>
            </div>
            <div className="flex-1"></div>
            <div className="flex gap-2">
              <button
                className={`btn ${
                  Object.keys(filters).length > 0 ? "btn-accent" : "btn-outline"
                }`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters{" "}
                {Object.keys(filters).length > 0 &&
                  `(${Object.keys(filters).length})`}
              </button>
              <button
                className="btn btn-outline"
                onClick={get_payments_list_list}
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Filter Panel */}
          {isFilterOpen && (
            <div className="mt-4 p-4 border border-base-300 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Payment Status</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
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
                    <option value="">All Statuses</option>
                    <option value="paid">Paid</option>
                    <option value="unpaid">Unpaid</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Visit</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={filters.visit_id || ""}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        const { visit_id, ...rest } = filters;
                        setFilters(rest);
                      } else {
                        setFilters({
                          ...filters,
                          visit_id: Number.parseInt(e.target.value),
                        });
                      }
                    }}
                  >
                    <option value="">All Visits</option>
                    {visit_list.map((visit) => (
                      <option key={visit.id} value={visit.id}>
                        {visit.client.name} -{" "}
                        {new Date(visit.datetime).toLocaleDateString()}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Author</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    value={filters.author_id || ""}
                    onChange={(e) => {
                      if (e.target.value === "") {
                        const { author_id, ...rest } = filters;
                        setFilters(rest);
                      } else {
                        setFilters({
                          ...filters,
                          author_id: Number.parseInt(e.target.value),
                        });
                      }
                    }}
                  >
                    <option value="">All Authors</option>
                    {
                      //mockUsers.map((user) => (
                      // <option key={user.id} value={user.id}>
                      //   {/* {user.first_name} {user.last_name} */}
                      // </option>
                      //))
                    }
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Min Price</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="Min price"
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
                  <label className="label">
                    <span className="label-text">Max Price</span>
                  </label>
                  <input
                    type="number"
                    className="input input-bordered w-full"
                    placeholder="Max price"
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
                  <label className="label">
                    <span className="label-text">Date Range</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="input input-bordered w-full"
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
                    <span className="self-center">to</span>
                    <input
                      type="date"
                      className="input input-bordered w-full"
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
                <button className="btn btn-outline" onClick={resetFilters}>
                  Clear Filters
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Payments Table */}
        <div className="bg-base-100 rounded-box shadow-sm overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <CreditCard className="h-16 w-16 text-base-content/30 mb-4" />
              <h3 className="text-lg font-semibold">No payments found</h3>
              <p className="text-base-content/70 mt-2 max-w-md">
                {Object.keys(filters).length > 0 || searchTerm
                  ? "Try adjusting your filters or search term."
                  : "There are no payment records in the system."}
              </p>
              {Object.keys(filters).length > 0 || searchTerm ? (
                <button className="btn btn-outline mt-6" onClick={resetFilters}>
                  Clear Filters
                </button>
              ) : (
                <></>
              )}
            </div>
          ) : (
            <div>
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Visit</th>
                    <th>Patient</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment) => (
                    <tr key={payment.id} className="hover">
                      <td className="font-mono">{payment.id}</td>
                      <td>#{payment.visit.id}</td>
                      <td>{payment.visit.client.name}</td>
                      <td className="font-semibold">
                        {formatCurrency(payment.price)}
                      </td>
                      <td>
                        <div
                          className={`badge ${
                            payment.paid ? "badge-success" : "badge-error"
                          }`}
                        >
                          {payment.paid ? "Paid" : "Unpaid"}
                        </div>
                      </td>
                      <td>{formatDate(payment.date)}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-ghost btn-xs"
                            onClick={() => openVisitModal(payment.visit)}
                          >
                            <FileEdit className="h-4 w-4" />
                          </button>
                          <button
                            className="btn btn-ghost btn-xs text-error"
                            onClick={() => {
                              setSelectedPayment(payment);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center py-4">
                  <div className="join">
                    <button
                      className="join-item btn"
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
                          className={`join-item btn ${
                            currentPage === page ? "btn-active" : ""
                          }`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className="join-item btn"
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

      {/* Create Payment Modal */}
      {isCreateModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">Create New Payment</h3>
            <div className="py-4">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Visit</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.visit_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visit_id: Number.parseInt(e.target.value),
                    })
                  }
                  required
                >
                  <option value={0} disabled>
                    Select a visit
                  </option>
                  {mockVisits.map((visit) => (
                    <option key={visit.id} value={visit.id}>
                      {/* {visit.patient_name} -{" "}
                      {new Date(visit.date).toLocaleDateString()} */}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number.parseInt(e.target.value),
                    })
                  }
                  required
                  min="0"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Payment Status</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={formData.paid}
                    onChange={(e) =>
                      setFormData({ ...formData, paid: e.target.checked })
                    }
                  />
                </label>
                <span className="text-sm text-base-content/70 mt-1">
                  {formData.paid ? "Marked as paid" : "Marked as unpaid"}
                </span>
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreatePayment}
                disabled={formData.visit_id === 0 || formData.price <= 0}
              >
                Create Payment
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setIsCreateModalOpen(false);
              resetForm();
            }}
          ></div>
        </div>
      )}

      {/* Update Payment Modal */}
      {isUpdateModalOpen && selectedPayment && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">
              Update Payment #{selectedPayment.id}
            </h3>
            <div className="py-4">
              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Visit</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  value={formData.visit_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      visit_id: Number.parseInt(e.target.value),
                    })
                  }
                  required
                >
                  <option value={0} disabled>
                    Select a visit
                  </option>
                  {mockVisits.map((visit) => (
                    <option key={visit.id} value={visit.id}>
                      {/* {visit.patient_name} -{" "}
                      {new Date(visit.date).toLocaleDateString()} */}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-control mb-4">
                <label className="label">
                  <span className="label-text">Price</span>
                </label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number.parseInt(e.target.value),
                    })
                  }
                  required
                  min="0"
                />
              </div>

              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Payment Status</span>
                  <input
                    type="checkbox"
                    className="toggle toggle-success"
                    checked={formData.paid}
                    onChange={(e) =>
                      setFormData({ ...formData, paid: e.target.checked })
                    }
                  />
                </label>
                <span className="text-sm text-base-content/70 mt-1">
                  {formData.paid ? "Marked as paid" : "Marked as unpaid"}
                </span>
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsUpdateModalOpen(false);
                  setSelectedPayment(null);
                  resetForm();
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleUpdatePayment}
                disabled={formData.visit_id === 0 || formData.price <= 0}
              >
                Update Payment
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setIsUpdateModalOpen(false);
              setSelectedPayment(null);
              resetForm();
            }}
          ></div>
        </div>
      )}

      {/* View Payment Modal */}
      {isViewModalOpen && selectedPayment && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-lg">Payment Details</h3>
            <div className="py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Payment Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">ID:</span>
                      <span className="font-mono">{selectedPayment.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Amount:</span>
                      <span className="font-semibold">
                        {formatCurrency(selectedPayment.price)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Status:</span>
                      <span
                        className={`badge ${
                          selectedPayment.paid ? "badge-success" : "badge-error"
                        }`}
                      >
                        {selectedPayment.paid ? "Paid" : "Unpaid"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Created:</span>
                      <span>{formatDate(selectedPayment.created_at)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Updated:</span>
                    </div>
                  </div>
                </div>

                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Visit Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Visit ID:</span>
                      <span className="font-mono">
                        #{selectedPayment.visit.id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Patient:</span>
                      {/* <span>{selectedPayment.visit.patient_name}</span> */}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Date:</span>
                      {/* <span>{formatDate(selectedPayment.visit.date)}</span> */}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Status:</span>
                      <span className="badge">
                        {/* {selectedPayment.visit.status} */}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-base-200 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Author Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Name:</span>
                      {/* <span>
                        {selectedPayment.author.first_name}{" "}
                        {selectedPayment.author.last_name}
                      </span> */}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-base-content/70">Username:</span>
                      <span className="font-mono">
                        {/* {selectedPayment.author.username} */}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedPayment(null);
                }}
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  openVisitModal(selectedPayment);
                }}
              >
                <FileEdit className="h-4 w-4 mr-2" />
                Edit
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setIsViewModalOpen(false);
              setSelectedPayment(null);
            }}
          ></div>
        </div>
      )}

      {/* Delete Payment Modal */}
      {isDeleteModalOpen && selectedPayment && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete payment #{selectedPayment.id} for{" "}
              {selectedPayment.visit.client.name}? This action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setSelectedPayment(null);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={handleDeletePayment}
              >
                Delete
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => {
              setIsDeleteModalOpen(false);
              setSelectedPayment(null);
            }}
          ></div>
        </div>
      )}
    </div>
  );
}
