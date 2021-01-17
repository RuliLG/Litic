import TestSuite from './test-suite'
import { HttpsTest } from '../tests/https'
import { Test } from './test'
import { Result } from '../types/result'
import { HeadlessBrowser } from './headless-browser'
import { LighthouseService } from '../services/lighthouse.service'

export class TechSEO {
    private url: string
    private browser: HeadlessBrowser
    private tests: TestSuite[] = []
    private hasError: boolean = false

    constructor(url: string) {
        this.url = url
        this.browser = new HeadlessBrowser(url)
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