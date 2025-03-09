import { useTranslation } from "react-i18next";

type ItemsProps = {};

export default function Items_691d50_create({}: ItemsProps) {
  const { t } = useTranslation();

  return (
    <div className="grid gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">{t("common.name")}</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder={t("inventory.enterItemName")}
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
            placeholder="0.00"
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
          placeholder="0"
          className="input input-bordered w-full"
          required
        />
      </div>
    </div>
  );
}
