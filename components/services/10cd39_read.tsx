"use client";

import type { ServicesType } from "@/lib/types";

interface ServicesProps {
  data: ServicesType;
  onEdit: () => void;
  onDelete: () => void;
}

export default function Services_10cd39_read({
  data,
  onEdit,
  onDelete,
}: ServicesProps) {
  const {
    name,
    price,
    description,
    personel,
    items,
    personel_fixed_fee,
    personel_precent_fee,
  } = data;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{name}</h3>
        <div className="text-green-600 font-medium">
          {new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(price)}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

      <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
        <div>
          <span className="font-medium">Personnel:</span>{" "}
          {personel?.length || 0}
        </div>
        <div>
          <span className="font-medium">Items:</span> {items || 0}
        </div>
        <div>
          <span className="font-medium">Fixed Fee:</span> ${personel_fixed_fee}
        </div>
        <div>
          <span className="font-medium">Percent Fee:</span>{" "}
          {personel_precent_fee}%
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onEdit}
          className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-700"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
