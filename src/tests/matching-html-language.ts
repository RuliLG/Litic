import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import * as SD from 'silverdiamond';

export class MatchingHtmlLanguageTest extends Test {
    constructor () {
        super('Matching HTML Language', 'Website language matches html[lang] specified language.')
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
        const text = $.text()
        const silver = new SD.Api(silverDiamondKey)
        const language = await silver.language(text)
        const htmlLanguage = $('html').attr('lang') || '-'
        this.isValid = htmlLanguage.toLowerCase().trim() === language
        this.comment = `Specified language: ${htmlLanguage}. Detected language: ${language}.`
        return this.getResult()
    }
}
