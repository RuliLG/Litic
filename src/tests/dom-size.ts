import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class DomSizeTest extends Test {
    constructor () {
        super('Reduced DOM Size', 'Avoid an excessive DOM size (> 1500 nodes, depth > 32, more than 60 child nodes).', 'https://cutt.ly/ujP63nD')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['dom-size']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
