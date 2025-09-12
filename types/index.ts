export * from './types.ts';

import {components} from './cbtypes.ts';

export type ProjectReference = components["schemas"]["ProjectReference"];
export type TrackerItemReferenceSearchResult = components["schemas"]["TrackerItemReferenceSearchResult"];
export type TrackerItemSearchResult = components["schemas"]["TrackerItemSearchResult"];

export type AbstractFieldValue = components["schemas"]["AbstractFieldValue"] &  {
    value?: string | boolean | number,
    values?: components["schemas"]["AbstractReference"][]
};