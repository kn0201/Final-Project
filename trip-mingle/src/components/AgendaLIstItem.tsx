// Buffer Line
import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
} from "react-native";
import { AgendaEventListItem, NewType } from "../utils/types";
import { AgendaSchedule } from "react-native-calendars";
import { Avatar, Card } from "react-native-paper";

function AgendaListItem(props: {
  data?: AgendaSchedule;
  selectedDate?: string;
}) {
  const [eventList, setEventList] = useState<AgendaEventListItem[]>([]);

  const renderItem = (listItem: ListRenderItemInfo<AgendaEventListItem>) => {
    const index = listItem.index;
    const { date, name, day } = listItem.item;

    return (
      <TouchableOpacity style={{ marginRight: 10, marginTop: 17 }}>
        <Card>
          <Card.Content>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>{date}</Text>
              <Text>{name}</Text>
              <Avatar.Text label={day} />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const eventItems: AgendaEventListItem[] = [];
    if (!props.data) return;

    const dateEventObject = props.data;
    for (const date in dateEventObject) {
      if (props.selectedDate && props.selectedDate !== date) {
        continue;
      }

      (dateEventObject[date as keyof AgendaSchedule] as NewType[]).map((info) =>
        eventItems.push({ ...info, date } as AgendaEventListItem)
      );
    }

    setEventList(eventItems);
  }, [props.data, props.selectedDate]);

  return <FlatList data={eventList} renderItem={renderItem}></FlatList>;
}

export default AgendaListItem;
