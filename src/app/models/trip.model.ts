import { Entity } from './Entity.model'; 

export class Trip extends Entity{ 
    ticker: String;
    detalles: String;
    cancelled_reason: String;
    title: String;
    cancelationMoment: String;
    description: String;
    price: Number;
    picture: String;
    list_requirements: String [];
    status: String;
    date_start: Date;
    date_end: Date;
    published: Boolean;
    created: Date;
}
