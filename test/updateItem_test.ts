import { assertEquals } from "@std/assert";
import * as cbclient from "../mod.ts";
import * as types from "../types/index.ts";
// import {AbstractFieldValue} from "./types/index.ts";

const cb: types.cbinit = {
    username: Deno.env.get("USERNAME"),
    password: Deno.env.get("PASSWORD"),
    serverUrl: Deno.env.get("SERVER_URL"),
};

Deno.test("Update an item", async () => {
    const value: types.AbstractFieldValue = {
        fieldId: 3,
        type: "TextFieldValue",
        name: "Summary",
        value: "name has been updated at " + new Date().toString() + "",
    };
    const item: types.UpdateTrackerItemField = {
        fieldValues: [value],
    };
    console.log("updateItem(): input: " + JSON.stringify(item,null,2));

    const res = await cbclient.updateItem(cb, 1823338, item);
    console.log("updateItem(): output: " + JSON.stringify(res,null,2));
    assertEquals(cbclient.isTrackerItem(res), true);
})