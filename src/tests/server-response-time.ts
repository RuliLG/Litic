import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class ServerResponseTimeTest extends Test {
    constructor () {
        super('Server Response Time', 'Developers should aim to a ~100ms server response.', 'https://cutt.ly/ojP5cGB')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['server-response-time']
        this.isValid = report.numericValue <= 150
        this.comment = `Server Response Time: ${parseInt(report.numericValue, 10)}ms`
        return this.getResult()
    }
}
