"use client";

import { useVisit_ae978b, type visit_ae978bType } from "@/hooks/visit/ae978b";
import Visit_ae978b_read from "@/components/visit/ae978b_read";
import { useEffect, useState } from "react";
import { useVisit_6b7e2d } from "@/hooks/visit/6b7e2d";
import Visit_6b7e2d_update from "@/components/visit/6b7e2d_update";
import Visit_6b7e2d_delete from "@/components/visit/6b7e2d_delete";
import { Modal } from "@/components/ui/modal";
import Visit_ae978b_create from "@/components/visit/ae978b_create";
import { PlusCircle, Users, FileEdit, Trash2 } from "lucide-react";

export default function VisitManagement() {
  const { get_visit_list_list, create_visit_data, visit_list } =
    useVisit_ae978b();
  const { update_visit_data, delete_visit_data, visit_data } =
    useVisit_6b7e2d();

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

  const handleCreateSubmit = async (formData: FormData) => {
    await create_visit_data(formData);
    setIsCreateModalOpen(false);
    get_visit_list_list(); // Refresh the list
  };

  const handleUpdateSubmit = async (formData: FormData) => {
    if (selectedVisit) {
      await update_visit_data(formData);
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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Visit Management</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Add New Visit
        </button>
      </div>

      {/* Visit List */}
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Client</th>
              <th>Service</th>
              <th>Date & Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {visit_list.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-4">
                  No visits found. Create a new visit to get started.
                </td>
              </tr>
            ) : (
              visit_list.map((visit, index) => (
                <tr key={index} className="hover">
                  <td>{visit.client}</td>
                  <td>{visit.service}</td>
                  <td>{formatDate(visit.datetime)}</td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedVisit(visit);
                        setIsViewModalOpen(true);
                      }}
                      className="btn btn-sm btn-circle btn-ghost"
                      title="View Details"
                    >
                      <Users className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVisit(visit);
                        setIsUpdateModalOpen(true);
                      }}
                      className="btn btn-sm btn-circle btn-ghost"
                      title="Edit Visit"
                    >
                      <FileEdit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedVisit(visit);
                        setIsDeleteModalOpen(true);
                      }}
                      className="btn btn-sm btn-circle btn-ghost text-error"
                      title="Delete Visit"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create Visit Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Create New Visit</h2>
          <form action={handleCreateSubmit}>
            <Visit_ae978b_create />
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Visit
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* View Visit Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Visit Details</h2>
          {selectedVisit && <Visit_ae978b_read data={selectedVisit} />}
          <div className="flex justify-end mt-4">
            <button
              className="btn btn-primary"
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
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Update Visit</h2>
          <form action={handleUpdateSubmit}>
            {selectedVisit && <Visit_6b7e2d_update visit={selectedVisit} />}
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
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
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Delete Visit</h2>
          {selectedVisit && <Visit_6b7e2d_delete visit={selectedVisit} />}
          <form action={handleDeleteSubmit}>
            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-error">
                Confirm Delete
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
