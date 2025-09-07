import { assertNotEquals } from "@std/assert";
import { CodebeamerServer, getProjects } from "./main.ts";
import {ProjectReference} from "./types/codebeamer.d.ts";


Deno.test(async function getProjectTest() {
  const cb: CodebeamerServer = {} as CodebeamerServer;
  cb.username = Deno.env.get("USERNAME");
  cb.password = Deno.env.get("PASSWORD");
  cb.serverUrl = Deno.env.get("SERVER_URL");
  console.log("test: from env: username: " + cb.username);
  console.log("test: from env: password: " + cb.password);
  console.log("test: from env: server  : " + cb.serverUrl);
  console.log("test: from env: proxy   : " + Deno.env.get("HTTPS_PROXY"));

  const res: Array<ProjectReference> = await getProjects(cb);
  // console.log(JSON.stringify(res, null, 2));
  console.log("test: result has " + res.length + " projects.");
  assertNotEquals(res.length, 0);

  // deno-lint-ignore no-explicit-any
  res.forEach((project): any => {
    console.log("id = " + project.id + ", name = " + project.name);
  })
})


