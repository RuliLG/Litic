import TestSuite from './test-suite'
import { HttpsTest } from '../tests/https'
import { Test } from './test'
import { Result } from '../types/result'
import { HeadlessBrowser } from './headless-browser'

export class TechSEO {
    url: string
    browser: HeadlessBrowser
    tests: TestSuite[] = []

    constructor(url: string) {
        this.url = url
        this.browser = new HeadlessBrowser(url)
        this.setupSuites()
    }

    async test () {
        try {
            await this.browser.open()
            for (const suite of this.tests) {
                await suite.test()
            }

            await this.browser.close()
        } catch {
            await this.browser.close()
        }
    }

    results (): Result[] {
        let results: Result[] = []
        for (const suite of this.tests) {
            results = [...results, ...suite.results()]
        }

        return results
    }

    private setupSuites () {
        const suites = [
            {
                name: 'Security',
                tests: [
                    HttpsTest
                ]
            }
        ]

        for (const rawSuite of suites) {
            const suite = new TestSuite(rawSuite.name, this.browser)
            for (const rawTest of rawSuite.tests) {
                const test = new rawTest() as Test
                suite.add(test)
            }

            this.tests.push(suite)
        }
    }
}