import { Test } from '../classes/test'
import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'
import * as HtmlMinifier from 'html-minifier'


export class HtmlMinificationTest extends Test {
    constructor () {
        super('HTML Minification', 'HTML is being minified on the server side.', 'https://cutt.ly/8jP5aVO')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        const html = this.browser!.getRawHtml()
        const minifiedHtml = HtmlMinifier.minify(html, {
            removeAttributeQuotes: true,
            collapseBooleanAttributes: true,
            collapseWhitespace: true,
            conservativeCollapse: true,
            removeComments: true,
            removeEmptyAttributes: true,
            removeRedundantAttributes: true
        })

        const originalBytes = Buffer.byteLength(html)
        const minifiedBytes = Buffer.byteLength(minifiedHtml)
        const variation = (originalBytes - minifiedBytes) / originalBytes
        // We will allow up to a 10% variation in minification before requiring it
        const maxAllowedVariation = 0.1
        this.isValid = variation <= maxAllowedVariation

        if (variation > maxAllowedVariation) {
            this.comment = `Could save up to ${minifiedBytes} bytes.`
        }

        return this.getResult()
    }
}
