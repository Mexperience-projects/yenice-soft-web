import type { DateRange } from "react-day-picker";
import type {
  PersonelType,
  ServicesType,
  VisitType,
  Visit_itemType,
  PaymentsType,
} from "@/lib/types";

export interface PersonnelWithMetrics extends PersonelType {
  visitCount: number;
  itemCount: number;
  revenue: number;
  expense: number;
  services: ServicesType[];
  visits: VisitType[];
  visitItems: Visit_itemType[];
  payments: PaymentsType[];
}

export interface FilterProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  selectedService: string;
  setSelectedService: (service: string) => void;
  services_list: ServicesType[];
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFilters: number;
  resetFilters: () => void;
  applyFilters: () => void;
}

export interface SummaryCardsProps {
  totalVisits: number;
  totalItems: number;
  totalRevenue: number;
  totalPersonnelPayments: number;
}

export interface PersonnelTableProps {
  personnelWithMetrics: PersonnelWithMetrics[];
  filteredPersonnel: PersonelType[];
  personel_list: PersonelType[];
  onPersonnelClick: (person: PersonnelWithMetrics) => void;
}

export interface PersonnelModalProps {
  selectedPersonnel: PersonnelWithMetrics | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  visit_list: VisitType[];
} 