//Buffer Line
import { View, Text, ScrollView } from "react-native";
import { center, full } from "../StyleSheet/StyleSheetHelper";
import { useEffect, useState } from "react";
import { ProfileInfoItem } from "../utils/types";
import { api } from "../apis/api";
import { getOtherProfileParser } from "../utils/parser";
import OtherProfileScreenStyleSheet from "../StyleSheet/OtherProfileScreenCss";
import { Avatar } from "@rneui/themed";
import { apiOrigin } from "../utils/apiOrigin";
import { setStarRating } from "./PostScreen";

export default function OtherProfileScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  // Params
  const { id, username, post_id } = route.params || {
    id: 0,
    username: "User Profile",
    post_id: 0,
  };

  // Header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "500", fontSize: 24 }}>{username}</Text>
        </View>
      ),
    });
  }, []);

  // Get other user profile
  const [profileInfo, setProfileInfo] = useState<ProfileInfoItem>();
  const getProfile = async () => {
    let profile = await api.get(
      `/user/${post_id}/${id}`,
      getOtherProfileParser,
    );
    setProfileInfo(profile);
  };
  useEffect(() => {
    getProfile();
  }, []);
  const introString = profileInfo?.intro != null ? profileInfo?.intro : "";
  const languagesString = Array.isArray(profileInfo?.language)
    ? profileInfo?.language.join(", ")
    : "";
  const hobbiesString = Array.isArray(profileInfo?.hobby)
    ? profileInfo?.hobby.join(", ")
    : "";
  const travelledString = Array.isArray(profileInfo?.countries_travelled)
    ? profileInfo?.countries_travelled.join(", ")
    : "";

  return (
    <>
      <View style={OtherProfileScreenStyleSheet.container}>
        <Avatar
          size={120}
          rounded
          containerStyle={OtherProfileScreenStyleSheet.AvatarContainer}
          source={{
            uri: `${apiOrigin}/${profileInfo?.avatar_path}`,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {setStarRating(profileInfo?.rating ? profileInfo?.rating : 0)}
          <Text> ({profileInfo?.number_of_rating})</Text>
        </View>
      </View>
      <ScrollView>
        <View style={{ marginTop: 4 }}>
          <Text style={OtherProfileScreenStyleSheet.TitleText}>
            Introduction
          </Text>
          <View style={OtherProfileScreenStyleSheet.center}>
            <View style={OtherProfileScreenStyleSheet.inputContainer}>
              <Text style={OtherProfileScreenStyleSheet.inputText}>
                {introString}
              </Text>
            </View>
          </View>
          <Text style={OtherProfileScreenStyleSheet.TitleText}>Gender</Text>
          <View style={OtherProfileScreenStyleSheet.center}>
            <View style={OtherProfileScreenStyleSheet.inputContainer}>
              <Text style={OtherProfileScreenStyleSheet.inputText}>
                {profileInfo?.gender === true ? "Male" : "Female"}
              </Text>
            </View>
          </View>
          <Text style={OtherProfileScreenStyleSheet.TitleText}>Age Group</Text>
          <View style={OtherProfileScreenStyleSheet.center}>
            <View style={OtherProfileScreenStyleSheet.inputContainer}>
              <Text style={OtherProfileScreenStyleSheet.inputText}>
                {profileInfo?.age}
              </Text>
            </View>
          </View>
          <Text style={OtherProfileScreenStyleSheet.TitleText}>
            Country/Region of Nationality
          </Text>
          <View style={OtherProfileScreenStyleSheet.center}>
            <View style={OtherProfileScreenStyleSheet.inputContainer}>
              <Text style={OtherProfileScreenStyleSheet.inputText}>
                {profileInfo?.country}
              </Text>
            </View>
          </View>
          <Text style={OtherProfileScreenStyleSheet.TitleText}>
            Preferred Languages
          </Text>
          <View style={OtherProfileScreenStyleSheet.center}>
            <View style={OtherProfileScreenStyleSheet.inputContainer}>
              <Text style={OtherProfileScreenStyleSheet.inputText}>
                {languagesString}
              </Text>
            </View>
          </View>
          <Text style={OtherProfileScreenStyleSheet.TitleText}>Hobbies</Text>
          <View style={OtherProfileScreenStyleSheet.center}>
            <View style={OtherProfileScreenStyleSheet.inputContainer}>
              <Text style={OtherProfileScreenStyleSheet.inputText}>
                {hobbiesString}
              </Text>
            </View>
          </View>
          <Text style={OtherProfileScreenStyleSheet.TitleText}>
            Travel History
          </Text>
          <View style={OtherProfileScreenStyleSheet.center}>
            <View style={OtherProfileScreenStyleSheet.inputContainer}>
              <Text style={OtherProfileScreenStyleSheet.inputText}>
                {travelledString}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
