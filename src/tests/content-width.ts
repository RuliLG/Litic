import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class ContentWidthTest extends Test {
    constructor () {
        super('Content Width', 'When your page\'s content width is smaller or larger than the viewport width, it may not render correctly on mobile screens.', 'https://cutt.ly/MjP7SPV')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['content-width']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
