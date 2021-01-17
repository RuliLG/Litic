import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class CssMinificationTest extends Test {
    constructor () {
        super('Minified CSS', 'Minifying CSS files can reduce network payload sizes.', 'https://web.dev/unminified-css/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['unminified-css']
        this.isValid = report.score === 1
        return this.getResult()
    }
}