import type { ItemsType } from "@/lib/types";

interface ItemsProps {
  data: ItemsType;
}

export default function Items_691d50_read({ data }: ItemsProps) {
  const { name, price, count } = data;

  return (
    <div className="card bg-base-100 shadow-sm">
      <div className="card-body p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-base-content/70">Name</h3>
            <p className="text-base-content">{name}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-base-content/70">
              Price
            </h3>
            <p className="text-base-content">${price.toFixed(2)}</p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-base-content/70">
              Count
            </h3>
            <p className="text-base-content">{count}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
