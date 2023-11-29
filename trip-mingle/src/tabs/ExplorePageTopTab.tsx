import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Header } from "@rneui/base";
import TourScreen from "../screen/PostScreen";
import EnquireScreen from "../screen/EnquireScreen";
import { TouchableOpacity, View, Text, TextInput } from "react-native";
import { Icon } from "@rneui/themed";
import { iosBlue } from "../StyleSheet/StyleSheetHelper";
import UserPageStyleSheet from "../StyleSheet/UserPageCss";
import { useToken } from "../hooks/useToken";

const Tab = createMaterialTopTabNavigator();

//@ts-ignore
function ExplorePageTopTab({ navigation }) {
  const { token, payload, setToken } = useToken();
  return (
    <>
      <Header
        backgroundColor="#fff"
        centerComponent={{
          text: "EXPLORE",
          style: { color: "#000000", fontSize: 17, fontWeight: "600" },
        }}
        rightComponent={
          token ? (
            <View>
              <TouchableOpacity
                style={UserPageStyleSheet.rightComponent}
                onPress={() => navigation.navigate("New Post")}
              >
                <Text style={{ color: iosBlue }}>New Post </Text>
                <Icon
                  name="new-message"
                  type="entypo"
                  color={iosBlue}
                  size={20}
                  style={{ marginEnd: 8 }}
                ></Icon>
              </TouchableOpacity>
            </View>
          ) : (
            <></>
          )
        }
        containerStyle={{ width: "100%" }}
        placement="center"
      />

      <Tab.Navigator
        initialRouteName="Tour"
        screenOptions={{
          tabBarActiveTintColor: "#0a1128",
          tabBarLabelStyle: { fontSize: 10 },
          tabBarStyle: { backgroundColor: "#c4ffdb" },
        }}
      >
        <Tab.Screen
          name="Tour"
          component={TourScreen}
          options={{
            tabBarLabel: "Tour",
          }}
        />
        <Tab.Screen
          name="Enquire"
          component={EnquireScreen}
          options={{
            tabBarLabel: "Enquire",
          }}
        />
      </Tab.Navigator>
    </>
  );
}

//@ts-ignore
export default function BuddiesPage({ navigation }) {
  return <ExplorePageTopTab navigation={navigation} />;
}
