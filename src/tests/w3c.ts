import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import * as validator from 'html-validator';

export class W3cTest extends Test {
    constructor () {
        super('HTML is valid', 'Page HTML must be valid according to W3C standards.', 'https://cutt.ly/ojP5Tgo')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        const url = this.browser!.getUrl()

        return new Promise(async (resolve) => {
            const rawResponse = await validator({ url })
            const response = JSON.parse(rawResponse)
            let nErrors = 0
            // We won't consider having an image with data-src or class="lazyload" as invalid HTML
            for (const message of response.messages) {
                if (message.type !== 'error') {
                    continue
                }

                if (message.message.includes('img') && message.message.includes('missing') && message.message.includes('src')) {
                    // Let's check the `extract` parameter, which contains the piece of HTML with the failing tag
                    if (!message.extract.includes('lazyload') && !message.extract.includes('data-src')) {
                        nErrors += 1
                    }
                } else {
                    nErrors += 1
                }
            }

            this.isValid = nErrors === 0
            if (nErrors > 0) {
                this.comment = `W3C found ${nErrors} errors in your site HTML.`
            }

            resolve(this.getResult())
        })
    }
}
