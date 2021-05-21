import { Entity } from './Entity.model';

export class Warehouse extends Entity {
    avg: number;
    min: number;
    max: number;
    stanDes: number;
    ratio: number;
    id: string;
}
