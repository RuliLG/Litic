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
import { LongCacheTtlTest } from '../tests/long-cache-ttl'
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
import { ColorContrastTest } from '../tests/color-contrast'
import { HreflangTest } from '../tests/hreflang'
import { JumpToMainContentTest } from '../tests/jump-to-main-content'
import { AppleTouchIconTest } from '../tests/apple-touch-icon'
import { HasMetadescriptionTest } from '../tests/has-metadescription'
import { ServerResponseTimeTest } from '../tests/server-response-time'
import { ContentWidthTest } from '../tests/content-width'
import { MatchingHtmlLanguageTest } from '../tests/matching-html-language'
import { TextReadabilityTest } from '../tests/text-readability'
import { TextRankKeywordsTest } from '../tests/text-rank-keywords'
import { RelNoopenerTest } from '../tests/rel-noopener'
import { TextCompressionTest } from '../tests/text-compression'
import { ContentSniffingTest } from '../tests/content-sniffing'
import { ClickjackingTest } from '../tests/clickjacking'
import { W3cTest } from '../tests/w3c'
import { HtmlMinificationTest } from '../tests/html-minification'
import { JavascriptLinksTest } from '../tests/javascript-links'
import { EmptyAnchorLinksTest } from '../tests/empty-anchor-links'

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

    getResults (): Result[] {
        let results: Result[] = []
        for (const suite of this.tests) {
            results = [...results, ...suite.getResults()]
        }

        return results
    }

    didFail (): boolean {
        return this.hasError
    }

    log () {
        const results = this.getResults().map((result: Result) => {
            return {
                Category: result.category,
                Name: result.name,
                Result: result.passed === true ? '✅' : (result.passed === false ? '❌' : '⬛️'),
                Type: result.type,
                Importance: result.importance,
                Comment: result.comment,
                URL: result.infoUrl
            }
        }) as any[]
        // eslint-disable-next-line
        console.table(results)
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
                    HtmlMinificationTest,
                    CssMinificationTest,
                    JsMinificationTest,
                    LongCacheTtlTest,
                    TextCompressionTest,
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
                    MatchingHtmlLanguageTest,
                    ColorContrastTest,
                ]
            },
            {
                name: 'Best Practices',
                tests: [
                    W3cTest,
                    ConsoleErrorsTest,
                    DoctypeTest,
                    HtmlHasLangTest,
                    AppleTouchIconTest,
                    JavascriptLinksTest,
                    EmptyAnchorLinksTest,
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
                    HttpsRedirectionTest,
                    RelNoopenerTest,
                    ContentSniffingTest,
                    ClickjackingTest,
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