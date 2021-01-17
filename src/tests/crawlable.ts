import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class CrawlableTest extends Test {
    constructor () {
        super('Page is crawlable', 'Page is visible to web crawlers.', 'https://web.dev/is-crawable/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser.getUrl())
        const report = lighthouse.getReport()['is-crawlable']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
