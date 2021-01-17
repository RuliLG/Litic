import { Result } from '../types/result'
import { ResultType } from '../enums/result-type'
import { Importance } from '../enums/importance'
import { HeadlessBrowser } from './headless-browser'

export abstract class Test {
    private name: string
    private description: string
    private url?: string = undefined
    protected comment?: string = undefined
    protected browser?: HeadlessBrowser = undefined
    protected isValid?: boolean = undefined
    protected namespace?: object = undefined

    protected constructor (name: string, description: string, url?: string) {
        this.name = name
        this.description = description
        this.url = url
    }

    getName (): string {
        return this.name
    }

    getDescription (): string {
        return this.description
    }

    getResult (): Result {
        return {
            name: this.getName(),
            description: this.getDescription(),
            type: this.getType(),
            infoUrl: this.url,
            passed: this.isValid,
            comment: this.comment,
            importance: this.getImportance()
        }
    }

    setBrowser (browser: HeadlessBrowser) {
        this.browser = browser
    }

    setNamespace (namespace: object) {
        this.namespace = namespace
    }

    abstract getType (): ResultType
    abstract getImportance (): Importance
    abstract test (): Promise<Result>
}
