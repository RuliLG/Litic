import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";
import { WhoisService } from "../services/whois.service";
const dayjs = require('dayjs')

export class WhoisTest extends Test {
    constructor () {
        super('WHOIS', 'Information about your domain.')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Warning
    }

    getImportance (): Importance {
        return Importance.Mid
    }

    async test (): Promise<Result> {
        const domain = this.browser.getDomain()
        if (domain === 'localhost' || domain === '127.0.0.1') {
            this.comment = 'Working on localhost'
            return this.getResult()
        }

        try {
            const whois = new WhoisService(domain)
            await whois.fetch()
            const expirationDate = dayjs(whois.getData()['Registrar Registration Expiration Date'])
            const now = dayjs()
            const inThreeMonths = dayjs().add(3, 'months')
            if (expirationDate.isBefore(now)) {
                this.isValid = false
                this.comment = `Domain expired at ${expirationDate.format()}`
            } else if (expirationDate.isBefore(inThreeMonths)) {
                this.isValid = false
                this.comment = 'Domain will expire in less than 3 months'
            } else {
                this.isValid = true
            }
        } catch (e) {
            this.comment = e.message
        }
    }
}
