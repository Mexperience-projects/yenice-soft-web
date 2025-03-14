"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ItemsType } from "@/lib/types";

interface LowStockAlertProps {
  items: ItemsType[];
}

export function LowStockAlert({ items }: LowStockAlertProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter items that are low in stock (count less than limit)
  const lowStockItems = items.filter((item) => item.count < (item.limit || 10));

  // Auto-close the alert panel after some time if there are no interactions
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isOpen) {
      timer = setTimeout(() => {
        setIsOpen(false);
      }, 30000); // Auto-close after 30 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isOpen]);

  if (lowStockItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className="relative">
        <button
          className="btn btn-circle btn-error animate-pulse relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <AlertTriangle className="h-5 w-5 text-white" />
          <span className="absolute -top-2 -right-2 bg-white text-error text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border border-error">
            {lowStockItems.length}
          </span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl z-50 border border-error/20 overflow-hidden">
            <div className="bg-error/10 p-3 border-b border-error/20">
              <h3 className="font-bold text-error flex items-center">
                <AlertTriangle className="h-4 w-4 mr-2" />
                {t("inventory.lowStockWarning")}
              </h3>
            </div>
            <div className="max-h-60 overflow-y-auto">
              {/* Show only the first 2 items */}
              {lowStockItems.slice(0, 2).map((item) => (
                <div
                  key={item.id}
                  className="p-3 border-b border-gray-100 hover:bg-error/5"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-error font-bold">
                      {item.count} / {item.limit || 10}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {t("inventory.itemPrice")}: ₺{item.price}
                  </div>
                </div>
              ))}

              {lowStockItems.length > 2 && (
                <div className="p-3 text-center">
                  <button
                    className="btn btn-sm btn-error btn-outline gap-2"
                    onClick={() => {
                      setIsModalOpen(true);
                      setIsOpen(false);
                    }}
                  >
                    {t("common.seeMore")}
                    <ExternalLink className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
            <div className="p-3 bg-gray-50 text-center">
              <button
                className="text-sm text-error hover:underline"
                onClick={() => setIsOpen(false)}
              >
                {t("common.close")}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Full Modal for all low stock items */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-xl flex items-center text-error">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {t("inventory.lowStockItems")}
            </h3>
            <p className="py-2 text-base-content/70">
              {t("inventory.lowStockDescription")}
            </p>

            <div className="overflow-x-auto mt-4">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>{t("inventory.itemName")}</th>
                    <th>{t("inventory.itemPrice")}</th>
                    <th className="text-right">
                      {t("inventory.currentStock")}
                    </th>
                    <th className="text-right">
                      {t("inventory.minimumRequired")}
                    </th>
                    <th className="text-right">{t("inventory.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockItems.map((item) => {
                    const percentage = Math.round(
                      (item.count / (item.limit || 10)) * 100
                    );
                    let statusClass = "text-error font-bold";
                    if (percentage > 50)
                      statusClass = "text-warning font-medium";

                    return (
                      <tr key={item.id}>
                        <td className="font-medium">{item.name}</td>
                        <td>₺{item.price}</td>
                        <td className="text-right">{item.count}</td>
                        <td className="text-right">{item.limit || 10}</td>
                        <td className="text-right">
                          <span className={statusClass}>{percentage}%</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="modal-action">
              <button
                className="btn bg-gradient-to-r from-primary to-secondary text-white border-none hover:opacity-90"
                onClick={() => setIsModalOpen(false)}
              >
                {t("common.close")}
              </button>
            </div>
          </div>
          <div
            className="modal-backdrop"
            onClick={() => setIsModalOpen(false)}
          ></div>
        </div>
      )}
    </>
  );
}
