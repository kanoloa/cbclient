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
 * const res = await cbclient.getProjects(cb: types.cbinit)
 * if (cbclient.getProject_success(res)) {
 *   do_something
 * }
 * ```
 *
 * Each function has corresponding type guard function whose name is <functionName>_success.
 * Most of the function returns Promise<any>, use type guard function to check if the response is a type of
 * what you need.
 *
 * # Environment file
 * To connect to Codebeamer via open-api (aka Swagger v3), you need to be authenticated and authorized by
 * the Codebeamer server you are accessing to. To provide username and password to this utility, you need to
 * create .env file at the same directory where this utility resides.
 *
 * in the .env file, there must be 3 lines like below:
 * ```ts
 * USERNAME=tom # user username here.
 * PASSWORD=cat # password here.
 * SERVERURL # endpoint URL of Codebeamer open-api with [schema]:[server]:[port]:[path]
 * ```
 * SERVERURL may seem to be something like 'https://my.codebeamer.com:443/cb/api/v3'
 * YOU SHOULD NOT ADD TRAILING SLASH '/' AT THE END OF SERVERURL.
 *
 * # Proxy Access
 * When you need to connect Codebeamer server via a proxy server, then you have to set HTTP_PROXY and
 * HTTPS_PROXY environment variables.  These variables can not be set in .env file.
 *
 * [!IMPORTANT]
 * PTC does not support this program. Use this on your own responsibilities.
 *
 */


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

async function doFetch(target: string, cb: types.cbinit, method: string = 'GET') {
  const headers: Headers = setHeaders(cb);
  return await fetch(target, {method: method, headers: headers})
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
 * @return Promise<any>
 */
export async function getProjects(cb: types.cbinit) {
  const target = cb.serverUrl + "/projects";
  return await doFetch(target, cb);
}

/**
 * Type guard for getProject() function. Expected type is ProjectReference.
 * @param obj
 * @return boolean
 */
export function getProjects_success(obj: unknown): obj is types.ProjectReference {
  return(Array.isArray(obj) && obj.length > 0);
}

/**
 * Get a list of items that the tracker specified by parameter holds.
 * @param cb cbinit interface
 * @param trackerId tracker ID.
 * @return Promise<any>
 */
export async function getTrackerItems(cb: types.cbinit, trackerId: number) {
  // if (! cb || ! trackerId) return;
  const target = cb.serverUrl + "/trackers/" + trackerId + "/items";
  return await doFetch(target, cb);
}

/**
 * Type guard for getTrackerItems() function. Expected type is TrackerItemReferenceSearchResult.
 * @param obj
 * @return boolean
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
 * A result of query may be divided into small chunks.  Chunk size is set to 100 by default, and could be increase
 * up to 500. When the number of items exceeds the chunk size, Codebeamer generates paginated results.
 * This function aggregates these chunks into single response.
 * @param cb type cbinit
 * @param query query string
 * @param page start page
 * @param pageSize how many items should be included in the response.
 * @return Promise<any>
 */
export async function queryItems(cb: types.cbinit, query: string, page: number = 1, pageSize: number = 100) {

    let total = 0;     /* number of items */
    let current = 0;   /* current position */
    const res: types.TrackerItemSearchResult = {total: 0, page: 0, pageSize: 0, items: []};
    let target = cb.serverUrl + "/items/query?page=" + page + "&pageSize=" + pageSize + "&queryString=" + encodeURI(query);

    let counter = 0;

    /* get all the chunks and aggregate them into single response. */
    do {

        let chunk;

        /* access to Codebeamer endpoint to get query result */
        try {
            chunk = await doFetch(target, cb);
        } catch (e) {
            console.error(e);
        }

        /* returned response does not match with declared type. */
        if (! queryItems_success(chunk)) {
            break;
        }

        /* preserver total number of items. */
        if (chunk.total != null) {
            total = chunk.total;
            /* argument 'page' is out of range of number of items. */
            if (total == 0) {
                console.log("total: 0.  No data found, exiting...")
                break;
            }
        }

        /* when an array for items exists, then process each of them */
        if (chunk.items != null && Array.isArray(chunk.items)) {

            /* no more data to read. exiting */
            if (chunk.items.length === 0) {
                console.log("page reached to the end of data, exiting...")
                break;
            }

            /* calculate number of items that have been read. */
            current = current + chunk.items.length;

            if (counter === 0 ) {
                res.total = chunk.total;
                res.page = chunk.page;
                res.pageSize = chunk.pageSize;
            }
            counter++;

            if (res.items == null) {
                res.items = [];
            }

            res.items = res.items.concat(chunk.items);
        }

        target = cb.serverUrl + "/items/query?page=" + ++page + "&pageSize=" + pageSize + "&queryString=" + encodeURI(query);

    } while (current < total);

     return res;
}

/**
 * Type guard for queryItems function. Expected type is TrackerItemSearchResult.
 * @param obj
 * @return boolean
 */
export function queryItems_success(obj: unknown) : obj is types.TrackerItemSearchResult {
    return(
        typeof obj === 'object' &&
            obj != null &&
            'total' in obj &&
            'items' in obj &&
            Array.isArray(obj.items) && obj.items.length > 0
    )
}