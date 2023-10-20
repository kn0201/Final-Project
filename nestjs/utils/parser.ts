import {
  array,
  boolean,
  nullable,
  number,
  object,
  optional,
  string,
} from 'cast.ts';

export const loginParser = object({
  username: string({ trim: true, nonEmpty: true }),
  password: string({ trim: true, nonEmpty: true }),
});

export const signUpParser = object({
  username: string(),
  email: string(),
  password: string(),
  gender: boolean(),
  age: string(),
  country_id: number(),
});

export const checkUsernameParser = object({
  username: string(),
});

export const checkEmailParser = object({
  email: string(),
});

export const sendProfileParser = object({
  intro: string(),
  language: string(),
  hobby: string(),
  country: string(),
});

export const addTourPostParser = object({
  type: string(),
  title: string(),
  content: string(),
  trip_country: string(),
  trip_location: nullable(
    array(
      object({
        place_id: string(),
        name: string(),
        address: string(),
        latitude: number(),
        longitude: number(),
      }),
    ),
  ),
  trip_period: nullable(string()),
  trip_headcount: nullable(string()),
  trip_budget: nullable(string()),
  preferred_gender: nullable(boolean()),
  preferred_age: nullable(string()),
  preferred_language: nullable(string()),
  preferred_hobby: nullable(string()),
});

export const addNewPlanParser = object({
  start_time: string(),
  end_time: string(),
  location: string(),
});
export const updateUsernameParser = object({
  username: string(),
});
