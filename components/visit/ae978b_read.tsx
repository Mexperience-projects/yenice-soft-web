import type { visit_ae978bType } from "@/hooks/visit/ae978b";
import { Calendar, User, Briefcase, Package, CreditCard } from "lucide-react";
import { useTranslation } from "react-i18next";

interface VisitProps {
  data: visit_ae978bType;
}

export default function Visit_ae978b_read({ data }: VisitProps) {
  const { t } = useTranslation();
  const { client, service, items, datetime, payments } = data;

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="card bg-base-100">
      <div className="card-body p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted">
                  {t("visits.client")}
                </p>
                <p className="font-semibold">{client.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted">
                  {t("visits.service")}
                </p>
                <p className="font-semibold">{service}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted">
                  {t("visits.dateTime")}
                </p>
                <p className="font-semibold">{formatDate(datetime)}</p>
              </div>
            </div>

            {items && (
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted">
                    {t("inventory.inventoryItems")}
                  </p>
                  <p className="font-semibold">{items}</p>
                </div>
              </div>
            )}

            {payments && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-muted">
                    {t("payments.title")}
                  </p>
                  {/* <p className="font-semibold">{payments}</p> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
