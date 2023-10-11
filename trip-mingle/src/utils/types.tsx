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

/** AgendaEntry
 * name: string, height: number, day:string
 */
