import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { EmailValidator } from "../validators/email-validator";

export class PlainTextEmailsTest extends Test {
    constructor () {
        super('No plain text emails', 'Avoid displaying plain text emails to prevent email address harvesting.', 'https://seositecheckup.com/tools/plaintext-emails-test')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Warning
    }

    getImportance (): Importance {
        return Importance.Low
    }

    async test (): Promise<Result> {
        const html = await this.browser!.getHtml()
        const hasEmails = (new EmailValidator()).isValid(html)
        this.isValid = !hasEmails
        return this.getResult()
    }
}
