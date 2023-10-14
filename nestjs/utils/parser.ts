import { array, boolean, object, string } from 'cast.ts';

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
  country: string(),
});

export const checkerParser = object({
  username: string(),
});

export const sendProfileParser = object({
  intro: string(),
  language: array(string()),
  skill: string(),
  hobby: string(),
  countries_travelled: array(string()),
});
