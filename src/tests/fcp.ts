import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class FcpTest extends Test {
    constructor () {
        super('First Contentful Paint', 'To provide a good user experience, sites should strive to have First Contentful Paint occur within 1 second of the page starting to load.', 'https://web.dev/fcp/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser.getUrl())
        const report = lighthouse.getReport()['first-contentful-paint']
        this.isValid = report.numericValue <= 1000
        this.comment = `FCP took ${report.displayValue}`
        return this.getResult()
    }
}
