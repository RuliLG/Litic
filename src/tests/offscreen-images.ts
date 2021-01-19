import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class OffscreenImagesTest extends Test {
    constructor () {
        super('Lazy-load offscreen images', 'Lazy-load offscreen and hidden images to lower TTI.', 'https://cutt.ly/1jAesfu')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['offscreen-images']
        this.isValid = report.score === 1
        return this.getResult()
    }
}