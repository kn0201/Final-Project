import { boolean, nullable, number, object, string } from "cast.ts";

export const signUpResult = object({
  username: string(),
  token: string(),
});

export const loginResult = object({
  username: string(),
  token: string(),
});

export const checkResult = object({
  result: boolean(),
});
