import { Test } from '../classes/test'
import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'

export class ConsoleErrorsTest extends Test {
    constructor () {
        super('Console errors', 'No errors are present in the browser console', 'https://cutt.ly/TjP5Osg')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.Low
    }

    async test (): Promise<Result> {
        this.isValid = this.browser!.getConsoleErrors().length === 0
        return this.getResult()
    }
}
