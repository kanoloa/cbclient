export interface cbinit {
  username: string | undefined;
  password: string | undefined;
  serverUrl: string | undefined;
}

export interface ErrorResponse {
  message: string;
  resourceUri: string;
}
