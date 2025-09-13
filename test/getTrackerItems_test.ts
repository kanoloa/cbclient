import { assertEquals } from "@std/assert";
import * as cbclient from "../mod.ts";
import * as types from "../types/index.ts";
// import {AbstractFieldValue} from "./types/index.ts";

const cb: types.cbinit = {
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
  serverUrl: Deno.env.get("SERVER_URL"),
};

const tracker = Deno.env.get("TEST_TRACKER");
const tracker_noexist = Deno.env.get("TEST_TRACKER_NOEXIST");

Deno.test("Get Tracker Items", async (t) => {
  await t.step("Existing tracker", async () => {
    const target = tracker != null ? parseInt(tracker) : 0;
    const res: types.TrackerItemReferenceSearchResult = await cbclient
      .getTrackerItems(cb, target);
    assertEquals(cbclient.getTrackerItems_success(res), true);
  });
  await t.step("Non existing tracker", async () => {
    const target = tracker_noexist != null ? parseInt(tracker_noexist) : 0;
    const res = await cbclient.getTrackerItems(cb, target); // not exist
    assertEquals(cbclient.getTrackerItems_success(res), false);
  });
});
