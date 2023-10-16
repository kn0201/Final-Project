import { array, boolean, number, object, string } from 'cast.ts';

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

export const checkerParser = object({
  username: string(),
});

export const sendProfileParser = object({
  intro: string(),
  language: string(),
  hobby: string(),
  country: string(),
});
