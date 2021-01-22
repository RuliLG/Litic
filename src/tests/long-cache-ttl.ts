import { Test } from '../classes/test'
import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'
import { LighthouseService } from '../services/lighthouse.service'

export class LongCacheTtlTest extends Test {
    constructor () {
        super('Optimized caching strategy', 'Take advantage of an effective HTTP caching strategy to serve static assets.', 'https://cutt.ly/EjP5jMx')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const lighthouse = LighthouseService.get(this.browser!.getUrl())
        const report = (lighthouse.getReport() as any)['uses-long-cache-ttl']
        this.isValid = report.score === 1
        return this.getResult()
    }
}
