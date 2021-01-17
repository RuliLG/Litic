import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class TimeToInteractiveTest extends Test {
    constructor () {
        super('Time to Interactive', 'TTI measures how long it takes a page to become fully interactive.', 'https://web.dev/interactive/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser.getUrl())
        const report = lighthouse.getReport()['interactive']
        this.isValid = report.numericValue <= 3800
        this.comment = `TTI is ${report.displayValue}`
        return this.getResult()
    }
}
