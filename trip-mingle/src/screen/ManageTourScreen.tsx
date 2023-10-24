import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
} from "react-native";
import { ItemSeparatorView, setStarRating } from "./PostScreen";
import ManageTourScreenStyleSheet from "../StyleSheet/ManageTourScreenCss";
import { apiOrigin } from "../utils/apiOrigin";
import { AppliedUserItem } from "../utils/types";
import { api } from "../apis/api";
import { appliedUserParser } from "../utils/parser";
import { useToken } from "../hooks/useToken";

export default function OtherProfileScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { token, payload, setToken } = useToken();

  // Params
  const { id } = route.params || {
    id: 0,
  };

  // Header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Manage Tour",
    });
  }, []);

  // Select avatar
  const handleAvatarClick = (id: number, username: string, post_id: string) => {
    navigation.navigate("Other Profile", { id, username, post_id });
  };

  // Get application list
  const [applications, setApplications] = useState<AppliedUserItem[] | null>(
    [],
  );
  const getApplicationList = async () => {
    try {
      let applicationList = await api.get(
        `/application/users/${id}`,
        appliedUserParser,
        token,
      );
      setApplications(applicationList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getApplicationList();
  }, []);

  const flatListRef = useRef(null);
  const ItemView = useCallback(
    ({ item, index }: ListRenderItemInfo<AppliedUserItem>) => (
      <>
        <View style={ManageTourScreenStyleSheet.postDetailContainer}>
          <View style={{ flexDirection: "row" }}>
            <TouchableWithoutFeedback
              key={item.user_id}
              onPress={() => handleAvatarClick(item.user_id, item.username, id)}
            >
              <Image
                style={ManageTourScreenStyleSheet.avatar}
                source={{
                  uri: `${apiOrigin}/${item.avatar_path}`,
                }}
              />
            </TouchableWithoutFeedback>
            <View style={{ justifyContent: "center" }}>
              <Text style={{ fontWeight: "800" }}>
                #{index + 1} Application
              </Text>
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    marginRight: 5,
                    fontWeight: "600",
                  }}
                >
                  {item.username}
                </Text>
                {setStarRating(item.rating)}
                <Text> ({item.number_of_rating})</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={ManageTourScreenStyleSheet.button}
            onPress={() => {}}
          >
            <Text style={ManageTourScreenStyleSheet.text}>Accept</Text>
          </TouchableOpacity>
        </View>
      </>
    ),
    [],
  );

  return (
    <View style={{ flexGrow: 0 }}>
      <FlatList
        ref={flatListRef}
        data={applications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </View>
  );
}
