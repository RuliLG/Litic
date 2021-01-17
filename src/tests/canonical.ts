import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";

export class CanonicalTest extends Test {
    constructor () {
        super('Canonical URL is defined', 'The page must have 1 canonical URL defined. The canonical version must point to itself, without query parameters.', 'https://developers.google.com/search/docs/advanced/crawling/consolidate-duplicate-urls?hl=en')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        /*
        Canonical tags may be present in 3 different ways:
        TODO: - Using the page sitemap
        - Using <link rel="canonical">
        - Using a header
        */

        const headerCanonicals = this.getCanonicalsFromHeaders()
        const linkCanonicals = await this.getCanonicalsFromHtml()
        const nCanonicals = headerCanonicals.length + linkCanonicals.length
        this.isValid = nCanonicals === 1

        if (nCanonicals === 0) {
            this.comment = 'No canonical URL has been defined.'
        } else if (nCanonicals === 1) {
            // Canonical must be defined as a fully qualified URL
            const canonical = headerCanonicals[0] || linkCanonicals[0]
            if (canonical && canonical.startsWith('https:') || canonical.startsWith('http:')) {
                this.comment = canonical
            } else {
                this.isValid = false
                this.comment = `Canonical must be defined as a fully qualified URL. Current = ${canonical}`
            }
        } else {
            this.comment = `There are ${nCanonicals} canonical URLs set.`
        }

        return this.getResult()
    }

    private getCanonicalsFromHeaders (): string[] {
        const headers = this.browser.getHeaders()
        if (headers.hasOwnProperty('link')) {
            // Headers are written like this:
            // Link: <https://domain.com/path>; rel="canonical"
            if (headers.link.toLowerCase().includes('rel="canonical"')) {
                const caretLink = headers.link.split(';')[0]
                // We need to remove the < and > characters from the link
                const link = caretLink.substring(1, caretLink.length - 2)
                return [link]
            }
        }

        return []
    }

    private async getCanonicalsFromHtml (): Promise<string[]> {
        const $ = await this.browser.getHtmlSoup()
        const canonicals: string[] = []

        const links = $('link[rel="canonical"]')
        for (let i = 0; i < links.length; i++) {
            canonicals.push($(links[i]).attr('href'))
        }

        return canonicals
    }
}