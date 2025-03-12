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
  id: number;
  name: string;
  description: string;
  visits: VisitType[];
  doctorExpense: number;
  payments: PersonelPayments[];
}

export interface UsersType {
  id: number;
  name: string;
  description: string;
  doctorExpense: number;
}

export interface OperationType {
  id: number;
  service: ServicesType[];
  datetime: Date;
  items: Visit_itemType[];
  payments: PaymentsType[];
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
}

export interface ItemsType {
  id: number;
  item: number;
  name: string;
  price: number;
  count: number;
  limit: number;
}

export interface Service_itemsType {
  id: number;
  item: number[];
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

export interface Visit_paymentType {
  id: number;
  visit: number[];
  price: number;
  paid: boolean;
  type: PAYMENT_TYPE;
}

export interface PaymentsType {
  id: number;
  personel_id?: PersonelType["id"];
  price: number;
  date: Date;
  paid: boolean;
  visit?: VisitType;
  description: string;
  type: PAYMENT_TYPE;
}
