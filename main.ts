
import * as types from "./types/index.ts";

function setHeaders(cb: types.cbinit) {

  const headers = new Headers();
  if (cb.username && cb.password) {
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append('Authorization', 'Basic ' + btoa(`${cb.username}:${cb.password}`));
    // console.log("setHeaders: Authorization: " + headers.get("Authorization"));
  } else {
    console.log("setHeaders: immature server information.");
  }
  return headers;
}

async function doFetch(target: string, cb: types.cbinit) {
  const headers: Headers = setHeaders(cb);
  return await fetch(target, {headers: headers})
      .then((response: Response) => {
        return response.json();
      })
      .then((jsonData) => {
        return jsonData;
      })
}

/**
 * Get a list of Codebeamer projects that the user can access to.
 * @param cb cbinit interface
 * @return ProjectReference
 */
export async function getProjects(cb: types.cbinit) {
  const target = cb.serverUrl + "/projects";
  return await doFetch(target, cb);
}

/**
 * Type guard for getProject() function.
 * @param obj
 */
export function getProjects_success(obj: unknown): obj is types.ProjectReference {
  return(Array.isArray(obj) && obj.length > 0);
}

/**
 * Get a list of items that the tracker specified by parameter holds.
 * @param cb cbinit interface
 * @param trackerId tracker ID.
 * @return TrackerItemReferenceSearchResult
 */
export async function getTrackerItems(cb: types.cbinit, trackerId: number) {
  // if (! cb || ! trackerId) return;
  const target = cb.serverUrl + "/trackers/" + trackerId + "/items";
  return await doFetch(target, cb);
}

/**
 * Type guard for getTrackerItems() function.
 * @param obj
 */
export function getTrackerItems_success(obj: unknown) : obj is types.TrackerItemReferenceSearchResult {
    // console.log(JSON.stringify(obj));
    return(
      typeof obj === 'object' &&
          obj != null &&
          'total' in obj &&
          'itemRefs' in obj &&
          Array.isArray(obj.itemRefs) && obj.itemRefs.length > 0
  )
}

/**
 * Query items using cBQL.
 * @param cb
 * @param query
 * @param page start page
 * @param pageSize how many items should be included in the response.
 */

export async function queryItems(cb: types.cbinit, query: string, page: number = 1, pageSize: number = 100) {
    const target = cb.serverUrl + "/items/query?page=" + page + "&pageSize=" + pageSize + "&queryString=" + encodeURI(query);
    return await doFetch(target, cb);
}

export function queryItems_success(obj: unknown) : obj is types.TrackerItemSearchResult {
    return(
        typeof obj === 'object' &&
            obj != null &&
            'total' in obj &&
            'items' in obj &&
            Array.isArray(obj.items) && obj.items.length > 0
    )
}