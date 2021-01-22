import { Test } from '../classes/test'
import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'
import { LighthouseService } from '../services/lighthouse.service'

export class TapTargetsTest extends Test {
    constructor () {
        super('Appropiate size for tap targets', 'Targets must be greater than 48 px by 48 px and further than 8 px apart from each other.', 'https://cutt.ly/xjAeRyi')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['tap-targets']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
