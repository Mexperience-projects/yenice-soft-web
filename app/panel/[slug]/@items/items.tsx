"use client";

import { items_691d50Type, useItems_691d50 } from "@/hooks/items/691d50";
import Items_691d50_create from "@/components/items/691d50_create";
import Items_691d50_update from "@/components/items/691d50_update";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import type { ItemsType } from "@/lib/types";
import { Plus, RefreshCw, User } from "lucide-react";

export default function ItemsPage() {
  const {
    get_items_list_list,
    create_items_data,
    update_items_data,
    delete_items_data,
    items_list,
  } = useItems_691d50();
  console.log(items_list);

  const [createModal, setCreateModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<items_691d50Type | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setIsLoading(true);
    await get_items_list_list();
    setIsLoading(false);
  };

  const handleUpdateClick = (item: items_691d50Type) => {
    setSelectedItem(item);
    setUpdateModal(true);
  };

  const handleDeleteClick = (item: items_691d50Type) => {
    setSelectedItem(item);
    setDeleteModal(true);
  };

  const handleCreateSubmit = async (formData: FormData) => {
    await create_items_data(formData);
    setCreateModal(false);
    loadItems();
  };

  const handleUpdateSubmit = async (formData: FormData) => {
    if (selectedItem) {
      formData.append("id", selectedItem.id?.toString() || "");
      await update_items_data(formData);
      setUpdateModal(false);
      loadItems();
    }
  };

  const handleDeleteSubmit = async () => {
    if (selectedItem) {
      setDeleteModal(false);
      delete_items_data(selectedItem.id);
      loadItems();
    }
  };

  return (
    <div className="bg-gray-50 mx-auto p-4 min-h-screen">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 ">
          <div className="bg-white rounded-lg shadow-sm p-4 flex justify-between items-center">
            <div className="flex-1">
              <h2 className="text-sm font-medium text-gray-500">
                Total Visits
              </h2>
              <div className="mt-2 flex items-baseline">
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <p className="text-xs text-gray-500 mt-1">Active visit records</p>
            </div>
            <div className="flex items-center justify-center bg-blue-100 rounded-full p-3">
              <User className="h-6 w-6 text-blue-600" />
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
        <div className="bg-base-100 rounded-lg shadow-md p-3 md:p-4">
          <div className="flex flex-row justify-between">
            <h1 className="text-lg md:text-xl font-bold text-primary mb-3 md:mb-4">
              Items Management
            </h1>
            <div className="flex items-center gap-2">
              <span className="mr-2 text-gray-600">View:</span>
              <button
                onClick={() => setCreateModal(true)}
                className="btn btn-primary btn-sm"
              >
                <Plus className="h-4 w-4" />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="overflow-x-auto bg-base-100 shadow-md">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Count</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items_list.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    {isLoading ? (
                      <span className="loading loading-spinner loading-md"></span>
                    ) : (
                      "No items found. Add a new item to get started."
                    )}
                  </td>
                </tr>
              ) : (
                items_list.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>{item.count}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateClick(item)}
                          className="btn btn-sm btn-info"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          className="btn btn-sm btn-error"
                        >
                          Delete
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
      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)}>
        <div className="p-4">
          <h3 className="font-bold text-lg mb-4">Add New Item</h3>
          <form action={handleCreateSubmit}>
            <Items_691d50_create />
            <div className="modal-action mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setCreateModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Item
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Update Modal */}
      {selectedItem && (
        <Modal isOpen={updateModal} onClose={() => setUpdateModal(false)}>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4">
              Edit Item: {selectedItem.name}
            </h3>
            <form action={handleUpdateSubmit}>
              <Items_691d50_update item={selectedItem} />
              <div className="modal-action mt-6">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setUpdateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Item
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {selectedItem && (
        <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
          <div className="p-4">
            <h3 className="font-bold text-lg mb-4">Delete Item</h3>
            <div className="modal-action mt-6">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => {
                  setDeleteModal(false);
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-error"
                onClick={handleDeleteSubmit}
              >
                Delete Item
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
