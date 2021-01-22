import { Test } from '../classes/test'
import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'

import fetch from 'node-fetch'

export class BertTest extends Test {
    constructor () {
        super('BERT Score', 'Defines how well your content answers a certain search intent. It provides a value between 0 and 100, being 100 a super-well optimized content.', 'https://cutt.ly/0jP7Tb3')
    }

    getType (): ResultType {
        return ResultType.Info
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        if (!(this.namespace as any).keyword) {
            this.comment = 'No keyword was provided.'
            return this.getResult()
        }

        const content = await this.browser!.getHtml()

        return new Promise(resolve => {
            fetch('https://bertcalculator.com/api/invoke', {
                method: 'POST',
                body: JSON.stringify({
                    keyword: (this.namespace as any).keyword,
                    html: content
                }),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then((response: any) => response.json())
                .then((json: any) => {
                    this.isValid = json.bert_score >= 80
                    this.comment = `BERT Score: ${json.bert_score}`
                    resolve(this.getResult())
                })
                .catch(() => {
                    this.comment = 'Could not run BERT Analysis.'
                    resolve(this.getResult())
                })

        })
    }
}
