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
  country: string;
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
  skill: string;
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
