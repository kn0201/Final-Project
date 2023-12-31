import {
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Image,
} from "react-native";

import { Card, Header } from "@rneui/themed";
import { useToken } from "../hooks/useToken";

import { HomePageStyleSheet } from "../StyleSheet/HomePageCss";

import Ionicons from "react-native-vector-icons/Ionicons";
import Fontisto from "react-native-vector-icons/Fontisto";
import { navigate } from "../tabs/RootNavigation";
import { center, flex, iosBlue, white } from "../StyleSheet/StyleSheetHelper";
import { apiOrigin } from "../utils/apiOrigin";
import useEvent from "react-use-event";
import { MapEvent, MapPositionEvent } from "../utils/events";
import { useAppNavigation } from "../../navigators";
import { LinearGradient } from "expo-linear-gradient";
import { api, api2 } from "../apis/api";
import { object } from "cast.ts";
import { useEffect } from "react";
import { newParser } from "../utils/parser";
import { theme } from "../theme/variables";

export default function HomePage() {
  const { token } = useToken();
  const navigation = useAppNavigation();
  const handleMapClick = (latitude: number, longitude: number) => {
    const center = { latitude, longitude };
    const params = { center };
    console.log("HomePage, go to map:", params);
    dispatchMapEvent(params);
    navigation.navigate("MapPage", {
      screen: "MapScreen",
      params: {
        center,
      },
    });
  };
  const dispatchMapEvent = useEvent<MapPositionEvent>("MapPosition");

  // const getNewPost = async () => {
  //   let res = await api.get("/user/new", newParser);
  //   console.log(res);
  // };

  // useEffect(() => {
  //   getNewPost();
  // }, [token]);
  return (
    <>
      <LinearGradient
        // Background Linear Gradient
        colors={["#FFFFFF", theme.background]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "100%",
        }}
      />
      <Header
        backgroundColor="transparent"
        centerComponent={{
          text: "Trip Mingle 伴旅",
          style: HomePageStyleSheet.header,
        }}
      ></Header>
      <View>
        <ScrollView>
          <View style={HomePageStyleSheet.container}>
            <View
              style={{
                display: flex,
                alignItems: center,
                justifyContent: center,
              }}
            >
              <Image
                source={{ uri: `${apiOrigin}/trip_mingle_logo_2.png` }}
                style={{
                  width: 150,
                  height: 150,
                }}
              />
            </View>
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
                  navigate("MapPage", { screen: "MapScreen" });
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
                  imageStyle={{ borderRadius: 10 }}
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
                  imageStyle={{ borderRadius: 10 }}
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
                  imageStyle={{ borderRadius: 10 }}
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
                  imageStyle={{ borderRadius: 10 }}
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
                  imageStyle={{ borderRadius: 10 }}
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
                  imageStyle={{ borderRadius: 10 }}
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
          </View>
        </ScrollView>
      </View>
    </>
  );
}
