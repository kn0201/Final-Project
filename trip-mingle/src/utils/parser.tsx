import { array, boolean, nullable, number, object, string } from "cast.ts";

export const signUpResultParser = object({
  username: string(),
  token: string(),
});

export const loginResultParser = object({
  username: string(),
  token: string(),
});

export const checkResultParser = object({
  result: boolean(),
});

export const getProfileResultParser = object({
  intro: string(),
  language: string(),
  skill: string(),
  hobby: string(),
  countries_travelled: string(),
});

export const sendProfileResultParser = object({
  result: boolean(),
});
