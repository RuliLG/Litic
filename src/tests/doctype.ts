import { Test } from "../classes/test";
import { Result } from "../types/result";
import { ResultType } from "../enums/result-type";
import { Importance } from "../enums/importance";

export class DoctypeTest extends Test {
    constructor () {
        super('<!DOCTYPE html>', 'Server response starts with the HTML Doctype definition', 'https://www.w3schools.com/tags/tag_doctype.asp')
    }

    getType (): ResultType {
        return this.isValid ? ResultType.Success : ResultType.Error
    }

    getImportance (): Importance {
        return Importance.Low
    }

    async test (): Promise<Result> {
        const html = this.browser.getRawHtml().toLowerCase().trim()
        this.isValid = html.startsWith('<!doctype html>')
        return this.getResult()
    }
}