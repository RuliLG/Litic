import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class VitalsLcpTest extends Test {
    constructor () {
        super('Largest Contentful Paint', 'To provide a good user experience, sites should strive to have Largest Contentful Paint occur within the first 2.5 seconds of the page starting to load.', 'https://web.dev/lcp/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser.getUrl())
        const report = lighthouse.getReport()['largest-contentful-paint']
        this.isValid = report.numericValue <= 2500
        this.comment = `LCP took ${report.displayValue}`
        return this.getResult()
    }
}
