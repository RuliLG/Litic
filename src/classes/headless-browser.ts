import * as puppeteer from 'puppeteer'

export class HeadlessBrowser {
    private url: string
    private browser?: puppeteer.Browser = null
    private page?: puppeteer.Page = null
    private rawHtml?: string = null

    constructor (url: string) {
        this.url = url
    }

    async open (): Promise<void> {
        this.browser = await puppeteer.launch()
        this.page = await this.browser.newPage()
        const response = await this.page.goto(this.url)
        this.rawHtml = await response.text()
    }

    async getHtml (): Promise<string> {
        return this.page.content()
    }

    getRawHtml (): string {
        return this.rawHtml
    }

    async close (): Promise<void> {
        await this.browser.close()
    }
}