import { Parser } from "cast.ts";
import { getToken } from "../utils/jwtToken";
import { apiOrigin, wsOrigin } from "../utils/apiOrigin";
import io from "socket.io-client";

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
  // console.log("fetch", init.method || "GET", path);
  let res = await fetch(apiOrigin + path, init);
  // console.log("res:", res.status, res.statusText);
  // let text = await res.text()
  // console.log("text:", text);
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
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
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
    return handleFetch(
      path,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
      parser,
      token
    );
  },

  async delete<T>(
    path: string,
    body: object,
    parser: Parser<T>,
    token: string
  ) {
    return handleFetch(
      path,
      {
        method: "DELETE",
      },
      parser,
      token
    );
  },

  toImageURI(image_path: string) {
    if (image_path.startsWith("http://") || image_path.startsWith("https://")) {
      return image_path;
    }
    return apiOrigin + "/" + image_path;
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
    // let json = await res.json();
    // console.log("=".repeat(32));
    let text = await res.text();
    // console.log("GET", path);
    // console.log(text);
    // console.log("=".repeat(32));
    let json = JSON.parse(text);

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

console.log("connecting socket.io:", wsOrigin);

export let socket = io(wsOrigin);

socket.on("connect", () => {
  console.log("socket.io connect");
});

socket.on("connected", () => {
  console.log("socket.io connected");
});

socket.on("error", (error) => {
  console.log("socket.io error:", error);
});

socket.connect();
