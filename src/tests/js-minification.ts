import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class JsMinificationTest extends Test {
    constructor () {
        super('Minified JS', 'Minifying JavaScript files can reduce payload sizes and script parse time.', 'https://web.dev/unminified-javascript/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['unminified-javascript']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
