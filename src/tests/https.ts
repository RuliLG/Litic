import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";

export class HttpsTest extends Test {
    constructor () {
        super('HTTPS', 'Page is loaded through HTTPS', 'https://developers.google.com/search/blog/2015/12/indexing-https-pages-by-default')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.High
    }

    async test (): Promise<Result> {
        return {} as Result
    }
}