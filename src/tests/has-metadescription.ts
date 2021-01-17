import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class HasMetadescriptionTest extends Test {
    constructor () {
        super('meta[name="description"]', 'Provide a summary of the page content so that search engines can include it in search results.', 'https://web.dev/meta-description/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['meta-description']
        this.isValid = report.score === 1

        return this.getResult()
    }
}
