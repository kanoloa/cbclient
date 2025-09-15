# cbclient

Codebeamer Client for Deno.

This utility is written with [TypeScript](https://www.typescriptlang.org) and expected to run on [Deno](https://deno.com).

Codebeamer is an integrated ALM tool for systems engineering, software development, and hardware development by PTC inc.
It has a holistic functional set of accessing and modifying its data through open api, which is Swagger v3.
However, the api design is a bit huge, and one may see some kind of difficulties to use it.

This tool helps those who are not experienced in writing code using Codebeamer api.


## Examples
instantiate a Codebeamer client.
```ts
import * as types from "./types/index.ts";
import * as client from "./mod.ts";
```
get a list of a project.
```ts
const cb: types.cbinit = {
  username: Deno.env.get("USERNAME"),
  password: Deno.env.get("PASSWORD"),
  serverUrl: Deno.env.get("SERVER_URL"),
}

const res = await client.getProjects(cb);
if (client.isProjectReference(res)) {
    console.log(JSON.stringify(res, null, 2));
}
```

Each Codebeamer Type has a corresponding type guard function whose name is "is\<Type\>". 
For example, a type guard for TrackerItem is 'isTrackerItem.'
Since most of the function returns Promise\<any\>, use the corresponding type guard function
to check if the response is of an expected type.

## Environment file
To connect to Codebeamer via open-api (aka Swagger v3), you need to be authenticated and authorized by
the Codebeamer server you are accessing to. To provide username and password to this utility, you need to
create a .env file at the same directory where this utility resides.

[!WARNING]
.env file has potential security risks of exposing your identity information to the public.
Please use this tool with much care.  I will implement a more secure way in the future.

in the .env file, there must be three lines like below:
```dotenv
USERNAME=tom
PASSWORD=cat
SERVER_URL=https://my.server.com:443/cb/api/v3
```
SERVER_URL may seem to be something like '[schema]://[FQDN]:[port]/cb/api/v3'.
YOU SHOULD NOT ADD TRAILING SLASH '/' AT THE END OF SERVER_URL.

## Proxy Access
When you need to connect the Codebeamer server via a proxy server, then you have to set HTTP_PROXY and
HTTPS_PROXY environment variables.  These variables cannot be set in the .env file.

## Methods
Currently, these methods listed below are implemented.

- getProjects(): get a list of projects.
- getTrackerItems(): get a list of tracker items in the specified project.
- queryItems(): query items that meet the cBQL.
- createItem(): create an item in the specified tracker.
- updateItem(): update the specified item with the given data.
 
[!WARNING]
PTC does not support this program. Use this on your own responsibilities.




