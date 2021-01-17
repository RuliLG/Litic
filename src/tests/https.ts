import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class HttpsTest extends Test {
    constructor () {
        super('HTTPS', 'Website is loaded through HTTPS and it has no mixed content.', 'https://web.dev/is-on-https/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser.getUrl())
        const report = lighthouse.getReport()['is-on-https']
        this.isValid = report.score === 1
        return this.getResult()
    }
}