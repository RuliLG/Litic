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
import { VitalsClsTest } from '../tests/vitals-cls'
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
import { PreloadFontsTest } from '../tests/preload-fonts'
import { HreflangTest } from '../tests/hreflang'
import { JumpToMainContentTest } from '../tests/jump-to-main-content'
import { AppleTouchIconTest } from '../tests/apple-touch-icon'
import { HasMetadescriptionTest } from '../tests/has-metadescription'
import { ServerResponseTimeTest } from '../tests/server-response-time'
import { ContentWidthTest } from '../tests/content-width'
import { MatchingHtmlLanguageTest } from '../tests/matching-html-language'
import { TextReadabilityTest } from '../tests/text-readability'
import { TextRankKeywordsTest } from '../tests/text-rank-keywords'

export class Litic {
    private url: string
    private browser: HeadlessBrowser
    private namespace: object
    private tests: TestSuite[] = []
    private hasError: boolean = false
    private error?: any = undefined

    constructor(url: string, namespace: object) {
        this.url = url
        this.browser = new HeadlessBrowser(url)
        this.namespace = namespace
        this.setupSuites()
    }

    async test () {
        try {
            LighthouseService.shared = undefined
            await this.browser.open()
            const lighthouse = LighthouseService.get(this.browser.getUrl())
            lighthouse.reset()
            await lighthouse.run()
            for (const suite of this.tests) {
                await suite.test()
            }

            await this.browser.close()
        } catch (e) {
            await this.browser.close()
        }
    }

    getResults (): (Result[] | object) {
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
                    ServerResponseTimeTest,
                    VitalsLcpTest,
                    VitalsClsTest,
                    FcpTest,
                    TimeToInteractiveTest,
                    CssMinificationTest,
                    JsMinificationTest,
                    PreloadFontsTest
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
                    JumpToMainContentTest,
                    MatchingHtmlLanguageTest
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
                    HasMetadescriptionTest,
                    CanonicalTest,
                    HreflangTest
                ]
            },
            {
                name: 'Content',
                tests: [
                    HeadingStructureTest,
                    ContentWidthTest,
                    TextReadabilityTest,
                    TextRankKeywordsTest,
                    BertTest
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