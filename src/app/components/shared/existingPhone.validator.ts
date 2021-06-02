import { AsyncValidatorFn, AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from '../../../../node_modules/rxjs';
import { ActorService } from '../../services/actor.service';
import { AuthService } from 'src/app/services/auth.service';

// Método que comprueba el valor del campo, si existe algún usuario con ese teléfono devuelve un error de mensaje, sino devuelve null
export function existingPhoneNumValidator(actorService: ActorService, authService: AuthService): AsyncValidatorFn {
    return (control: AbstractControl): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return actorService.getUsersByPhoneNumber(control.value).then(
            users => {
                if (users.length > 0 && users[0] ) {
                    console.log('user back-end: ', users[0]);
                    console.log('user front-end: ', authService.getCurrentActor());
                    if (users[0].id !==  authService.getCurrentActor().id) {
                        return {'phoneNumExists': true };
                    } else {
                        return null;
                    }
                } else {
                    return null;
                }
            }
        );
    };
}
