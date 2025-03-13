"use client";

import { type items_691d50Type, useItems_691d50 } from "@/hooks/items/691d50";
import Items_691d50_create from "@/components/items/691d50_create";
import Items_691d50_update from "@/components/items/691d50_update";
import { Modal } from "@/components/ui/modal";
import { useEffect, useState } from "react";
import {
  Plus,
  RefreshCw,
  Package,
  ShoppingCart,
  AlertCircle,
  Edit,
  Trash2,
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ItemsPage() {
  const { t } = useTranslation();

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
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="inline-block w-2 h-8 bg-gradient-to-b from-primary to-secondary rounded-full mr-3"></span>
            {t("inventory.title")}
          </h1>
          <p className="text-gray-600 ml-5">{t("inventory.subtitle")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("inventory.totalItems")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-secondary">
                    {items_list.length}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("inventory.itemsInInventory")}
                </p>
              </div>
              <div className="flex items-center justify-center bg-secondary/10 rounded-full p-3">
                <Package className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("inventory.totalValue")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-primary">
                    $
                    {items_list
                      .reduce(
                        (total, item) => total + item.price * item.count,
                        0
                      )
                      .toFixed(2)}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("inventory.inventoryValue")}
                </p>
              </div>
              <div className="flex items-center justify-center bg-primary/10 rounded-full p-3">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 hover:shadow-md transition-all duration-300">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-medium text-gray-500">
                  {t("inventory.lastUpdated")}
                </h2>
                <div className="mt-2">
                  <p className="text-3xl font-bold text-gray-700">
                    {t("inventory.justNow")}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {t("inventory.inventoryUpToDate")}
                </p>
              </div>
              <button
                onClick={loadItems}
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
                {t("inventory.inventoryItems")}
              </h2>

              <button
                onClick={() => setCreateModal(true)}
                className="btn bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all duration-300"
              >
                <Plus className="h-4 w-4" />
                <span>{t("inventory.addNewItem")}</span>
              </button>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-4 font-medium">
                    {t("common.name")}
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    {t("common.price")}
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium">
                    {t("common.count")}
                  </th>
                  <th scope="col" className="px-6 py-4 font-medium text-right">
                    {t("common.actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {items_list.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center">
                      {isLoading ? (
                        <div className="flex justify-center items-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <div className="bg-gray-100 p-3 rounded-full mb-3">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-gray-500 font-medium">
                            {t("inventory.noItemsFound")}
                          </p>
                          <p className="text-gray-400 text-sm mt-1">
                            {t("inventory.addItemToStart")}
                          </p>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  items_list.map((item, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            item.count > 10
                              ? "bg-green-100 text-green-800"
                              : item.count > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.count}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleUpdateClick(item)}
                            className="px-3 py-1.5 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Edit className="h-3.5 w-3.5" />
                            {t("common.edit")}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(item)}
                            className="px-3 py-1.5 bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            {t("common.delete")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          {items_list.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {t("common.showing")}{" "}
                <span className="font-medium">{items_list.length}</span>{" "}
                {t("inventory.itemsInInventory")}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)}>
        <div className="p-6 w-96">
          <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
            <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
            {t("inventory.addNewItem")}
          </h3>
          <form action={handleCreateSubmit}>
            <Items_691d50_create />
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
                onClick={() => setCreateModal(false)}
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
              >
                {t("inventory.saveItem")}
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Update Modal */}
      {selectedItem && (
        <Modal isOpen={updateModal} onClose={() => setUpdateModal(false)}>
          <div className="p-6  w-96">
            <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
              <span className="inline-block w-1.5 h-6 bg-gradient-to-b from-primary to-secondary rounded-full mr-2"></span>
              {t("inventory.editItem")}: {selectedItem.name}
            </h3>
            <form action={handleUpdateSubmit}>
              <Items_691d50_update item={selectedItem} />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all duration-300"
                  onClick={() => setUpdateModal(false)}
                >
                  {t("common.cancel")}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-primary to-secondary rounded-lg hover:from-primary/90 hover:to-secondary/90 transition-all duration-300"
                >
                  {t("common.update")}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {selectedItem && (
        <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
          <div className="p-6">
            <div className="flex items-center justify-center mb-4 text-red-500">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-gray-800 text-center">
              {t("inventory.deleteItem")}
            </h3>
            <p className="text-gray-600 text-center mb-6">
              {t("inventory.deleteItemConfirm")}
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
                onClick={handleDeleteSubmit}
              >
                {t("common.delete")}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
