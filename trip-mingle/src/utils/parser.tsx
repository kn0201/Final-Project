import {
  ParseResult,
  array,
  boolean,
  nullable,
  number,
  object,
  optional,
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

export const postDetailParser = object({
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
  user_id: number(),
  username: string(),
  avatar_path: string(),
  rating: number(),
  number_of_rating: number(),
  number_of_like: number(),
  number_of_reply: number(),
});

export const commentInfoParser = nullable(
  array(
    object({
      id: number(),
      content: string(),
      created_at: string(),
      user_id: number(),
      username: string(),
      avatar_path: string(),
      rating: number(),
      gender: boolean(),
      age: string(),
      country: string(),
      language: nullable(array(string())),
      hobby: nullable(array(string())),
      countries_travelled: nullable(array(string())),
      number_of_rating: number(),
    }),
  ),
);

export const addPostCountryListParser = array(
  object({
    id: string(),
    name: string(),
    code: string(),
  }),
);

export const getPostResultListParser = array(object({}));

export const addTourPostParser = object({ id: number() });

export const addCommentParser = object({ id: number() });

export const getIconResult = object({
  path: string(),
});

export const updateUsernameResultParser = object({
  result: boolean(),
});

export const markerParser = array(
  object({
    address: string(),
    latitude: number(),
    longitude: number(),
    place_id: string(),
    name: string(),
  }),
);

export const likeParser = object({ number_of_like: number() });

export const likeStatusParser = object({ isLike: boolean() });

export const bookmarkParser = object({ number_of_bookmark: number() });

export const bookmarkStatusParser = object({ isBookmark: boolean() });

export const getOtherProfileParser = object({
  avatar_path: string(),
  rating: number(),
  intro: nullable(string()),
  gender: boolean(),
  age: string(),
  country: string(),
  language: nullable(array(string())),
  hobby: nullable(array(string())),
  countries_travelled: nullable(array(string())),
  number_of_rating: number(),
  application_status: nullable(boolean()),
});

export const applicationInfoParser = nullable(
  array(
    object({
      id: number(),
      user_id: number(),
      username: string(),
      avatar_path: string(),
      status: boolean(),
      created_at: string(),
    }),
  ),
);

export const applyTourParser = object({});

export const applicationStatusParser = object({
  status: boolean(),
});

export const bookmarkInfoParser = array(
  object({
    id: nullable(number()),
    title: nullable(string()),
    trip_country: nullable(string()),
    trip_period: nullable(nullable(string())),
    status: nullable(string()),
    created_at: nullable(string()),
    username: nullable(string()),
    avatar_path: nullable(string()),
    rating: nullable(number()),
    number_of_rating: nullable(number()),
    number_of_like: nullable(number()),
    number_of_reply: nullable(number()),
    result: nullable(boolean()),
  }),
);

export const appliedUserParser = nullable(
  array(
    object({
      id: number(),
      user_id: number(),
      username: string(),
      avatar_path: string(),
      rating: number(),
      number_of_rating: number(),
      status: boolean(),
      created_at: string(),
    }),
  ),
);

export const acceptStatusParser = object({
  status: nullable(boolean()),
});
