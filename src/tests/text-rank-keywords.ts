import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import * as SD from 'silverdiamond';

export class TextRankKeywordsTest extends Test {
    constructor () {
        super('Keywords (Text Rank)', 'Keywords found on your site according to the Text Rank algorithm.', 'https://cutt.ly/MjP5nu7')
    }

    getType (): ResultType {
        return ResultType.Info
    }

    getImportance (): Importance {
        return Importance.Low
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
        const keywords = await silver.textRankKeywords(text)
        this.comment = `Keywords: ${keywords.length > 0 ? keywords.join(', ') : 'No keywords were found'}.`
        return this.getResult()
    }
}
