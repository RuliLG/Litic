import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class FontSizeTest extends Test {
    constructor () {
        super('Font size is greater than 12px', 'At least the 60% of the page text must be greater than 12px.', 'https://cutt.ly/PjAryN8')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['font-size']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
