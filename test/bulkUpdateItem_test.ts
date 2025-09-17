import { assertEquals } from "@std/assert";
import * as cbclient from "../mod.ts";
import * as types from "../types/index.ts";

const cb: types.cbinit = {
    username: Deno.env.get("USERNAME"),
    password: Deno.env.get("PASSWORD"),
    serverUrl: Deno.env.get("SERVER_URL"),
};

Deno.test("Update an item", async () => {
    const value1: types.AbstractFieldValue = {
        fieldId: 3,
        type: "TextFieldValue",
        name: "Summary",
        value: "name has been updated at " + new Date().toString() + ", for value_1.",
    };

    const value2: types.AbstractFieldValue ={
        fieldId: 3,
        type: "TextFieldValue",
        name: "Summary",
        value: "name has been updated at " + new Date().toString() + ", for value_2.",
    };

    const item1: types.BulkUpdateTrackerItemFields = {
        itemId: 1823340,
        fieldValues: [value1]
    };

    const item2: types.BulkUpdateTrackerItemFields = {
        itemId: 1823342,
        fieldValues: [value2]
    };

    const itemArray: Array<types.BulkUpdateTrackerItemFields> = [item1,item2];

    console.log("bulkUpdateItem(): input: " + JSON.stringify(itemArray,null,2));

    const res = await cbclient.bulkUpdateItems(cb, itemArray);
    console.log("bulkUpdateItem(): output: " + JSON.stringify(res,null,2));
    assertEquals(cbclient.isBulkOperationResponse(res), true);
})