/**
 * Codebeamer client utility written in TypeScript.
 * see README.md for more details.
 */

import * as types from "./types/index.ts";

//
// I N T E R N A L  F U N C T I O N S
//

function setHeaders(cb: types.cbinit) {
  const headers = new Headers();
  if (cb.username && cb.password) {
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append(
      "Authorization",
      "Basic " + btoa(`${cb.username}:${cb.password}`),
    );
  } else {
    console.log("setHeaders: immature server information.");
  }
  return headers;
}

async function doFetch(
  target: string,
  cb: types.cbinit,
  method: string = "GET",
  body?: unknown,
) {
  const headers: Headers = setHeaders(cb);
    return await fetch(target, {
    method: method,
    headers: headers,
    body: (body != null ? JSON.stringify(body) : undefined),
  })
    .then((response: Response) => {
      return response.json();
    })
    .then((jsonData) => {
      return jsonData;
    });
}

//
// T Y P E G U A R D S
//

/**
 * Type guard for input parameter of createItem() function.
 * @param obj
 * @return boolean
 */
export function isMinimumItemFields(obj: unknown): obj is types.minimumItemFields{
    return(
        typeof obj === 'object' &&
        obj != null &&
        'name' in obj &&
        'description' in obj
    )
}

/**
 * Type guard for an item. The expected type is TrackerItem.
 * @param obj
 * @return boolean
 */
export function isTrackerItem(obj: unknown): obj is types.TrackerItem {
    return (
        typeof obj === "object" &&
        obj != null &&
        "id" in obj &&
        "name" in obj &&
        "description" in obj &&
        "subjects" in obj &&
        "status" in obj
    );
}

/**
 * Type guard for AbstractFieldValue.
 * @param obj
 * @returns boolean
 */

/*
 * Reserved for future use.
export function isAbstractFieldValue(obj: unknown): obj is types.AbstractFieldValue {
    return (
        typeof obj === "object" &&
        obj != null &&
        "type" in obj &&
        ("value" in obj || "values" in obj)
    );
}
 */

/**
 * Type guard for input parameter of updateItem() function.
 * @param obj
 * @return boolean
 */
export function isUpdateTrackerItemField(obj: unknown): obj is types.UpdateTrackerItemField {
    if (typeof obj === 'object' && obj != null) {
        if ('fieldValues' in obj) {
            return Array.isArray(obj.fieldValues) && obj.fieldValues.length > 0;
        }
        if ('tableValues' in obj) {
            return Array.isArray(obj.tableValues) && obj.tableValues.length > 0;
        }
        return false;
    }
    return false;

}

/**
 * Type guard for input parameter of bulkUpdateItems() function.
 * @param obj
 * @returns boolean
 */
export function isUpdateTrackerItemFieldWithItemId(obj: unknown): obj is types.BulkUpdateTrackerItemFields {
    if (Array.isArray(obj) && obj.length > 0) {
        return obj.every((data) => {
            return 'itemId' in data && 'fieldValues' in data && Array.isArray(data.fieldValues) && data.fieldValues.length > 0;
        });
    }
    return false;
}

/**
 * Type guard for the bulkUpdateItems() function. The expected type is BulkOperationResponse.
 * @param obj
 * @return boolean
 */
export function isBulkOperationResponse(obj: unknown): obj is types.BulkOperationResponse {
    return (
        typeof obj === "object" &&
        obj != null &&
        'successfulOperationsCount' in obj
    );
}

/**
 * Type guard for the queryItems() function. The expected type is TrackerItemSearchResult.
 * @param obj
 * @return boolean
 */
export function isTrackerItemSearchResult(
    obj: unknown,
): obj is types.TrackerItemSearchResult {
    return (
        typeof obj === "object" &&
        obj != null &&
        "total" in obj &&
        "items" in obj &&
        Array.isArray(obj.items) && obj.items.length > 0
    );
}

/**
 * Type guard for getTrackerItems() function. The expected type is TrackerItemReferenceSearchResult.
 * @param obj
 * @return boolean
 */
export function isTrackerItemReferenceSearchResult(
    obj: unknown,
): obj is types.TrackerItemReferenceSearchResult {
    // console.log(JSON.stringify(obj));
    return (
        typeof obj === "object" &&
        obj != null &&
        "total" in obj &&
        "itemRefs" in obj &&
        Array.isArray(obj.itemRefs) && obj.itemRefs.length > 0
    );
}

/**
 * Type guard for getProject() function. The expected type is ProjectReference.
 * @param obj
 * @return boolean
 */
export function isProjectReference(
    obj: unknown,
): obj is types.ProjectReference {
    return (Array.isArray(obj) && obj.length > 0);
}

//
// C. R. U. D.  F U N C T I O N S
//

/**
 * Get a list of Codebeamer projects that the user can access to.
 * @param cb cbinit interface
 * @return Promise<any>
 */
export async function getProjects(cb: types.cbinit) {
  const target = cb.serverUrl + "/projects";
  const res = await doFetch(target, cb);
  if (isProjectReference(res)) {
    return res;
  } else {
    console.error("getProjects(): type doesn't match: " + JSON.stringify(res,null,2));
    return null;
  }
}

/**
 * Get a list of items that the tracker specified by parameter holds.
 * @param cb cbinit interface
 * @param trackerId tracker ID.
 * @return Promise<any>
 */
export async function getTrackerItems(cb: types.cbinit, trackerId: number) {
  const target = cb.serverUrl + "/trackers/" + trackerId + "/items";
  const res = await doFetch(target, cb);
  if (isTrackerItemReferenceSearchResult(res)) {
    return res;
  } else {
    console.error("getTrackerItems(): type doesn't match: " + JSON.stringify(res,null,2));
    return null;
  }
}

/**
 * Query items using cBQL.
 * A result of a query may be divided into two or more small chunks.
 * Chunk size is set to 100 by default and could be increase up to 500.
 * When the number of items to be returned exceeds the chunk size, Codebeamer generates paginated results.
 * This function aggregates these chunks into a single response to keep programmers from doing it by themselves.
 * @param cb type cbinit
 * @param query query string
 * @param page start page
 * @param pageSize how many items should be included in the response.
 * @return Promise<any>
 */
export async function queryItems(
  cb: types.cbinit,
  query: string,
  page: number = 1,
  pageSize: number = 100,
) {
  /* number of items to be returned. */
  let total = 0;
  /* number of items that have been read so far. */
  let currentRead = 0;
  /* open-api end point */
  let target = cb.serverUrl + "/items/query?page=" + page + "&pageSize=" +
    pageSize + "&queryString=" + encodeURI(query);
  /* response data */
  const res: types.TrackerItemSearchResult = {
    total: 0,
    page: page,
    pageSize: pageSize,
    items: [],
  };

  console.log("queryItems(): target = " + target);
  console.log("queryItems(): query = " + query);

  let chunk;
  let counter = 0;
  /* get all the chunks and aggregate them into a single response. */
  do {
    /* access to Codebeamer endpoint to get a query result */
    try {
      chunk = await doFetch(target, cb);
    } catch (e) {
      console.error(e);
    }

    /* check if returned data pass the type guard. if false, exit. */
    if (!isTrackerItemSearchResult(chunk)) {
        console.error("queryItems(): type doesn't match: " + JSON.stringify(chunk,null,2));
        break;
    }


    /* check if items is an array and not null. if true, concatenate it to response data. */
    if (chunk.items != null && Array.isArray(chunk.items)) {
      /* check if returned data has at least one item. if false, then exit. */
      if (chunk.items.length === 0) break;

      /* set total and pageSIze to response value. do this only in the first occurrence. */
      if (counter === 0) {
        res.total = chunk.total;
        res.pageSize = chunk.total;

        /* check if the total is bigger than 0. if true, preserve it, otherwise exit. */
        if ((total = chunk.total != null ? chunk.total : 0) === 0) break;
      }

      /* concatenate the returned value with response value. */
      if (res.items == null) res.items = [];
      res.items = res.items.concat(chunk.items);

      /* calculate the number of items that have been read so far. */
      currentRead = currentRead + chunk.items.length;
    }

    target = cb.serverUrl + "/items/query?page=" + ++page + "&pageSize=" +
      pageSize + "&queryString=" + encodeURI(query);
    counter++;
  } while (currentRead < total);

  return res;
}

/**
 * Create an item in a tracker.
 * @param cb cbinit.
 * @param trackerId tracker in.
 * @param item item data
 * @return Promise<any>
 */
export async function createItem(
  cb: types.cbinit,
  trackerId: number,
  item: types.TrackerItem,
) {
  const target = cb.serverUrl + "/trackers/" + trackerId + "/items";
  if (isMinimumItemFields(item)) { // check if the item has mandatory values.
    // return await doFetch(target, cb, "POST", item);
      const res = await doFetch(target, cb, "POST", item);
      if (isTrackerItem(res)) {
          return res;
      } else {
          console.error("createItem(): type doesn't match: " + JSON.stringify(res,null,2));
          return null;
      }
  } else {
    console.error("createItem(): immature request body. INPUT = " + JSON.stringify(item,null,2));
    return null;
  }
}

/**
 * Update an item.  This function receives field values to be updated.
 * @param cb cbinit
 * @param itemId item ID
 * @param item item data
 * @return Promise<any>
 */
export async function updateItem(
    cb: types.cbinit,
    itemId: number,
    item: types.UpdateTrackerItemField,
) {
    const target = cb.serverUrl + "/items/" + itemId + "/fields";
    if (isUpdateTrackerItemField(item)) {
        const res = await doFetch(target, cb, "PUT", item);
        if (isTrackerItem(res)) {
            return res;
        } else {
            console.error("updateItem(): type doesn't match: " + JSON.stringify(res,null,2));
            return null;
        }
    } else {
        console.error("updateItem(): unexpected input. expected is UpdateTrackerItemFields, but actual is "
            + JSON.stringify(item,null,2));
        return null;
    }
}

/**
 * Bulk update items. This function receives an array of item values to be updated.
 * @param cb cbinit
 * @param itemArray array of items to be updated
 * @return Promise<any>
 */
export async function bulkUpdateItems(cb: types.cbinit, itemArray: types.UpdateTrackerItemFieldWithItemId[]) {
    const target = cb.serverUrl + "/items/fields";
    if (isUpdateTrackerItemFieldWithItemId(itemArray)) {
        const res = await doFetch(target, cb, "PUT", itemArray);
        if (isBulkOperationResponse(res)) {
            return res;
        } else {
            console.error("bulkUpdateItems(): type doesn't match: " + JSON.stringify(res,null,2));
            return null;
        }
    } else {
        console.error("bulkUpdateItems(): unexpected input. expected is UpdateTrackerItemFieldWithItemId[], but actual is ")
    }
    return null;
}

/**
 * Delete an item.
 * @param cb
 * @param itemId
 * @return Promise<any>
 */
export async function deleteItem(cb: types.cbinit, itemId: number) {
    const target = cb.serverUrl + "/items/" + itemId;
    const res = await doFetch(target, cb, "DELETE");
    if (isTrackerItem(res)) {
        return res;
    }
    return null;
}
/* end of this file */
