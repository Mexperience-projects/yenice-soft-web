"use client";

import { items_691d50Type, useItems_691d50 } from "@/hooks/items/691d50";
import Items_691d50_create from "@/components/items/691d50_create";
import Items_691d50_update from "@/components/items/691d50_update";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import type { ItemsType } from "@/lib/types";
import { Plus, RefreshCw } from "lucide-react";

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
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-primary">Items Management</h1>
        <div className="flex gap-2">
          <button
            onClick={loadItems}
            className="btn btn-outline btn-sm"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
          <button
            onClick={() => setCreateModal(true)}
            className="btn btn-primary btn-sm"
          >
            <Plus className="h-4 w-4" />
            Add New Item
          </button>
        </div>
      </div>

      {/* Items List */}
      <div className="overflow-x-auto bg-base-100 rounded-box shadow-md">
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
