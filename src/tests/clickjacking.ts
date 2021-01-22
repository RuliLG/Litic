import { Test } from '../classes/test'
import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'

export class ClickjackingTest extends Test {
    constructor () {
        super('Protect against Clickjacking', 'Server should return the header `Content-Security-Policy` (preferred) or `X-Frame-Options`.', 'https://cutt.ly/LjP7IPO')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Warning
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        const headers = this.browser!.getHeaders()
        this.isValid = false
        if (headers.hasOwnProperty('content-security-policy')) {
            this.isValid = ["frame-ancestors 'none'", "frame-ancestors 'self'"].includes(headers['content-security-policy'].toLowerCase())
            this.comment = `Current Content-Security-Policy value: ${headers['content-security-policy']}`
        } else if (headers.hasOwnProperty('x-frame-options')) {
            this.isValid = ['sameorigin', 'deny'].includes(headers['x-frame-options'].toLowerCase())
            this.comment = `Current X-Frame-Options value: ${headers['x-frame-options']}`
        }

        return this.getResult()
    }
}
