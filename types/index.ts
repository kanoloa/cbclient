export * from "./types.ts";

import { components } from "./cbtypes.ts";

//
// T Y P E   A L I A S
//
export type ProjectReference = components["schemas"]["ProjectReference"];
export type TrackerItemReferenceSearchResult = components["schemas"]["TrackerItemReferenceSearchResult"];
export type TrackerItemSearchResult = components["schemas"]["TrackerItemSearchResult"];
export type TrackerItem = components["schemas"]["TrackerItem"];
export type UpdateTrackerItemField = components["schemas"]["UpdateTrackerItemField"];

//
// T Y P E  P A T C H
//

export type AbstractFieldValue = components["schemas"]["AbstractFieldValue"] & {
  value?: string | boolean | number;
  values?: components["schemas"]["AbstractReference"][];
};
