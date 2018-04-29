import { FormControl } from '@angular/forms';

export class TelefoneValidator {
  static isValid(control: FormControl) {
    const re =/^(\([0-9]{2}\))\s([9]{1})?([0-9]{4})-([0-9]{4})$/.test(
      control.value
    );

    if (re) {
      return null;
    }

    return {
      invalidEmail: true
    };
  }
}