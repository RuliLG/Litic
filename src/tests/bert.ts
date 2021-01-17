import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";

const fetch = require('node-fetch')

export class BertTest extends Test {
    constructor () {
        super('BERT Score', 'Defines how well your content answers a certain search intent. It provides a value between 0 and 100, being 100 a super-well optimized content.', 'https://bertcalculator.com/')
    }

    getType (): ResultType {
        return ResultType.Info
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        if (!this.namespace['keyword']) {
            this.comment = 'No keyword was provided.'
            return
        }

        const content = await this.browser.getHtml()

        return new Promise(resolve => {
            fetch('https://bertcalculator.com/api/invoke', {
                method: 'POST',
                body: JSON.stringify({
                    keyword: this.namespace['keyword'],
                    html: content
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(json => {
                    this.isValid = json.bert_score >= 80
                    this.comment = `BERT Score: ${json.bert_score}`
                    resolve(this.getResult())
                })
                .catch(error => {
                    this.comment = 'Could not run BERT Analysis.'
                    resolve(this.getResult())
                })

        })
    }
}
