import { Test } from '../classes/test'
import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'

export class ContentSniffingTest extends Test {
    constructor () {
        super('Protect against MIME Sniffing', 'Server should return the header `X-Content-Type-Options: "nosniff"`.', 'https://cutt.ly/ZjP7AA9')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Warning
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        const headers = this.browser!.getHeaders()
        this.isValid = headers.hasOwnProperty('x-content-type-options') && headers['x-content-type-options'] === 'nosniff'
        return this.getResult()
    }
}
