import { Entity } from './Entity.model';


export class Application extends Entity {
    actorid: number;
    actorname: String;
    tripid: String;
    tripname: String;
    status: String;
    comment: String;
    reject_reason: String;
    if_paid: Boolean;
    validated: Boolean;
    cancelationMoment: Date;
    created: Date;
}
