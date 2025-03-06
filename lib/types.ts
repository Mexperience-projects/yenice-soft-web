export interface ServicesType {
    id: number
    name: string;
    price: number;
    description: string;
    personel: number[];
    items: number;
    personel_fixed_fee: number;
    personel_precent_fee: number;
}

export interface PersonelType {
    id: number
    name: string;
    description: string;
    visits: VisitType[]
}

export interface VisitType {
    id: number
    client: number[];
    service: number[];
    items: number;
    datetime: Date;
    payments: number;
}

export interface ClientType {
    id: number
    name: string;
    nationalCo: string;
    birthdate: Date;
    gender: number;
}

export interface ItemsType {
    id: number
    name: string;
    price: number;
    count: number;
}

export interface Service_itemsType {
    id: number
    item: number[];
    service: number[];
    count: number;
}

export interface Visit_itemType {
    id: number
    count: number;
    item: number[];
    visit: number[];
}

export interface Visit_paymentType {
    id: number
    visit: number[];
    price: number;
    paid: boolean;
}