import { Parser } from "cast.ts";

export class ApiService {
  apiOrigin = "http://192.168.80.72:8200";

  async get<T>(path: string, parser: Parser<T>) {
    let res = await fetch(this.apiOrigin + path, {
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

  async post<T>(path: string, body: object, parser: Parser<T>) {
    let res = await fetch(this.apiOrigin + path, {
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

  async patch<T>(path: string, body: object, parser: Parser<T>) {
    let res = await fetch(this.apiOrigin + path, {
      method: "PATCH",
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

  async delete<T>(path: string, body: object, parser: Parser<T>) {
    let res = await fetch(this.apiOrigin + path, {
      method: "DELETE",
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
}

export let api = new ApiService();
