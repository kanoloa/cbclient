export interface ProjectReference {
    id: number;
    name: string;
    type: string
}

export interface TrackerItemReferenceData {
    suspectPropagation: string
}

export interface TrackerItemReference {
    id: number;
    name: string;
    type: string;
    angularIcon: string;
    commonItemId: number;
    iconColor: string;
    propagateSuspects: boolean;
    referenceData: TrackerItemReferenceData;
    testStepReuse: boolean;
    trackerKey: string;
    trackerTypeId: number;
    uri: string;
}

export interface TrackerItemReferenceSearchResult {
    page: number;
    pageSize: number;
    total: number
}