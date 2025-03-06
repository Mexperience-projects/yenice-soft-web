import type { PersonelType } from "@/lib/types";

interface PersonnelUpdateProps {
  data: PersonelType;
}

export default function Personel_e02ed2_update({ data }: PersonnelUpdateProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Full Name</span>
        </label>
        <input
          type="text"
          name="name"
          defaultValue={data?.name || ""}
          placeholder="Enter full name"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Position</span>
        </label>
        <input
          type="text"
          name="position"
          defaultValue={data?.position || ""}
          placeholder="Enter position"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Department</span>
        </label>
        <select
          name="department"
          className="select select-bordered w-full"
          defaultValue={data?.department || ""}
          required
        >
          <option value="" disabled>
            Select department
          </option>
          <option value="Engineering">Engineering</option>
          <option value="Product">Product</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Sales">Sales</option>
          <option value="HR">HR</option>
        </select>
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          defaultValue={data?.email || ""}
          placeholder="Enter email address"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Phone</span>
        </label>
        <input
          type="tel"
          name="phone"
          defaultValue={data?.phone || ""}
          placeholder="Enter phone number"
          className="input input-bordered w-full"
          required
        />
      </div>

      <div className="form-control w-full">
        <label className="label">
          <span className="label-text">Hire Date</span>
        </label>
        <input
          type="date"
          name="hireDate"
          defaultValue={data?.hireDate || ""}
          className="input input-bordered w-full"
          required
        />
      </div>
    </div>
  );
}
