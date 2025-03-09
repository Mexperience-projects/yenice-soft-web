import type { PersonelType } from "@/lib/types";

interface PersonnelReadProps {
  data: PersonelType;
}

export default function Personel_e02ed2_read({ data }: PersonnelReadProps) {
  return (
    <div className="space-y-2">
      <h2 className="card-title text-primary">{data.name}</h2>
    </div>
  );
}
