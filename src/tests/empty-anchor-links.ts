
import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";

export class EmptyAnchorLinksTest extends Test {
    constructor () {
        super('Empty Anchor Links', 'Links with href="#" do not make any sense. Use a <button> instead.')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        const $ = await this.browser!.getHtmlSoup()
        const links = $('a')
        this.isValid = true
        for (const link of links) {
            if ($(link).attr('href') && $(link).attr('href') === '#') {
                this.isValid = false
                break
            }
        }

        return this.getResult()
    }
}
