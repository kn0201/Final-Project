import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
} from "react-native";
import * as React from "react";
import { Card, Header } from "@rneui/themed";
import { useToken } from "../hooks/useToken";

import { HomePageStyleSheet } from "../StyleSheet/HomePageCss";

import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { navigate } from "../tabs/RootNavigation";
import { iosBlue } from "../StyleSheet/StyleSheetHelper";
import { apiOrigin } from "../utils/apiOrigin";
import useEvent from "react-use-event";
import { MapEvent } from "../utils/events";
import { useAppNavigation } from "../../navigators";

export default function HomePage() {
  const navigation = useAppNavigation();
  const handleMapClick = (latitude: number, longitude: number) => {
    dispatchMapEvent({ map_type: "given" });
    navigation.navigate("Map", { center: { latitude, longitude } });
  };
  const dispatchMapEvent = useEvent<MapEvent>("FetchMap");
  return (
    <>
      <Header
        backgroundColor="white"
        centerComponent={{
          text: "Trip Mingle 伴旅",
          style: HomePageStyleSheet.header,
        }}
      ></Header>
      <ScrollView>
        <View style={HomePageStyleSheet.container}>
          <View>
            <Text style={HomePageStyleSheet.slogan}>
              Find a partner, Make every trip different
            </Text>
          </View>

          {/* <Demo /> */}

          <View style={HomePageStyleSheet.routeContainer}>
            <TouchableOpacity
              style={HomePageStyleSheet.routerBox}
              onPress={() => {
                navigate("ExplorePage");
              }}
            >
              <Ionicons name="compass-outline" color={"green"} size={40} />
              <Text>EXPLORE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={HomePageStyleSheet.routerBox}
              onPress={() => {
                navigate("Schedule");
              }}
            >
              <Fontisto name="suitcase" color={iosBlue} size={40} />
              <Text>SCHEDULE</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={HomePageStyleSheet.routerBox}
              onPress={() => {
                navigate("Map");
              }}
            >
              <Ionicons name="map" color={"pink"} size={40} />
              <Text>MAP</Text>
            </TouchableOpacity>
          </View>
          <View style={HomePageStyleSheet.cityContainer}>
            <Text style={HomePageStyleSheet.cityText}>熱門城市</Text>
            <View style={HomePageStyleSheet.cityBoxContainer}>
              <ImageBackground
                source={{ uri: `${apiOrigin}/tokyo.jpg` }}
                resizeMode="cover"
                style={HomePageStyleSheet.imageBackground}
              >
                <TouchableOpacity
                  style={HomePageStyleSheet.cityBox}
                  onPress={() => {
                    handleMapClick(35.68067105239987, 139.77101117113182);
                  }}
                >
                  <Text style={HomePageStyleSheet.cityBoxText}>Tokyo</Text>
                </TouchableOpacity>
              </ImageBackground>
              <ImageBackground
                source={{ uri: `${apiOrigin}/osaka.jpg` }}
                resizeMode="cover"
                style={HomePageStyleSheet.imageBackground}
              >
                <TouchableOpacity
                  style={HomePageStyleSheet.cityBox}
                  onPress={() => {
                    handleMapClick(34.67051164909746, 135.50732067897806);
                  }}
                >
                  <Text style={HomePageStyleSheet.cityBoxText}>Osaka</Text>
                </TouchableOpacity>
              </ImageBackground>
              <ImageBackground
                source={{ uri: `${apiOrigin}/kyoto.jpg` }}
                resizeMode="cover"
                style={HomePageStyleSheet.imageBackground}
              >
                <TouchableOpacity
                  style={HomePageStyleSheet.cityBox}
                  onPress={() => {
                    handleMapClick(35.0103980739476, 135.77241707783625);
                  }}
                >
                  <Text style={HomePageStyleSheet.cityBoxText}>Kyoto</Text>
                </TouchableOpacity>
              </ImageBackground>
              <ImageBackground
                source={{ uri: `${apiOrigin}/taipei.jpg` }}
                resizeMode="cover"
                style={HomePageStyleSheet.imageBackground}
              >
                <TouchableOpacity
                  style={HomePageStyleSheet.cityBox}
                  onPress={() => {
                    handleMapClick(25.037433085118813, 121.57084541372909);
                  }}
                >
                  <Text style={HomePageStyleSheet.cityBoxText}>Taipei</Text>
                </TouchableOpacity>
              </ImageBackground>
              <ImageBackground
                source={{ uri: `${apiOrigin}/seoul.jpg` }}
                resizeMode="cover"
                style={HomePageStyleSheet.imageBackground}
              >
                <TouchableOpacity
                  style={HomePageStyleSheet.cityBox}
                  onPress={() => {
                    handleMapClick(37.55668283726485, 127.00194584665272);
                  }}
                >
                  <Text style={HomePageStyleSheet.cityBoxText}>Seoul</Text>
                </TouchableOpacity>
              </ImageBackground>
              <ImageBackground
                source={{ uri: `${apiOrigin}/bangkok.jpg` }}
                resizeMode="cover"
                style={HomePageStyleSheet.imageBackground}
              >
                <TouchableOpacity
                  style={HomePageStyleSheet.cityBox}
                  onPress={() => {
                    handleMapClick(13.769276692527942, 100.51036378759723);
                  }}
                >
                  <Text style={HomePageStyleSheet.cityBoxText}>Bangkok</Text>
                </TouchableOpacity>
              </ImageBackground>
            </View>
          </View>

          <View>
            <Text style={HomePageStyleSheet.planText}>My Plan</Text>
            <TouchableOpacity>
              <Card>
                <Card.Title>Kyoto</Card.Title>
                <Card.Divider />
                <Card.Image
                  style={{ padding: 0, height: 200 }}
                  source={{
                    uri: `${apiOrigin}/kyoto_trip.jpg`,
                  }}
                />
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

// function Demo() {
//   const { token, payload, setToken } = useToken();

//   return (
//     <View>
//       <Text>Token: {JSON.stringify(token)}</Text>
//       <Text>Payload: {JSON.stringify(payload, null, 2)}</Text>
//       <Button onPress={() => setToken("")}>
//         <Text>logout</Text>
//       </Button>
//     </View>
//   );
// }
