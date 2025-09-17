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

Deno.test("Delete an item", async () => {
  //const res: Array<types.ProjectReference> = await cbclient.getProjects(cb);
  const target_tracker = tracker != null ? parseInt(tracker) : 0;
  const item: types.TrackerItem = {
    name: "created by cbclient (test) at " + new Date().toString(),
    description:
      "This item has been created through open api (Deno: typescript)",
  };
  const res = await cbclient.createItem(cb, target_tracker, item);
  if (res != null && res.id != null) {
      const res2 = await cbclient.deleteItem(cb, res.id);
      assertEquals(cbclient.isTrackerItem(res2), true);
  } else {
      console.error("deleteItem(): target_item is null.");
  }
});
