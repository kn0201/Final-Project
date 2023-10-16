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
  language: nullable(array(object({ name: string() }))),
  hobby: nullable(array(object({ name: string() }))),
  countries_travelled: nullable(array(object({ name: string() }))),
});

export const sendProfileResultParser = object({
  result: boolean(),
});

export const countryListParser = array(
  object({
    id: string(),
    name: string(),
  })
);
