import { boolean, object, string } from 'cast.ts';

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