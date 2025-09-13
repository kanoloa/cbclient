export * from './types.ts';

import {components} from './cbtypes.ts';

export type ProjectReference = components["schemas"]["ProjectReference"];
export type TrackerItemReferenceSearchResult = components["schemas"]["TrackerItemReferenceSearchResult"];
export type TrackerItemSearchResult = components["schemas"]["TrackerItemSearchResult"];
export type TrackerItem = components["schemas"]["TrackerItem"];

export type AbstractFieldValue = components["schemas"]["AbstractFieldValue"] &  {
    value?: string | boolean | number,
    values?: components["schemas"]["AbstractReference"][]
};