import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class AppleTouchIconTest extends Test {
    constructor () {
        super('Apple Touch Icon', 'Provide an icon in case iPhone or iPad users add your website to their home screen.', 'https://cutt.ly/wjP7EnO')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Warning
    }

    getImportance (): Importance {
        return Importance.Low
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['apple-touch-icon']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
