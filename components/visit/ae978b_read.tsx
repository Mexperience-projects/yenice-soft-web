import { OperationType } from "@/lib/types";
import { Calendar, User, Briefcase, Package, CreditCard } from "lucide-react";

interface VisitProps {
  data: OperationType;
}

export default function Visit_ae978b_read({ data }: VisitProps) {
  const { service, items, datetime: datetime, payments } = data;

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Client</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-secondary/10 p-2 rounded-full">
                <Briefcase className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Service</p>
                {/* <p className="font-semibold text-gray-800">{service}</p> */}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-full">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date & Time</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(datetime)}
                </p>
              </div>
            </div>

            {items && (
              <div className="flex items-center gap-3">
                <div className="bg-secondary/10 p-2 rounded-full">
                  <Package className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Items</p>
                </div>
              </div>
            )}

            {payments && (
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-2 rounded-full">
                  <CreditCard className="h-5 w-5 text-secondary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Payments</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
