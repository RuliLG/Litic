import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class RelNoopenerTest extends Test {
    constructor () {
        super('External links use [rel="noopener"] or [rel="noreferrer"]', 'When you link to a page on another site using the target="_blank" attribute, you can expose your site to performance and security issues.', 'https://web.dev/external-anchors-use-rel-noopener/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['external-anchors-use-rel-noopener']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
