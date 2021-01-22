import * as lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import fetch from 'node-fetch'

export class LighthouseService {
    static shared?: LighthouseService = undefined
    private url: string
    private report?: object = undefined

    private constructor (url: string) {
        this.url = url
    }

    static get (url: string) {
        if (!LighthouseService.shared) {
            LighthouseService.shared = new LighthouseService(url)
        }

        return LighthouseService.shared
    }

    async run (): Promise<void> {
        if (this.report) {
            return
        }

        // If PageSpeed is available, we use it to avoid resource consumption
        if (process.env.PAGESPEED_TOKEN) {
            const token = process.env.PAGESPEED_TOKEN
            try {
                const pagespeedReport = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(this.url)}&key=${token}&strategy=MOBILE&category=ACCESSIBILITY&category=BEST_PRACTICES&category=PERFORMANCE&category=SEO&category=PWA`)
                    .then(response => response.json())

                if (pagespeedReport.hasOwnProperty('lighthouseResult')) {
                    this.report = pagespeedReport.lighthouseResult.audits
                } else {
                    throw new Error('Invalid response from PageSpeed. More info at https://developers.google.com/speed/docs/insights/v5/get-started')
                }
                return
            } catch (e) {
                console.log(e)
                throw new Error('Invalid PageSpeed API Key. More info at https://developers.google.com/speed/docs/insights/v5/get-started')
            }
        }

        const chrome = await chromeLauncher.launch({
            chromeFlags: ['--headless']
        })
        const options = {
            output: 'json',
            onlyAudits: [
                'is-on-https',
                'redirects-http',
                'first-contentful-paint',
                'largest-contentful-paint',
                'cumulative-layout-shift',
                'server-response-time',
                'interactive',
                'apple-touch-icon',
                'content-width',
                'bypass',
                'color-contrast',
                'heading-order',
                'html-has-lang',
                'html-lang-valid',
                'image-alt',
                'uses-long-cache-ttl',
                'offscreen-images',
                'unminified-css',
                'unminified-javascript',
                'uses-text-compression',
                'dom-size',
                'external-anchors-use-rel-noopener',
                'uses-http2',
                'meta-description',
                'font-size',
                'is-crawlable',
                'robots-txt',
                'tap-targets',
                'hreflang'
            ],
            port: chrome.port
        }

        const runnerResult = await lighthouse(this.url, options)
        this.report = JSON.parse(runnerResult.report).audits

        await chrome.kill()
    }

    getReport () {
        return this.report
    }

    reset () {
        this.report = undefined
    }
}