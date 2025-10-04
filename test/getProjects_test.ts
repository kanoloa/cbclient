import { assertEquals } from "@std/assert";
import * as cbclient from "../mod.ts";
import * as types from "../types/index.ts";
// import {AbstractFieldValue} from "./types/index.ts";

const cb: types.cbinit = {
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
  serverUrl: Deno.env.get("SERVER_URL"),
};

Deno.test("Get Projects", async () => {
  const res = await cbclient.getProjects(cb);
  assertEquals(cbclient.isProjectReferenceArray(res), true);
});
