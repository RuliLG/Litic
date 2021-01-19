import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class ColorContrastTest extends Test {
    constructor () {
        super('Color Contrast', 'Low-contrast text is difficult or impossible for many users to read.', 'https://cutt.ly/ejP7OUc')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['color-contrast']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
