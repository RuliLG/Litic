import { Test } from '../classes/test'
import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'

export class HasMetaCharsetTest extends Test {
    constructor () {
        super('<meta charset="utf-8"> is used', 'This meta should be defined as the first tag inside <head> to ensure all the document is read using UTF-8.', 'https://cutt.ly/QjP5rJx')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const $ = await this.browser!.getHtmlSoup()
        const metas = $('meta[charset]')

        this.isValid = metas.length === 1

        if (metas.length === 0) {
            this.comment = 'No meta[charset] is defined.'
        } else if (metas.length === 1) {
            // meta[charset] should use utf-8 encoding, as well as be the first tag inside the <head>
            const metaCharset = metas[0]
            const isInsideHead = metaCharset.parent.name === 'head'
            const isFirstElementInsideHead = !metaCharset.prev
            const isUtf8 = $(metaCharset).attr('charset').toLowerCase() === 'utf-8'
            if (!isInsideHead) {
                this.isValid = false
                this.comment = 'meta[charset] must be used inside the <head> tag.'
            } else if (!isFirstElementInsideHead) {
                this.isValid = false
                this.comment = 'meta[charset] must be the first element inside the <head> tag.'
            } else if (!isUtf8) {
                this.isValid = false
                this.comment = 'meta[charset] should use UTF-8 encoding.'
            }
        } else {
            this.comment = `There are ${metas.length} different declarations of meta[charset].`
        }

        return this.getResult()
    }
}
