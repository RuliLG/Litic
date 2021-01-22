import { Test } from '../classes/test'
import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'

export class HasTitleTest extends Test {
    constructor () {
        super('<title> tag is present', 'HTML contains a non-empty <title> tag inside <head>', 'https://cutt.ly/ejP5uC1')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const $ = await this.browser!.getHtmlSoup()
        const titleTags = $('head title')
        if (titleTags.length === 1) {
            const title = $(titleTags[0]).text().trim()
            this.isValid = title.length > 0
            this.comment = `Title: ${title}`
        } else {
            this.isValid = false
            if (titleTags.length > 1) {
                this.comment = `We found ${titleTags.length} different <title> tags and only one is allowed.`
            } else {
                this.comment = '<title> tag is mandatory.'
            }
        }

        return this.getResult()
    }
}
