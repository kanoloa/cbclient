import {AbstractFieldValue} from "./index.ts";

export interface cbinit {
  username: string | undefined;
  password: string | undefined;
  serverUrl: string | undefined
}

export interface ErrorResponse {
  message: string;
  resourceUri: string
}

export interface minimumItemFields {
    name: string;
    description: string
}

export interface BulkUpdateTrackerItemFields {
    itemId: number;
    fieldValues: AbstractFieldValue[]
}