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
  trip_location: LocationPost[] | null;
  trip_period: string | null;
  trip_headcount: string | null;
  trip_budget: string | null;
  preferred_gender: boolean | null;
  preferred_age: string | null;
  preferred_language: string | null;
  preferred_hobby: string | null;
};

export type CommentInfo = {
  content: string;
};

type LocationPost = {
  place_id: string;
  name: string;
  address: string;
  latitude: string;
  longitude: string;
};
type LocationGet = {
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
  trip_location: LocationGet[] | null;
  username: string;
  avatar_path: string;
  rating: number;
  number_of_rating: number;
  number_of_like: number;
  number_of_reply: number;
};

export type PostDetailItem = {
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
  trip_location: LocationGet[] | null;
  user_id: number;
  username: string;
  avatar_path: string;
  rating: number;
  number_of_rating: number;
  number_of_like: number;
  number_of_reply: number;
};

export type ReplyInfoItem = {
  id: number;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
  avatar_path: string;
  rating: number;
  gender: boolean;
  age: string;
  country: string;
  language: string[] | null;
  hobby: string[] | null;
  countries_travelled: string[] | null;
  number_of_rating: number;
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
export type ScheduleMark = { id: number } & ScheduleDate;

export type ScheduleData = { [key: string]: ScheduleItem[] };

export type ScheduleItemInfo = {
  selectedDate: string;
  startTime: string;
  endTime: string;
  location: string;
  remark: string;
};

export type ScheduleDate = {
  startDate: string;
  endDate: string;
};

export type UserLocation = {
  id: string;
  name: string;
};

export type ProfileInfoItem = {
  avatar_path: string;
  rating: number;
  intro: string | null;
  gender: boolean;
  age: string;
  country: string;
  language: string[] | null;
  hobby: string[] | null;
  countries_travelled: string[] | null;
  number_of_rating: number;
  application_status: boolean | null;
};

export type ApplicationInfoItem = {
  id: number;
  user_id: number;
  username: string;
  avatar_path: string;
  status: boolean;
  created_at: string;
};

export type bookmarkInfoItem = {
  id: number;
  title: string;
  trip_country: string;
  trip_period: string;
  status: string;
  created_at: string;
  username: string;
  avatar_path: string;
  rating: number;
  number_of_rating: number;
  number_of_like: number;
  number_of_reply: number;
  result: boolean;
};
export type SpotInfo = {
  place_id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type SnapInfo = {
  trip_location: LocationPost[] | null;
};

export type AppliedUserItem = {
  id: number;
  user_id: number;
  username: string;
  avatar_path: string;
  rating: number;
  number_of_rating: number;
  status: boolean;
  created_at: string;
};

export type ConfirmedUserItem = {
  user_id: number;
  username: string;
  avatar_path: string;
  rating: number;
  number_of_rating: number;
};
