import { Result } from "../types/result"
import { HeadlessBrowser } from "./headless-browser"
import { Test } from "./test"

class TestSuite {
    private name: string
    private browser: HeadlessBrowser
    private tests: Test[]

    constructor (name: string, browser: HeadlessBrowser) {
        this.name = name
        this.browser = browser
        this.tests = []
    }

    add (test: Test) {
        test.setBrowser(this.browser)
        this.tests.push(test)
    }

    getName (): string {
        return this.name
    }

    getTests (): Test[] {
        return this.tests
    }

    results (): Result[] {
        return this.tests.map(test => {
            const result = test.result()
            result.category = this.getName()
            return result
        })
    }

    async test (): Promise<void> {
        await Promise.allSettled(this.tests.map(test => test.test()))
    }
}

export default TestSuite
