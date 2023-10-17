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
  language: nullable(array(object({ name: string(), id: string() }))),
  hobby: nullable(array(object({ name: string(), id: string() }))),
  countries_travelled: nullable(
    array(object({ name: string(), id: string() })),
  ),
});

export const sendProfileResultParser = object({
  result: boolean(),
});

export const countryListParser = array(
  object({
    id: string(),
    name: string(),
  }),
);

export const addPostCountryListParser = array(
  object({
    id: string(),
    name: string(),
    code: string(),
  }),
);

export const getPostResultListParser = array(object({}));

export const addTourPostParser = object({});
