
// import {ProjectReference} from "./types/codebeamer";

import {ProjectReference, TrackerItemReferenceSearchResult} from "./types/codebeamer.d.ts";

export interface cbinit {
  username: string | undefined,
  password: string | undefined,
  serverUrl: string | undefined,
  proxyUrl: string | undefined
}

function setHeaders(cb: cbinit) {
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

async function doFetch(target: string, cb: cbinit) {
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
export function getProjects(cb: cbinit) : Promise<ProjectReference[]> {
  const target = cb.serverUrl + "/projects";
  return doFetch(target, cb);
}

/**
 * Get a list of items that the tracker specified by parameter holds.
 * @param cb cbinit interface
 * @param trackerId tracker ID.
 * @return TrackerItemReferenceSearchResult
 */
export function getTrackerItems(cb: cbinit, trackerId: number): Promise<TrackerItemReferenceSearchResult> {
  // if (! cb || ! trackerId) return;
  const target = cb.serverUrl + "/trackers/" + trackerId + "/items";
  return doFetch(target, cb);
}
