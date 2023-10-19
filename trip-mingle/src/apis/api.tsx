import { Parser } from "cast.ts";
import { getToken } from "../utils/jwtToken";
import { apiOrigin } from "../utils/apiOrigin";

async function handleFetch<T>(
  path: string,
  init: RequestInit,
  parser: Parser<T>,
  token?: string
) {
  init.headers = {
    Accept: "application/json",
    Authorization: "Bearer " + token,
    ...init.headers,
  };
  let res = await fetch(apiOrigin + path, init);
  let json = await res.json();
  if (json.statusCode && json.message) {
    throw new Error(json.message);
  }
  if (json.error) {
    //   this.alertService.showError(json.error)
    throw new Error(json.error);
  }
  return parser.parse(json);
}

export let api = {
  async get<T>(path: string, parser: Parser<T>, token?: string) {
    return handleFetch(path, {}, parser, token);
  },

  async post<T>(path: string, body: object, parser: Parser<T>, token?: string) {
    return handleFetch(
      path,
      { headers: { "Content-Type": "application/json" } },
      parser,
      token
    );
  },

  async upload<T>(
    path: string,
    body: FormData,
    parser: Parser<T>,
    token: string
  ) {
    let res = await fetch(apiOrigin + path, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
      body,
    });
    let json = await res.json();
    return parser.parse(json);
  },

  async patch<T>(path: string, body: object, parser: Parser<T>, token: string) {
    let res = await fetch(apiOrigin + path, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });
    let json = await res.json();
    return parser.parse(json);
  },

  async delete<T>(
    path: string,
    body: object,
    parser: Parser<T>,
    token: string
  ) {
    let res = await fetch(apiOrigin + path, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });
    let json = await res.json();
    return parser.parse(json);
  },
};
