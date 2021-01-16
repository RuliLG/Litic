import * as puppeteer from 'puppeteer'

export class HeadlessBrowser {
    private url: string
    private browser?: puppeteer.Browser = null
    private page?: puppeteer.Page = null

    constructor (url: string) {
        this.url = url
    }

    async open (): Promise<void> {
        this.browser = await puppeteer.launch()
        this.page = await this.browser.newPage()
        await this.page.goto(this.url)
    }

    async html (): Promise<string> {
        return this.page.content()
    }

    async raw (): Promise<string> {
        return this.page.text()
    }

    async close (): Promise<void> {
        await this.browser.close()
    }
}