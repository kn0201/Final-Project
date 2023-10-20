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

export let api2 = {
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
    return handleFetch(
      path,
      {
        method: "POST",
        body,
      },
      parser,
      token
    );
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

  toImageURI(image_path: string) {
    if (image_path.startsWith("http://") || image_path.startsWith("https://")) {
      return image_path;
    }
    return apiOrigin + "/uploads/" + image_path;
  },
};

export class ApiService {
  async get<T>(path: string, parser: Parser<T>, token?: string) {
    let res = await fetch(apiOrigin + path, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
      },
    });
    let json = await res.json();
    if (json.error) {
      //   this.alertService.showError(json.error)

      throw new Error(json.error);
    }
    return parser.parse(json);
  }

  async post<T>(path: string, body: object, parser: Parser<T>, token?: string) {
    let res = await fetch(apiOrigin + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(body),
    });
    let json = await res.json();
    if (json.error) {
      //   this.alertService.showError(json.error)
      throw new Error(json.error);
    }
    return parser.parse(json);
  }

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
    if (json.error) {
      //   this.alertService.showError(json.error)
      throw new Error(json.error);
    }
    return parser.parse(json);
  }

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
    if (json.error) {
      //   this.alertService.showError(json.error)
      throw new Error(json.error);
    }
    return parser.parse(json);
  }
  async loginSignUp<T>(path: string, body: object, parser: Parser<T>) {
    let res = await fetch(apiOrigin + path, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    let json = await res.json();
    if (json.error) {
      //   this.alertService.showError(json.error)
      throw new Error(json.error);
    }
    return parser.parse(json);
  }
  async getList<T>(path: string, parser: Parser<T>) {
    let res = await fetch(apiOrigin + path, {
      headers: {
        Accept: "application/json",
      },
    });
    let json = await res.json();
    if (json.error) {
      //   this.alertService.showError(json.error)

      throw new Error(json.error);
    }
    return parser.parse(json);
  }
}

export let api = new ApiService();
