export default function Personel_e02ed2_create() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          type="text"
          name="name"
          placeholder="Enter full name"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <input
          type="text"
          name="position"
          placeholder="Enter position"
          className="input input-bordered w-full"
          required
        />
      </div>
    </div>
  );
}
