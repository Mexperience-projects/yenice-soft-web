"use client";

import type { items_691d50Type } from "@/hooks/items/691d50";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

interface ItemsProps {
  item: items_691d50Type;
}

export default function Items_691d50_update({ item }: ItemsProps) {
  const { t } = useTranslation();

  const nameRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const countRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (nameRef.current) nameRef.current.value = item.name;
    if (priceRef.current) priceRef.current.value = item.price.toString();
    if (countRef.current) countRef.current.value = item.count.toString();
    if (idRef.current) idRef.current.value = item.count.toString();
  }, [item]);

  return (
    <div className="grid gap-4">
      <input type="hidden" name="id" ref={idRef} />
      <div className="form-control">
        <label className="label">
          <span className="label-text">{t("common.name")}</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          ref={nameRef}
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">{t("common.price")}</span>
        </label>
        <div className="input-group">
          <span>$</span>
          <input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            ref={priceRef}
            className="input input-bordered w-full"
            required
          />
        </div>
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">{t("common.count")}</span>
        </label>
        <input
          id="count"
          name="count"
          type="number"
          min="0"
          ref={countRef}
          className="input input-bordered w-full"
          required
        />
      </div>
    </div>
  );
}
