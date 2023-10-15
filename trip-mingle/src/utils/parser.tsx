import { array, boolean, nullable, number, object, string } from "cast.ts";

export const signUpResultParser = object({
  token: string(),
});

export const loginResultParser = object({
  token: string(),
});

export const checkResultParser = object({
  result: boolean(),
});

export const getProfileResultParser = object({
  intro: nullable(string()),
  language: nullable(string()),
  skill: nullable(string()),
  hobby: nullable(string()),
  countries_travelled: nullable(string()),
});

export const sendProfileResultParser = object({
  result: boolean(),
});
