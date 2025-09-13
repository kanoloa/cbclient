import { assertEquals } from "@std/assert";
import * as cbclient from "../mod.ts";
import * as types from "../types/index.ts";
// import {AbstractFieldValue} from "./types/index.ts";

const cb: types.cbinit = {
    username: Deno.env.get("USERNAME"),
    password: Deno.env.get("PASSWORD"),
    serverUrl: Deno.env.get("SERVER_URL"),
}

Deno.test("Get Tracker Items", async (t) => {
    await t.step("Existing tracker", async () => {
            const res: types.TrackerItemReferenceSearchResult = await cbclient.getTrackerItems(cb, 6545508);
            assertEquals(cbclient.getTrackerItems_success(res), true);
        }
    )
    await t.step("Non existing tracker", async () => {
            const res = await cbclient.getTrackerItems(cb, 999999);  // not exist
            assertEquals(cbclient.getTrackerItems_success(res), false);
    })
})