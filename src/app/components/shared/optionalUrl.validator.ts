import { AbstractControl } from '@angular/forms';
export function ValidateURLOptional(control: AbstractControl) {
    if (control.value != null) {
            if (!control.value.startsWith('http')) {
                return { validUrl: false };
            }
        } else if (control.value === 'undefined') {
            return { validUrl: true };
        }
        return null;
}
