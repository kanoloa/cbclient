
// import {ProjectReference} from "./types/codebeamer";

export interface CodebeamerServer {
  username: string | undefined,
  password: string | undefined,
  serverUrl: string | undefined,
  proxyUrl: string | undefined
}

function setHeaders(cb: CodebeamerServer) {
  const headers = new Headers();
  if (cb.username && cb.password) {
    headers.append("Accept", "application/json");
    headers.append("Content-Type", "application/json");
    headers.append('Authorization', 'Basic ' + btoa(`${cb.username}:${cb.password}`));
    console.log("setHeaders: Authorization: " + headers.get("Authorization"));
  } else {
    console.log("setHeaders: immature server information.");
  }
  return headers;
}

async function doFetch(target: string, cb: CodebeamerServer) {
  const headers: Headers = setHeaders(cb);
  return await fetch(target, {headers: headers})
      .then((response: Response) => {
        return response.json();
      })
      .then((jsonData) => {
        return jsonData;
      })
}

export function getProjects(cb: CodebeamerServer) {
  const target = cb.serverUrl + "/projects";
  return doFetch(target, cb);
}


