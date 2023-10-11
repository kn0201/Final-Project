// Buffer Line
import { useState, useEffect } from "react";
import { View, Text, FlatList, ListRenderItemInfo } from "react-native";
import { AgendaEventListItem } from "../utils/types";
import { AgendaSchedule } from "react-native-calendars";

function AgendaListItem(props: {
  data?: AgendaSchedule;
  selectedDate?: string;
}) {
  const [eventList, setEventList] = useState<AgendaEventListItem[]>([]);

  const renderItem = (listItem: ListRenderItemInfo<AgendaEventListItem>) => {
    const { date, name } = listItem.item;
    return (
      <View>
        <View>
          <Text>Date :</Text>
          <Text>{date}</Text>

          <View>
            <Text>{name}</Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    const eventItems: AgendaEventListItem[] = [];

    const dateEventObject = props.data || {};
    for (const date in dateEventObject) {
      if (props.selectedDate && props.selectedDate !== date) {
        continue;
      }
      dateEventObject[date].map((info) =>
        eventItems.push({ ...info, date } as AgendaEventListItem)
      );
    }

    setEventList(eventItems);
  }, [props.data, props.selectedDate]);

  return <FlatList data={eventList} renderItem={renderItem}></FlatList>;
}

export default AgendaListItem;
