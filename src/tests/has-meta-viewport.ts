import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";

export class HasMetaViewportTest extends Test {
    constructor () {
        super('<meta name="viewport"> is correctly used', 'Page <head> must contain <meta name="viewport" content="width=device-width, initial-scale=1"> to enable responsiveness on mobile devices.', 'https://web.dev/viewport/')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const $ = await this.browser.getHtmlSoup()
        const metas = $('meta[name="viewport"]')

        this.isValid = metas.length === 1

        if (metas.length === 0) {
            this.comment = 'No meta[name="viewport"] is defined.'
        } else if (metas.length === 1) {
            const metaViewport = metas[0]
            const isInsideHead = metaViewport.parent.name === 'head'
            const hasContent = typeof $(metaViewport).attr('content') !== 'undefined'
            const content = hasContent ? $(metaViewport).attr('content').toLowerCase().replace(/([\s]+)/g, '') : ''
            const hasWidth = content.includes('width=device-width')
            const hasInitialScale = (content.includes('initial-scale=1') && !content.includes('initial-scale=1.')) || content.includes('initial-scale=1.0') // avoid decimal scaling

            if (!isInsideHead) {
                this.isValid = false
                this.comment = 'meta[name="viewport"] must be used inside the <head> tag.'
            } else if (!hasContent) {
                this.isValid = false
                this.comment = 'meta[name="viewport"] must have a `content` attribute.'
            } else if (!hasWidth) {
                this.isValid = false
                this.comment = 'meta[name="viewport"] content should specify "width=device-width".'
            } else if (!hasInitialScale) {
                this.isValid = false
                this.comment = 'meta[name="viewport"] content should specify "initial-scale=1".'
            }
        } else {
            this.comment = `There are ${metas.length} different declarations of meta[name="viewport"].`
        }

        return this.getResult()
    }
}
