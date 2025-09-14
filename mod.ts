/**
 * Codebeamer client utility written in TypeScript.
 *
 * # Examples
 * @example instantiate Codebeamer client.
 * ```ts
 * import * as types from ./types/index.ts
 * import * as cbclient from ./mod.ts
 * ```
 * @example get a list of project.
 * ```ts
 * const cb: types.cbinit = {
 *   username: Deno.env.get("USERNAME"),
 *   password: Deno.env.get("PASSWORD"),
 *   serverUrl: Deno.env.get("SERVER_URL"),
 * }
 *
 * const res = await cbclient.getProjects(cb)
 * if (cbclient.getProject_success(res)) {
 *   do_something
 * }
 * ```
 *
 * Each function has a corresponding type guard function whose name is <functionName>_success.
 * Since most of the function returns Promise<any>, use type guard function to check if the response is of
 * an expected type.
 *
 * # Environment file
 * To connect to Codebeamer via open-api (aka Swagger v3), you need to be authenticated and authorized by
 * the Codebeamer server you are accessing to. To provide username and password to this utility, you need to
 * create .env file at the same directory where this utility resides.
 *
 * [!IMPORTANT]
 * .env file has potential security risks of exposing your identity information to public.
 * Please use this tool with much care.  I will implement more secure way in the future.
 *
 * in the .env file, there must be 3 lines like below:
 * ```ts
 * USERNAME=tom # user username here.
 * PASSWORD=cat # password here.
 * SERVER_URL=https://my.server.com:443/cb/api/v3 # endpoint URL.
 * ```
 * SERVER_URL may seem to be something like '[schema]://[FQDN]:[port]/cb/api/v3'.
 * YOU SHOULD NOT ADD TRAILING SLASH '/' AT THE END OF SERVER_URL.
 *
 * # Proxy Access
 * When you need to connect Codebeamer server via a proxy server, then you have to set HTTP_PROXY and
 * HTTPS_PROXY environment variables.  These variables can not be set in .env file.
 *
 * [!IMPORTANT]
 * PTC does not support this program. Use this on your own responsibilities.
 *
 * 'No' copy rights reserved, 2025, Ats Yamada (kanoloa).
 */

import * as types from "./types/index.ts";

function setHeaders(cb: types.cbinit) {
  const headers = new Headers();
  if (cb.username && cb.password) {
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append(
      "Authorization",
      "Basic " + btoa(`${cb.username}:${cb.password}`),
    );
    // console.log("setHeaders: Authorization: " + headers.get("Authorization"));
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
 * Type guard for createItem() function.  Expected type is TrackerItem.
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
 * Type guard for queryItems function. Expected type is TrackerItemSearchResult.
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
 * Type guard for getTrackerItems() function. Expected type is TrackerItemReferenceSearchResult.
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
 * Type guard for getProject() function. Expected type is ProjectReference.
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
    console.error(JSON.stringify(res,null,2));
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
    console.error(JSON.stringify(res,null,2));
    return null;
  }
}


/**
 * Query items using cBQL.
 * A result of query may be divided into two or more small chunks.
 * Chunk size is set to 100 by default, and could be increase up to 500.
 * When the number of items to be returned exceeds the chunk size, Codebeamer generates paginated results.
 * This function aggregates these chunks into single response to keep programmers from doing it by themselves.
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

  let chunk;
  let counter = 0;
  /* get all the chunks and aggregate them into single response. */
  do {
    /* access to Codebeamer endpoint to get query result */
    try {
      chunk = await doFetch(target, cb);
    } catch (e) {
      console.error(e);
    }

    /* check if returned data pass the type guard. if false, exit. */
    if (!isTrackerItemSearchResult(chunk)) break;

    /* check if total is bigger than 0. if true, preserve it, otherwise exit. */
    if ((total = chunk.total != null ? chunk.total : 0) === 0) break;

    /* check if items is array and not null. if true, concatenate it to response data. */
    if (chunk.items != null && Array.isArray(chunk.items)) {
      /* check if returned data has at least one item. if false, then exit. */
      if (chunk.items.length === 0) break;

      /* set total and pageSIze to response value. do this only in the first occurrence. */
      if (counter === 0) {
        res.total = chunk.total;
        res.pageSize = chunk.total;
      }

      /* concatenate returned value with response value. */
      if (res.items == null) res.items = [];
      res.items = res.items.concat(chunk.items);

      /* calculate number of items that have been read so far. */
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
  if ('name' in item && 'description' in item) { // check if item has mandatory values.
    // return await doFetch(target, cb, "POST", item);
      const res = await doFetch(target, cb, "POST", item);
      if (isTrackerItem(res)) {
          return res;
      } else {
          console.error(JSON.stringify(res,null,2));
          return null;
      }
  } else {
    console.error("createItem(): immature request body. INPUT = " + JSON.stringify(item,null,2));
    return null;
  }
}

/* end of file */
