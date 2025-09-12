import { assertEquals} from "@std/assert";
import * as cbclient from "./mod.ts";
import * as types from "./types/index.ts";
// import {AbstractFieldValue} from "./types/index.ts";

const cb: types.cbinit = {} as types.cbinit;
cb.username = Deno.env.get("USERNAME");
cb.password = Deno.env.get("PASSWORD");
cb.serverUrl = Deno.env.get("SERVER_URL");

Deno.test(async function getProjectsTest() {
  const res: Array<types.ProjectReference> = await cbclient.getProjects(cb);
  assertEquals(cbclient.getProjects_success(res), true);
})


Deno.test(async function getTrackerItemsTest() {
  // const cb: types.cbinit = {} as types.cbinit;
  const res: types.TrackerItemReferenceSearchResult = await cbclient.getTrackerItems(cb, 6545508);
  assertEquals(cbclient.getTrackerItems_success(res), true);
})

Deno.test(async function getTrackerItemsTest_2() {
  // const cb: types.cbinit = {} as types.cbinit;
  const res = await cbclient.getTrackerItems(cb, 999999);  // not exist
  assertEquals(cbclient.getTrackerItems_success(res), false);
})


Deno.test(async function queryItemsTest() {
  const query = "project.id IN (363) AND tracker.id IN (6545508)";
  const res: types.TrackerItemSearchResult = await cbclient.queryItems(cb, query, 1,500);
  // console.log(JSON.stringify(res, null, 2));
  if (res.items != null) {
    console.log("queryItemTest: got " + res.items.length + " items.");
  }
   assertEquals(cbclient.queryItems_success(res), true);
})


