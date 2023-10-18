import { Parser } from "cast.ts";
import { getToken } from "../utils/jwtToken";
import { apiOrigin } from "../utils/apiOrigin";

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
    token: string,
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
}

export let api = new ApiService();
