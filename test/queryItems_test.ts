import { assertEquals } from "@std/assert";
import * as cbclient from "../mod.ts";
import * as types from "../types/index.ts";
// import {AbstractFieldValue} from "./types/index.ts";

const cb: types.cbinit = {
    username: Deno.env.get("USERNAME"),
    password: Deno.env.get("PASSWORD"),
    serverUrl: Deno.env.get("SERVER_URL"),
}

Deno.test("Query Tracker Items", async () => {
    const query = "project.id IN (363) AND tracker.id IN (6545508)";
    const res: types.TrackerItemSearchResult = await cbclient.queryItems(cb, query, 1,500);
    if (res.items != null) {
        console.log("queryItemTest: got " + res.items.length + " items.");
    }
    assertEquals(cbclient.queryItems_success(res), true);
})