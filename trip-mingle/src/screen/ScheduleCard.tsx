import { TouchableOpacity } from "react-native";
import { Card } from "@rneui/themed";
import { useAppNavigation } from "../../navigators";
import { api2 } from "../apis/api";
import { PlanListItem } from "./MySchedule";

export function ScheduleCard(props: { item: PlanListItem }) {
  const { item } = props;
  const navigation = useAppNavigation();
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("AddSchedule", { planId: item.plan_id })
      }
    >
      <Card>
        <Card.Title>
          <Text>{item.startDate.split("T")[0]}</Text>
          <Text>{item.plan_title}</Text>
          <Text>{item.endDate.split("T")[0]}</Text>
        </Card.Title>
        <Card.Divider />
        <Card.Image
          style={{ padding: 0, height: 200 }}
          source={{
            uri: api2.toImageURI(item.image_path),
          }}
        />
      </Card>
    </TouchableOpacity>
  );
}
