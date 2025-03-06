export interface ServicesType {
    name: string;
    price: number;
    description: string;
    personel: number[];
    items: number;
    personel_fixed_fee: number;
    personel_precent_fee: number;
}

export interface PersonelType {
    name: string;
    description: string;
    visits: VisitType[]
}

export interface VisitType {
    client: number[];
    service: number[];
    items: number;
    datetime: Date;
    payments: number;
}

export interface ClientType {
    name: string;
    nationalCo: string;
    birthdate: Date;
    gender: number;
}

export interface ItemsType {
    name: string;
    price: number;
    count: number;
}

export interface Service_itemsType {
    item: number[];
    service: number[];
    count: number;
}

export interface Visit_itemType {
    count: number;
    item: number[];
    visit: number[];
}

export interface Visit_paymentType {
    visit: number[];
    price: number;
    paid: boolean;
}