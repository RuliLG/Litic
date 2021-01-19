import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class VitalsClsTest extends Test {
    constructor () {
        super('Cumulative Layout Shift', 'Avoid sudden layout shifts to improve user-experience. Less than 0.1 is considered valid.', 'https://cutt.ly/gjP5WlB')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['cumulative-layout-shift']
        this.isValid = report.numericValue <= 0.1
        this.comment = `CLS was ${report.displayValue}. Max = 0.1`
        return this.getResult()
    }
}
