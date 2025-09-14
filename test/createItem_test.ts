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

Deno.test("Create an item", async () => {
  //const res: Array<types.ProjectReference> = await cbclient.getProjects(cb);
  const target = tracker != null ? parseInt(tracker) : 0;
  const item: types.TrackerItem = {
    name: "created by cbclient (test) at " + new Date().toString(),
    description:
      "This item has been created through open api (Deno: typescript)",
  };
  const res = await cbclient.createItem(cb, target, item);
  assertEquals(cbclient.isTrackerItem(res), true);
});
