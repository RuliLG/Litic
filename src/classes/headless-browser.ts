import * as puppeteer from 'puppeteer'
import { Headers } from '../types/headers'
const cheerio = require('cheerio')

export class HeadlessBrowser {
    private url: string
    private browser?: puppeteer.Browser = null
    private page?: puppeteer.Page = null
    private rawHtml?: string = null
    private consoleErrors: string[] = []
    private headers: Headers = {}

    constructor (url: string) {
        this.url = url
    }

    async open (): Promise<void> {
        this.browser = await puppeteer.launch()
        this.page = await this.browser.newPage()
        this.page.on('pageerror', (error) => {
            this.consoleErrors.push(error.toString())
        })

        const response = await this.page.goto(this.url)
        this.headers = response.headers() as Headers
        this.rawHtml = await response.text() as string
    }

    async getHtml (): Promise<string> {
        return this.page.content()
    }

    async getHtmlSoup (): Promise<any> {
        const html = await this.getHtml()
        return cheerio.load(html)
    }

    getHeaders (): Headers {
        return this.headers
    }

    getRawHtml (): string {
        return this.rawHtml
    }

    getConsoleErrors (): string[] {
        return this.consoleErrors
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
        await this.browser.close()
    }
}