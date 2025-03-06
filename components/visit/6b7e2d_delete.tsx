import type { visit_ae978bType } from "@/hooks/visit/ae978b";
import { AlertTriangle } from "lucide-react";

interface VisitProps {
  visit: visit_ae978bType;
}

export default function Visit_6b7e2d_delete({ visit }: VisitProps) {
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-error">
        <AlertTriangle className="h-6 w-6" />
        <h3 className="text-lg font-semibold">
          Are you sure you want to delete this visit?
        </h3>
      </div>

      <div className="bg-base-200 p-4 rounded-lg">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="text-sm font-medium text-muted">Client:</p>
            <p className="font-semibold">{visit.client}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted">Service:</p>
            <p className="font-semibold">{visit.service}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted">Date & Time:</p>
            <p className="font-semibold">{formatDate(visit.datetime)}</p>
          </div>

          {visit.items && (
            <div>
              <p className="text-sm font-medium text-muted">Items:</p>
              <p className="font-semibold">{visit.items}</p>
            </div>
          )}

          {visit.payments && (
            <div>
              <p className="text-sm font-medium text-muted">Payments:</p>
              <p className="font-semibold">{visit.payments}</p>
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-error">This action cannot be undone.</p>

      {/* Hidden field for the visit ID */}
      <input type="hidden" name="id" value={visit.id} />
    </div>
  );
}
