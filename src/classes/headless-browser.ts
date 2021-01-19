import * as puppeteer from 'puppeteer'
import { Headers } from '../types/headers'
import * as cheerio from 'cheerio'

export class HeadlessBrowser {
    private url: string
    private browser?: puppeteer.Browser = undefined
    private page?: puppeteer.Page = undefined
    private rawHtml?: string = undefined
    private consoleErrors: string[] = []
    private headers: Headers = {}

    constructor (url: string) {
        this.url = url
    }

    async open (): Promise<void> {
        this.browser = await puppeteer.launch({
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        })
        this.page = await this.browser.newPage()
        this.page.on('pageerror', (error) => {
            this.consoleErrors.push(error.toString())
        })

        const response = await this.page.goto(this.url)
        this.headers = response!.headers() as Headers
        this.rawHtml = await response!.text()
    }

    async getHtml (): Promise<string> {
        return this.page!.content()
    }

    async getHtmlSoup (): Promise<any> {
        const html = await this.getHtml()
        return cheerio.load(html)
    }

    getHeaders (): Headers {
        return this.headers
    }

    getRawHtml (): string {
        return this.rawHtml!
    }

    getConsoleErrors (): string[] {
        return this.consoleErrors
    }

    getUrl (): string {
        return this.url
    }

    getDomain (): string {
        const subdomain = this.getSubdomain()
        const parts = subdomain.split('.')
        const isSubdomain = parts.length >= 3
        return isSubdomain ? parts.slice(1).join('.') : subdomain
    }

    getSubdomain (): string {
        const url = new URL(this.url)
        return url.hostname
    }

    async close (): Promise<void> {
        if (this.browser) {
            await this.browser.close()
        }
    }
}