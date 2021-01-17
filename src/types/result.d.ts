import { Importance } from "../enums/importance";
import { ResultType } from "../enums/result-type";

export interface Result {
    name: string,
    description?: string,
    type: ResultType,
    infoUrl?: string,
    passed?: boolean,
    category?: string,
    comment?: string,
    importance: Importance
}
