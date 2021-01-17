import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class Http2Test extends Test {
    constructor () {
        super('HTTP/2', 'HTTP/2 serves your page\'s resources faster and with less data moving over the wire.', 'https://developers.google.com/web/fundamentals/performance/http2/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['uses-http2']
        this.isValid = report.score === 1
        return this.getResult()
    }
}