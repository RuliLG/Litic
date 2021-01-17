import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class HreflangTest extends Test {
    constructor () {
        super('Document has a valid hreflang', 'Hreflang links tell search engines the URLs for all the versions of a page so that they can display the correct version for each language or region.', 'https://learn.techseo.blog/using-hreflang-to-handle-multiple-languages')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any).hreflang
        this.isValid = report.score === 1
        return this.getResult()
    }
}
