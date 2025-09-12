import { assertEquals} from "@std/assert";
import {
  getProjects,
  getTrackerItems,
  getProjects_success,
  getTrackerItems_success,
  queryItems,
  queryItems_success
} from "./mod.ts";
import * as types from "./types/index.ts";
// import {AbstractFieldValue} from "./types/index.ts";

const cb: types.cbinit = {} as types.cbinit;
cb.username = Deno.env.get("USERNAME");
cb.password = Deno.env.get("PASSWORD");
cb.serverUrl = Deno.env.get("SERVER_URL");

Deno.test(async function getProjectsTest() {
  const res: Array<types.ProjectReference> = await getProjects(cb);
  assertEquals(getProjects_success(res), true);
})


Deno.test(async function getTrackerItemsTest() {
  // const cb: types.cbinit = {} as types.cbinit;
  const res: types.TrackerItemReferenceSearchResult = await getTrackerItems(cb, 6545508);
  assertEquals(getTrackerItems_success(res), true);
})

Deno.test(async function getTrackerItemsTest_2() {
  // const cb: types.cbinit = {} as types.cbinit;
  const res = await getTrackerItems(cb, 999999);  // not exist
  assertEquals(getTrackerItems_success(res), false);
})


Deno.test(async function queryItemsTest() {
  const query = "project.id IN (363) AND tracker.id IN (6545508)";
  const res: types.TrackerItemSearchResult = await queryItems(cb, query, 1,500);
  // console.log(JSON.stringify(res, null, 2));
  if (res.items != null) {
    console.log("queryItemTest: got " + res.items.length + " items.");
  }
   assertEquals(queryItems_success(res), true);
})


