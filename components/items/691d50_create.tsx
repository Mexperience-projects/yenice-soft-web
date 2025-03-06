type ItemsProps = {};

export default function Items_691d50_create({}: ItemsProps) {
  return (
    <div className="grid gap-4">
      <div className="form-control">
        <label className="label">
          <span className="label-text">Item Name</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter item name"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Price</span>
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
          <span className="label-text">Count</span>
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
