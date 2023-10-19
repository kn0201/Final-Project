import {
  ParseResult,
  array,
  boolean,
  nullable,
  number,
  object,
  string,
} from "cast.ts";

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

export const languageListParser = countryListParser;
export type LanguageListItem = ParseResult<typeof languageListParser>[number];

export const postInfoParser = array(
  object({
    id: number(),
    title: string(),
    content: string(),
    trip_country: string(),
    trip_period: nullable(string()),
    trip_headcount: nullable(number()),
    trip_budget: nullable(string()),
    preferred_gender: nullable(boolean()),
    preferred_age: nullable(string()),
    preferred_language: nullable(string()),
    preferred_hobby: nullable(string()),
    status: nullable(string()),
    view: number(),
    created_at: string(),
    trip_location: nullable(
      array(
        object({
          name: string(),
          address: string(),
          latitude: string(),
          longitude: string(),
        }),
      ),
    ),
    username: string(),
    avatar_path: string(),
    rating: number(),
    number_of_rating: number(),
    number_of_like: number(),
    number_of_reply: number(),
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

export const getIconResult = object({
  path: nullable(string()),
});
