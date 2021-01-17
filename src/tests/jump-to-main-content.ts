import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class JumpToMainContentTest extends Test {
    constructor () {
        super('Jump to Main Content', 'Page must provide a way to skip content that is repeated on pages across your site.', 'https://web.dev/bypass/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser.getUrl())
        const report = lighthouse.getReport()['bypass']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
