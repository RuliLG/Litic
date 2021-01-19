import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { LighthouseService } from "../services/lighthouse.service";

export class ImageAltTest extends Test {
    constructor () {
        super('Image Alternative Text', 'Informative images must have a short [alt]. Descriptive images can have an empty [alt].', 'https://cutt.ly/NjAwG2u')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['image-alt']
        this.isValid = report.score === 1
        return this.getResult()
    }
}