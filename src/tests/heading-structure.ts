import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class HeadingStructureTest extends Test {
    constructor () {
        super('Heading structure', 'Page heading elements should follow a logical, numerical order that reflects the structure of your content.', 'https://web.dev/heading-order/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser.getUrl())
        const report = lighthouse.getReport()['heading-order']
        this.isValid = report.score === 1

        return this.getResult()
    }
}
