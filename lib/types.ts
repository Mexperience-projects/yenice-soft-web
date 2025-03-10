export interface ServicesType {
  id: number;
  name: string;
  price: number;
  description: string;
  personel?: PersonelType;
  items: number;
  personel_fixed_fee: number;
  personel_precent_fee: number;
}

export interface PersonelType {
  id: number;
  name: string;
  description: string;
  visits: VisitType[];
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

export interface Visit_paymentType {
  id: number;
  visit: number[];
  price: number;
  paid: boolean;
}

export interface PaymentsType {
  id: number;
  personel_id?: PersonelType["id"];
  price: number;
  date: Date;
  paid: boolean;
  visit?: VisitType;
  description: string;
}
