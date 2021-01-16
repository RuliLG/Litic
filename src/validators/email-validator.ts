import { Validator } from "./validator";

export class EmailValidator extends Validator {
    isValid (str: string): boolean {
        return /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]{2,}(?:\.[a-zA-Z0-9-]{2,})/gi.test(str)
    }
}