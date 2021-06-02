import { Entity } from './Entity.model'; 

export class Trip extends Entity{ 
    ticker: String;
    detalles: String;
    cancelled_reason: String;
    title: String;
    cancelationMoment: String;
    cancelled: boolean;
    description: String;
    price: Number;
    picture: String;
    list_requirements: String [];
    comments: String [];
    status: String;
    date_start: string;
    date_end: string;
    published: Boolean;
    created: Date;
}
