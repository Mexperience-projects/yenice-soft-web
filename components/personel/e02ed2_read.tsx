import type { PersonelType } from "@/lib/types";

interface PersonnelReadProps {
  data: PersonelType;
}

export default function Personel_e02ed2_read({ data }: PersonnelReadProps) {
  return (
    <div className="space-y-2">
      <h2 className="card-title text-primary">{data.name}</h2>
      <div className="badge badge-secondary">{data.position}</div>
      <div className="text-sm space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">Department:</span>
          <span className="badge badge-outline">{data.department}</span>
        </div>
        <p>
          <span className="font-medium">Email:</span> {data.email}
        </p>
        <p>
          <span className="font-medium">Phone:</span> {data.phone}
        </p>
        <p>
          <span className="font-medium">Hire Date:</span> {data.hireDate}
        </p>
        {data.address && (
          <p>
            <span className="font-medium">Address:</span> {data.address}
          </p>
        )}
        {data.salary && (
          <p>
            <span className="font-medium">Salary:</span> {data.salary}
          </p>
        )}
      </div>
    </div>
  );
}
