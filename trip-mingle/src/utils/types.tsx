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
  title: string;
  uri?: string;
};

export type PostInfo = {
  title: string;
  content: string;
  trip_country: string;
  trip_location: string | null;
  trip_period: string | null;
  trip_headcount: string;
  trip_budget: string | null;
  preferred_gender: string | null;
  preferred_age: string | null;
  preferred_language: string | null;
  preferred_hobby: string | null;
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
