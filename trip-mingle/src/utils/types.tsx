import { AgendaEntry } from "react-native-calendars";

// Buffer Line
export type LoginInfo = {
  username: string;
  password: string;
};

export type RegisInfo = {
  username: string;
  email: string;
  password: string;
  gender: boolean;
  age: string;
  country_id: string;
  avatar: string;
};

export type AgendaEventListItem = {
  date: string;
} & AgendaEntry;

export type NewType = AgendaEntry & {
  id: number;
  startingDay: boolean;
  endingDay: boolean;
  color: string;
};

export type ProfileInfo = {
  intro: string;
  language: string;
  hobby: string;
  country: string;
};

export type ScheduleCardInfo = {
  id: number;
} & ScheduleCardInputInfo;

export type ScheduleCardInputInfo = {
  uri?: string;
  title: string;
  country?: string;
};

export type PostInfo = {
  type: string;
  title: string;
  content: string;
  trip_country: string;
  trip_location: string[] | null;
  trip_period: string | null;
  trip_headcount: string | null;
  trip_budget: string | null;
  preferred_gender: boolean | null;
  preferred_age: string | null;
  preferred_language: string | null;
  preferred_hobby: string | null;
};

type Location = {
  name: string;
  address: string;
  latitude: string;
  longitude: string;
};
export type PostInfoItem = {
  id: number;
  title: string;
  content: string;
  trip_country: string;
  trip_period: string | null;
  trip_headcount: number | null;
  trip_budget: string | null;
  preferred_gender: boolean | null;
  preferred_age: string | null;
  preferred_language: string | null;
  preferred_hobby: string | null;
  status: string | null;
  view: number;
  created_at: string;
  trip_location: Location[] | null;
  username: string;
  avatar_path: string;
  rating: number;
  number_of_rating: number;
  number_of_like: number;
  number_of_reply: number;
};

export type CountryList = {
  id: string;
  name: string;
};

export type AddPostCountryList = {
  id: string;
  name: string;
  code: string;
};
export type LanguageList = {
  id: string;
  name: string;
};

export type ScheduleItem = { id: number } & ScheduleItemInfo;

export type ScheduleItemInfo = {
  date: string;
  startTime: string;
  endTime: string;
  location: string;
};

export type UserLocation = {
  id: string;
  name: string;
};

export type Reply = {
  id: number;
  avatar_path: string;
  username: string;
  content: string;
  application: boolean;
  created_at: string;
};
