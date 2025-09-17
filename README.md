# cbclient

Codebeamer Client for Deno.

This utility is written with [TypeScript](https://www.typescriptlang.org) and expected to run on [Deno](https://deno.com).

Codebeamer is an integrated ALM tool for systems engineering, software development, and hardware development by PTC inc.
It has a holistic functional set of accessing and modifying its data through open api, which is Swagger v3.
However, the api design is a bit huge, and one may see some kind of difficulties to use it.

This tool helps those who are not experienced in writing code using Codebeamer api.


## Examples
Initialize a Codebeamer client.
```ts
import * as types from "./types/index.ts";
import * as client from "./mod.ts";

const cb: types.cbinit = {
    username: Deno.env.get("USERNAME"),
    password: Deno.env.get("PASSWORD"),
    serverUrl: Deno.env.get("SERVER_URL"),
}

```
Get a list of a project.
```ts
const res = await client.getProjects(cb);
if (client.isProjectReference(res)) {
    console.log(JSON.stringify(res, null, 2));
}
```
Get a list of tracker items in a project.
```ts
const res = await client.getTrackerItems(cb, 123456); // tracker ID.
if (isTrackerItemReferenceSearchResult(res)) {
    do_somethitng();
}
```
query items.
```ts
const query = 'project.id IN (123456) AND tracker.id IN (987654)';
const res = await client.queryItems(cb, query, 1, 200); // 1 -> page number, 200 -> chunk size
if (isTrackerItemSearchResult(res)) {
    do_something();
}
```
create an item.

```ts
const item: types.TrackerItem = {
    summary: "summary",
    description: "description",
};

const res = await createItem(cb, 123456, item); // 123456 -> tracker ID
if (isTrackerItem(res)) {
    do_something();
}
```
update an item.
```ts
const value: types.AbstractFieldValue = {
    fieldId: 3,
    type: "TextFieldValue",
    name: "Summary",
    value: "name has been updated at " + new Date().toString() + "",
};
const item: types.UpdateTrackerItemField = {
    fieldValues: [value],
};

const res = await cbclient.updateItem(cb, 6574839, item); // 6574839 -> item ID. 
if (isTrackerItem(res)) {
    do_something();
}
```
bulk update items.

```ts
import {isBulkOperationResponse} from "./mod";

const value1: types.AbstractFieldValue = {
    fieldId: 3,
    type: "TextFieldValue",
    name: "Summary",
    value: "name has been updated at " + new Date().toString() + ", for value_1.",
};

const value2: types.AbstractFieldValue = {
    fieldId: 3,
    type: "TextFieldValue",
    name: "Summary",
    value: "name has been updated at " + new Date().toString() + ", for value_2.",
};

const item1: types.BulkUpdateTrackerItemFields = {
    itemId: 9999999, // item ID #1
    fieldValues: [value1]
};

const item2: types.BulkUpdateTrackerItemFields = {
    itemId: 8888888, // ItemId #2
    fieldValues: [value2]
};

const itemArray: Array<types.BulkUpdateTrackerItemFields> = [item1, item2];
const res = await cbclient.bulkUpdateItems(cb, itemArray);
if (isBulkOperationResponse(res)) {
    do_something();
}
```

Each Codebeamer Type has a corresponding type guard function whose name is "is\<Type\>". 
For example, a type guard for TrackerItem is 'isTrackerItem.'
Since most of the function returns Promise\<any\>, use the corresponding type guard function
to check if the response is of an expected type.

> [!NOTE]
> All interface is exported as type in the types/index.ts.

## Environment file
To connect to Codebeamer via open-api (aka Swagger v3), you need to be authenticated and authorized by
the Codebeamer server you are accessing to. To provide username and password to this utility, you need to
create a .env file at the same directory where this utility resides.

> [!WARNING]
> .env file has potential security risks of exposing your identity information to the public.
> Please use this tool with much care.  I will implement a more secure way in the future.

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
- bulkUpdateItems(): update multiple items with the given array of data.
 
> [!WARNING]
> PTC does not support this program. Use this on your own responsibilities.




