"use client";

import { usePayments } from "@/hooks/payments/main";
import Payments_ae978b_read from "@/components/payments/ae978b_read";
import { useEffect, useState } from "react";
import Payments_6b7e2d_update from "@/components/payments/6b7e2d_update";
import { Modal } from "@/components/ui/modal";
import Payments_ae978b_create from "@/components/payments/ae978b_create";
import {
  PlusCircle,
  Users,
  FileEdit,
  Trash2,
  RefreshCw,
  Plus,
} from "lucide-react";

export default function PaymentsManagement() {
  const { get_payments_list_list, create_payments_data, payments_list } =
    usePayments();

  const [selectedPayments, setSelectedPayments] = useState<PaymentItem>();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    get_payments_list_list();
  }, []);

  const handleUpdateSubmit = async (formData: FormData) => {
    if (selectedPayments) {
      // await update_payments_data(formData);
      setIsUpdateModalOpen(false);
      setSelectedPayments(undefined);
      get_payments_list_list(); // Refresh the list
    }
  };

  const handleDeleteSubmit = async (formData: FormData) => {
    if (selectedPayments) {
      //   await delete_payments_data(formData as any)
      setIsDeleteModalOpen(false);
      setSelectedPayments(undefined);
      get_payments_list_list(); // Refresh the list
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
                Total Paymentss
              </h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-blue-600">
                  {payments_list.length}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Active payments records
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
      </div>

      {/* Update Payments Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Update Payments
          </h2>
          <form action={create_payments_data}>
            <Payments_ae978b_create />
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
                Create Payments
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Delete Payments Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Delete Payments
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
