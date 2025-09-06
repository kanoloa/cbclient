export function add(a: number, b: number): number {
  return a + b;
}

// CodebeamerServer interface holds all the necessary information to access Codebeamer REST API.
interface CodebeamerServer {
  username: string | undefined;
  password: string | undefined;
  serverUrl: string | undefined;
  proxyUrl: string | undefined
}

const server: CodebeamerServer = {
  username: '',
  password: '',
  serverUrl: '',
  proxyUrl: ''
}

// Check if mandatory variables are passed from environments.
//
if (! Deno.env.get("USERNAME")) {
  console.log("USERNAME is missing in your environment variables.")
}

if (! Deno.env.get("PASSWORD")) {
  console.log("PASSWORD is missing in your environment variables.");
  Deno.exit(1);
}

if (! Deno.env.get("SERVER_URL")) {
  console.log("SERVER_URL is missing in your environment variables.");
  Deno.exit(1);
}

server.username = Deno.env.get("USERNAME");
server.password = Deno.env.get("PASSWORD");
server.serverUrl = Deno.env.get("SERVER_URL");

if (Deno.env.get("PROXY_URL")) {
  server.proxyUrl = Deno.env.get("PROXY_URL");
}

console.log("\n");
console.log("=== E N V I R O N M E N T S ===");
console.log("Username  : " + server.username);
console.log("Password  : " + server.password);
console.log("Server    : " + server.serverUrl);
console.log("Proxy     : " + server.proxyUrl);


