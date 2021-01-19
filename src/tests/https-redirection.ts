import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class HttpsRedirectionTest extends Test {
    constructor () {
        super('HTTPS Redirection', 'Make sure that you redirect all HTTP traffic to HTTPS in order to enable secure web features for all your users.', 'https://cutt.ly/GjP5d4q')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['redirects-http']
        this.isValid = report.score === 1
        return this.getResult()
    }
}