import TestSuite from './test-suite'
import { HttpsTest } from '../tests/https'
import { Test } from './test'
import { Result } from '../types/result'
import { HeadlessBrowser } from './headless-browser'
import { DoctypeTest } from '../tests/doctype'
import { PlainTextEmailsTest } from '../tests/plain-text-emails'
import { ConsoleErrorsTest } from '../tests/console-errors'
import { HasTitleTest } from '../tests/has-title'
import { CanonicalTest } from '../tests/canonical'
import { HasMetaCharsetTest } from '../tests/has-meta-charset'
import { HasMetaViewportTest } from '../tests/has-meta-viewport'
import { WhoisTest } from '../tests/whois'
import { VitalsLcpTest } from '../tests/vitals-lcp'
import { LighthouseService } from '../services/lighthouse.service'
import { HttpsRedirectionTest } from '../tests/https-redirection'
import { TimeToInteractiveTest } from '../tests/time-to-interactive'
import { CrawlableTest } from '../tests/crawlable'
import { FcpTest } from '../tests/fcp'
import { Http2Test } from '../tests/http2'
import { CssMinificationTest } from '../tests/css-minification'
import { JsMinificationTest } from '../tests/js-minification'
import { HtmlHasLangTest } from '../tests/html-has-lang'
import { BertTest } from '../tests/bert'
import { HeadingStructureTest } from '../tests/heading-structure'
import { HreflangTest } from '../tests/hreflang'
import { JumpToMainContentTest } from '../tests/jump-to-main-content'
import { AppleTouchIconTest } from '../tests/apple-touch-icon'

export class TechSEO {
    private url: string
    private browser: HeadlessBrowser
    private namespace: object
    private tests: TestSuite[] = []
    private hasError: boolean = false

    constructor(url: string, namespace: object) {
        this.url = url
        this.browser = new HeadlessBrowser(url)
        this.namespace = namespace
        this.setupSuites()
    }

    async test () {
        try {
            await this.browser.open()
            const lighthouse = LighthouseService.get(this.browser.getUrl())
            lighthouse.reset()
            await lighthouse.run()
            for (const suite of this.tests) {
                await suite.test()
            }

            await this.browser.close()
        } catch (error) {
            console.error(error)
            this.hasError = true
            await this.browser.close()
        }
    }

    getResults (): Result[] {
        if (this.hasError) {
            return []
        }

        let results: Result[] = []
        for (const suite of this.tests) {
            results = [...results, ...suite.getResults()]
        }

        return results
    }

    didFail (): boolean {
        return this.hasError
    }

    private setupSuites () {
        const suites = [
            {
                name: 'Performance',
                tests: [
                    Http2Test,
                    VitalsLcpTest,
                    FcpTest,
                    TimeToInteractiveTest,
                    CssMinificationTest,
                    JsMinificationTest
                ]
            },
            {
                name: 'Robots',
                tests: [
                    CrawlableTest
                ]
            },
            {
                name: 'Accessibility',
                tests: [
                    JumpToMainContentTest
                ]
            },
            {
                name: 'Best Practices',
                tests: [
                    DoctypeTest,
                    ConsoleErrorsTest,
                    HtmlHasLangTest,
                    AppleTouchIconTest
                ]
            },
            {
                name: 'Meta-tags',
                tests: [
                    HasMetaCharsetTest,
                    HasMetaViewportTest,
                    HasTitleTest,
                    CanonicalTest,
                    HreflangTest
                ]
            },
            {
                name: 'Content',
                tests: [
                    BertTest,
                    HeadingStructureTest
                ]
            },
            {
                name: 'Security',
                tests: [
                    PlainTextEmailsTest,
                    HttpsTest,
                    HttpsRedirectionTest
                ]
            },
            {
                name: 'Other',
                tests: [
                    WhoisTest
                ]
            }
        ]

        for (const rawSuite of suites) {
            const suite = new TestSuite(rawSuite.name, this.browser)
            for (const rawTest of rawSuite.tests) {
                const test = new rawTest() as Test
                test.setNamespace(this.namespace)
                suite.add(test)
            }

            this.tests.push(suite)
        }
    }
}