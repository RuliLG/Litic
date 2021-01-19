import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import * as SD from 'silverdiamond';

export class TextReadabilityTest extends Test {
    constructor () {
        super('Text Readability', 'Checks how readable the text of your website is.', 'https://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_tests')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Warning
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        const silverDiamondKey = process.env.SD_KEY
        if (!silverDiamondKey) {
            this.comment = 'No Silver Diamond key was provided'
            return this.getResult()
        }

        const $ = await this.browser!.getHtmlSoup()
        const htmlLanguage = $('html').attr('lang') || null
        if (!htmlLanguage) {
            this.comment = 'HTMl has no [lang] attribute'
            return this.getResult()
        }

        const text = $.text()
        const silver = new SD.Api(silverDiamondKey)
        const readability = await silver.readability(text, htmlLanguage)
        const isReadable = [SD.Readability.VeryEasy, SD.Readability.Easy, SD.Readability.FairlyEasy, SD.Readability.Standard].includes(readability.readability)
        this.isValid = isReadable
        this.comment = `Readability: ${readability.readability}`
        return this.getResult()
    }
}
