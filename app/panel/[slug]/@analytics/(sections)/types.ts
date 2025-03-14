import type {
  PersonelType,
  ServicesType,
  VisitType,
  Visit_itemType,
  PaymentsType,
  ClientType,
  PAYMENT_TYPE,
  ItemsType,
} from "@/lib/types";

export interface PersonnelWithMetrics extends PersonelType {
  services: ServicesType[];
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
  personel_list: PersonelType[];
  onPersonnelClick: (person: PersonnelWithMetrics) => void;
  filters: PersonnelFilters;
}

export interface PersonnelModalProps {
  selectedPersonnel: PersonnelWithMetrics | null;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  visit_list: VisitType[];
}

export interface VisitWithStats extends VisitType {
  totalRevenue: number;
  totalPersonnelFee: number;
  netRevenue: number;
  services: ServicesType[];
  personnel: PersonelType[];
  startTime: Date | null;
}

export interface VisitSummaryStats {
  totalRevenue: number;
  totalPersonnelFee: number;
  netRevenue: number;
  totalServices: number;
  uniqueClientIds: Set<ClientType["id"]>;
  uniqueClientCount: number;
}

export interface DateRange {
  from?: string;
  to?: string;
}

export interface TableFilters {
  dateRange: DateRange | undefined;
  searchQuery: string;
}

export interface PersonnelFilters {
  searchQuery: string;
  selectedService: string;
  minRevenue?: number;
  maxRevenue?: number;
  minRemaining?: number;
  maxRemaining?: number;
  dateRange?: {
    from?: string;
    to?: string;
  };
}

export interface InventoryFilters extends TableFilters {
  minStock: number | undefined;
  maxStock: number | undefined;
  showLowStock: boolean;
  sortBy: 'name' | 'stock' | 'usage' | 'revenue';
  sortOrder: 'asc' | 'desc';
}

export interface VisitFilters extends TableFilters {
  selectedService: string;
  selectedPersonnel: string;
  paymentType: PAYMENT_TYPE | 'all';
  minRevenue: number | undefined;
  maxRevenue: number | undefined;
  sortBy: 'date' | 'revenue' | 'personnel_fee' | 'net_revenue';
  sortOrder: 'asc' | 'desc';
}

export interface FilterSectionProps {
  filters: PersonnelFilters | InventoryFilters | VisitFilters;
  onFilterChange: (filters: PersonnelFilters | InventoryFilters | VisitFilters) => void;
  services_list: ServicesType[];
  personel_list?: PersonelType[];
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFilters: number;
  resetFilters: () => void;
  applyFilters: () => void;
  tableType: 'personnel' | 'inventory' | 'visits';
}

export interface InventoryTableProps {
  items_list: ItemsType[];
  visitItems: Visit_itemType[];
  animateIn: boolean;
  filters: InventoryFilters;
}

export interface VisitsTableProps {
  visit_list: VisitType[];
  services_list: ServicesType[];
  personel_list: PersonelType[];
  animateIn: boolean;
  filters: VisitFilters;
} 