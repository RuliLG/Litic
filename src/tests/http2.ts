import { Test } from '../classes/test'
import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'
import { LighthouseService } from '../services/lighthouse.service'

export class Http2Test extends Test {
    constructor () {
        super('HTTP/2', 'HTTP/2 serves your page\'s resources faster and with less data moving over the wire.', 'https://cutt.ly/3jP5sO2')
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

        // PageSpeed API does not provide this result, so we will check
        // if the result exists. If not, we will run a script on Puppeteer
        // to check if page is running through http2
        if (report) {
            this.isValid = report.score === 1
        } else {
            try {
                const protocol = (await this.browser!.evaluate(() => {
                    return performance.getEntriesByType('navigation')[0].toJSON()
                })).nextHopProtocol
                this.isValid = protocol === 'h2'
            } catch (e) {
                console.log(e)
            }
        }

        return this.getResult()
    }
}