//Buffer Line
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { ProfileInfoItem } from "../utils/types";
import { api } from "../apis/api";
import { acceptStatusParser, getOtherProfileParser } from "../utils/parser";
import OtherProfileScreenStyleSheet from "../StyleSheet/OtherProfileScreenCss";
import { Avatar } from "@rneui/themed";
import { apiOrigin } from "../utils/apiOrigin";
import { setStarRating } from "./PostScreen";
import { useToken } from "../hooks/useToken";
import { AcceptEvent, LoginEvent, UpdateProfileEvent } from "../utils/events";
import useEvent from "react-use-event";

export default function OtherProfileScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { token, payload, setToken } = useToken();
  let login_user_id = payload?.user_id;

  // Params
  const { id, username, post_id, post_user_id } = route.params || {
    id: 0,
    username: "User Profile",
    post_id: 0,
    post_user_id: 0,
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

  // Accept application
  const [isAccept, setIsAccept] = useState<boolean | null>();
  const dispatchAcceptEvent = useEvent<AcceptEvent>("Accept");
  const accept = async () => {
    try {
      let updatedStatus = await api.patch(
        `/application/${post_id}/${id}`,
        { username },
        acceptStatusParser,
        token,
      );
      if (isAccept !== null) {
        setIsAccept(!isAccept);
      }
      dispatchAcceptEvent("Accept");
    } catch (err) {
      console.log({ err });
    }
  };
  useEvent<AcceptEvent>("Accept", (event) => {
    getProfile();
  });

  // Get other user profile
  const [profileInfo, setProfileInfo] = useState<ProfileInfoItem>();
  const getProfile = async () => {
    let profile = await api.get(
      `/user/${post_id}/${id}/${post_user_id}`,
      getOtherProfileParser,
    );
    setProfileInfo(profile);
  };
  useEffect(() => {
    getProfile();
  }, []);
  useEvent<UpdateProfileEvent>("UpdateProfile", (event) => {
    getProfile();
  });
  useEvent<LoginEvent>("Login", (event) => {
    navigation.pop(2);
  });
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
                {profileInfo?.gender === true ? "Female" : "Male"}
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
        {login_user_id == post_user_id &&
        profileInfo?.application_status != null ? (
          <View
            style={{
              paddingBottom: 13,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 5,
            }}
          >
            <TouchableOpacity
              style={OtherProfileScreenStyleSheet.button}
              onPress={accept}
            >
              <Text style={OtherProfileScreenStyleSheet.text}>
                {profileInfo.application_status === false
                  ? `Accept the application for tour #${post_id}`
                  : `Cancel the acceptance for tour #${post_id}`}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ScrollView>
    </>
  );
}
