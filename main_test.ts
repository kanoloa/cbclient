import { assertNotEquals } from "@std/assert";
import {cbinit, getProjects, getTrackerItems} from "./main.ts";
import {ProjectReference, TrackerItemReferenceSearchResult} from "./types/codebeamer.d.ts";


Deno.test(async function getProjectTest() {
  const cb: cbinit = {} as cbinit;
  cb.username = Deno.env.get("USERNAME");
  cb.password = Deno.env.get("PASSWORD");
  cb.serverUrl = Deno.env.get("SERVER_URL");
  // console.log("test: from env: username: " + cb.username);
  //console.log("test: from env: password: " + cb.password);
  //console.log("test: from env: server  : " + cb.serverUrl);
  //console.log("test: from env: proxy   : " + Deno.env.get("HTTPS_PROXY"));

  const res: Array<ProjectReference> = await getProjects(cb);
  // console.log(JSON.stringify(res, null, 2));
  // console.log("\n" + "test: there are " + res.length + " projects." + "\n");
  assertNotEquals(res.length, 0);
})

Deno.test(async function getTrackerItemTest() {
  const cb: cbinit = {} as cbinit;
  cb.username = Deno.env.get("USERNAME");
  cb.password = Deno.env.get("PASSWORD");
  cb.serverUrl = Deno.env.get("SERVER_URL");
  const res: TrackerItemReferenceSearchResult = await getTrackerItems(cb, 6545508);
  // console.log("\n" + "Items in tracker 6545508 is "  + res.total + "\n")
  assertNotEquals(res.total, 0);
})


