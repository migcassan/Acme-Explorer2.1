import { Entity } from './Entity.model';
import { Picture } from './picture.model';

export class Actor extends Entity {

    name: string;
    surname: string;
    email: string;
    password: string;
    address: string;
    preferredLanguage: string;
    phone: string;
    countrycode: string;
    photo: string;
    photoObject: Picture;
    role: string;
    created: string;
    customToken: string;
}
