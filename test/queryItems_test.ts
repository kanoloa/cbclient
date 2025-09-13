import { assertEquals } from "@std/assert";
import * as cbclient from "../mod.ts";
import * as types from "../types/index.ts";
// import {AbstractFieldValue} from "./types/index.ts";

const cb: types.cbinit = {
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
  serverUrl: Deno.env.get("SERVER_URL"),
};

const project = Deno.env.get("TEST_PROJECT");
const tracker = Deno.env.get("TEST_TRACKER");

Deno.test("Query Tracker Items", async () => {
  const query = "project.id IN (" + project + ") AND tracker.id IN (" +
    tracker + ")";
  const res: types.TrackerItemSearchResult = await cbclient.queryItems(
    cb,
    query,
    1,
    500,
  );
  if (res.items != null) {
    console.log("queryItemTest: got " + res.items.length + " items.");
  }
  assertEquals(cbclient.queryItems_success(res), true);
});
