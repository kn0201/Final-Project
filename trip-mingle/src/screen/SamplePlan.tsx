import { View, Text, TouchableOpacity } from "react-native";
import { HomePageStyleSheet } from "../StyleSheet/HomePageCss";
import { Card, Header } from "@rneui/themed";
import SampleSchedule from "./SampleSchedule";

const SamplePlan = () => {
  <View>
    <Text style={HomePageStyleSheet.planText}>My Plan</Text>
    <TouchableOpacity onPress={() => SampleSchedule}>
      <Card>
        <Card.Title>Kyoto</Card.Title>
        <Card.Divider />
        <Card.Image
          style={{ padding: 0, height: 200 }}
          source={{
            uri: "https://www.budgetdirect.com.au/blog/wp-content/uploads/2018/03/Japan-Travel-Guide.jpg",
          }}
        />
      </Card>
    </TouchableOpacity>
  </View>;
};

export default SamplePlan;
