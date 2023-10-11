import { AgendaEntry } from "react-native-calendars";

// Buffer Line
export type LoginInfo = {
  username: string;
  password: string;
};

export type AgendaEventListItem = {
  date: string;
} & AgendaEntry;

/** AgendaEntry
 * name: string, height: number, day:string
 */
