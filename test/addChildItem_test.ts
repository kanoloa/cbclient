import { assertEquals } from "@std/assert";
import * as cbclient from "../mod.ts";
import * as types from "../types/index.ts";

const cb: types.cbinit = {
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
  serverUrl: Deno.env.get("SERVER_URL"),
};

const parent = Number(Deno.env.get("TEST_PARENT_ITEM"));
const child = Number(Deno.env.get("TEST_CHILD_ITEM"));

console.log("add child item: parent = " + parent + ", child = " + child);

Deno.test("add child item", async () => {

    if (parent != null && child != null) {
        const res = await cbclient.addNewChildItem(cb, parent, child);

        if (res != null && res.index != null) {
            assertEquals(cbclient.isTrackerItemChildReference(res), true);
        } else {
            console.error("deleteItem(): target_item is null.");
        }
    } else {
        console.error("addNewChildItem(): parent or child is null.");
        return;
    }

});
