export interface ServicesType {
  id: number;
  name: string;
  price: number;
  description: string;
  personel: PersonelType[];
  items: Service_itemsType[];
}

export interface PersonelPayments {
  id: number;
  price: number;
  date: Date;
}

export interface PersonelType {
  author_id: number;
  description: string;
  expense: number;
  id: number;
  itemsPrice: number;
  name: string;
  paid: number;
  payments: PersonelPayments[];
  precent: number;
  revenue: number;
  visitCount: number;
  doctorExpense: number;
  services: ServicesType[];
}

export interface UsersType {
  id: number;
  username: string;
  password?: string;
  permissions?: string[];
}

export interface OperationType {
  id: number;
  service: ServicesType[];
  datetime: Date;
  items: Visit_itemType[];
  payments: PaymentsType[];
  personel?: PersonelType;
  extraPrice?: number;
  discount?: number;
}

export interface VisitType {
  id: number;
  client: ClientType;
  operations: OperationType[];
}

export interface ClientType {
  id: number;
  name: string;
  nationalCo: string;
  birthdate: Date;
  gender: number;
  phone?: string;
}

export interface ItemsType {
  id: number;
  item: number;
  name: string;
  price: number;
  count: number;
  limit: number;
  used: number;
}

export interface Service_itemsType {
  id: number;
  item: ItemsType;
  service: number[];
  count: number;
}

export interface Visit_itemType {
  id: number;
  count: number;
  item: ItemsType;
  visit: number;
}

export enum PAYMENT_TYPE {
  credit_card,
  debit_card,
  cash_pay,
  card_to_card,
}

export const PAYMENT_TYPE2text: Record<PAYMENT_TYPE, string> = {
  [PAYMENT_TYPE.credit_card]: "credit_card",
  [PAYMENT_TYPE.debit_card]: "debit_card",
  [PAYMENT_TYPE.cash_pay]: "cash_pay",
  [PAYMENT_TYPE.card_to_card]: "card_to_card",
};

export interface Visit_paymentType {
  id: number;
  visit: number[];
  price: number;
  paid: boolean;
  type: PAYMENT_TYPE;
}

export interface PaymentsType {
  id: number;
  personel_id?: PersonelType["id"][];
  price: number;
  date: Date;
  paid: boolean;
  visit?: VisitType;
  client?: ClientType;
  description: string;
  type: PAYMENT_TYPE;
}

export enum USER_PERMISSIONS {
  ANALYSES = "analyse",
  VISITS = "visits",
  PERSONELS = "personels",
  INVENTORY = "inventory",
  SERVICES = "services",
  PAYMENTS = "payments",
  CLIENTS = "clients",
  USERS = "users",
}
