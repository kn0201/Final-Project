import { nullable, number, object, string } from "cast.ts";

export const signUpResult = object({
  username: string(),
  id: number(),
  role: string(),
});

export const loginResult = object({
  username: nullable(string()),
  id: nullable(number()),
  error: nullable(string()),
  role: nullable(string()),
});
