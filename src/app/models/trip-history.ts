import { Entity } from './Entity.model';

export class TripHistory extends Entity {
    tripTitleid: String;
    tripTitle: String ;
    tripDescription: String;
    tripNumVisit: number;
    tripVisitFrecuency: number;
}
