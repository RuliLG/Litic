import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class TextCompressionTest extends Test {
    constructor () {
        super('Uses Text Compression', 'Text-based resources should be served with compression to minimize total network bytes.', 'https://web.dev/uses-text-compression/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['uses-text-compression']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
