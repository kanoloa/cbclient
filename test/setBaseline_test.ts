import { assertEquals } from "@std/assert";
import * as cbclient from "../mod.ts";
import * as types from "../types/index.ts";
// import {AbstractFieldValue} from "./types/index.ts";

const cb: types.cbinit = {
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
  serverUrl: Deno.env.get("SERVER_URL"),
};

Deno.test("Set Baseline", async () => {
    const projectId = Number(Deno.env.get("TEST_PROJECT"));
    console.log("setBaseline(): projectId = " + projectId);
    const res = await cbclient.setBaseline(cb, projectId);
    console.log("setBaseline(): res = " + JSON.stringify(res,null,2));
    assertEquals(cbclient.isProjectReference(res), true);
});
