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
import { AppliedUserItem, ConfirmedUserItem } from "../utils/types";
import { api } from "../apis/api";
import {
  acceptStatusParser,
  appliedUserParser,
  confirmedUserParser,
} from "../utils/parser";
import { useToken } from "../hooks/useToken";
import useEvent from "react-use-event";
import { AcceptEvent, LoginEvent, UpdateProfileEvent } from "../utils/events";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";

export default function OtherProfileScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { token, payload, setToken } = useToken();
  let login_user_id = payload?.user_id;
  const { IonNeverDialog } = useIonNeverNotification();

  // Params
  const { id, post_user_id } = route.params || {
    id: 0,
    post_user_id: 0,
  };

  // Header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Tour Member",
    });
  }, []);

  // Select avatar
  const handleAvatarClick = (
    id: number,
    username: string,
    post_id: string,
    post_user_id?: string,
  ) => {
    navigation.navigate("Other Profile", {
      id,
      username,
      post_id,
      post_user_id,
    });
  };

  // Confirm
  const [isAccept, setIsAccept] = useState<boolean | null>();
  const dispatchAcceptEvent = useEvent<AcceptEvent>("Accept");
  const confirm = async (user_id: number, username: string) => {
    try {
      let updatedStatus = await api.patch(
        `/application/${id}/${user_id}`,
        { username },
        acceptStatusParser,
        token,
      );
      if (isAccept !== null) {
        setIsAccept(!isAccept);
      }
      dispatchAcceptEvent("Accept");
    } catch (err) {
      IonNeverDialog.show({
        type: "warning",
        title: "Error",
        message: `The targeted member number for the tour #${id} has been reached`,
        firstButtonVisible: true,
        firstButtonFunction: () => {
          IonNeverDialog.dismiss();
        },
      });
      console.log({ err });
    }
  };
  useEvent<AcceptEvent>("Accept", (event) => {
    getConfirmedUsersList();
  });

  // Get approved list
  const [confirmedUsers, setConfirmedUsers] = useState<ConfirmedUserItem[]>([]);
  const getConfirmedUsersList = async () => {
    try {
      let confirmedUsersList = await api.get(
        `/application/tour/${id}/${post_user_id}`,
        confirmedUserParser,
        token,
      );
      setConfirmedUsers(confirmedUsersList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getConfirmedUsersList();
  }, []);
  useEvent<UpdateProfileEvent>("UpdateProfile", (event) => {
    getConfirmedUsersList();
  });
  useEvent<LoginEvent>("Login", (event) => {
    getConfirmedUsersList();
    navigation.pop(2);
  });

  const ItemView = useCallback(
    ({ item, index }: ListRenderItemInfo<ConfirmedUserItem>) => (
      <>
        <View style={ManageTourScreenStyleSheet.postDetailContainer}>
          <View style={{ flexDirection: "row" }}>
            <TouchableWithoutFeedback
              key={item.user_id}
              onPress={() =>
                handleAvatarClick(item.user_id, item.username, id, post_user_id)
              }
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
            onPress={() => {
              confirm(item.user_id, item.username);
            }}
          >
            <Text style={ManageTourScreenStyleSheet.text}>
              {/* { "Accept" : "Cancel"} */}
            </Text>
          </TouchableOpacity>
        </View>
      </>
    ),
    [],
  );

  return (
    <View style={{ flexGrow: 0 }}>
      <FlatList
        data={confirmedUsers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </View>
  );
}
