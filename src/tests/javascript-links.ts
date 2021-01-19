import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";

export class JavascriptLinksTest extends Test {
    constructor () {
        super('Javascript Links', 'Using "javascript:" inside <a href> is disallowed. Use a <button> instead.')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        const $ = await this.browser!.getHtmlSoup()
        const links = $('a')
        this.isValid = true
        for (const link of links) {
            if ($(link).attr('href') && $(link).attr('href').startsWith('javascript:')) {
                this.isValid = false
                break
            }
        }

        return this.getResult()
    }
}
