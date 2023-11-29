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
import { acceptStatusParser, appliedUserParser } from "../utils/parser";
import { useToken } from "../hooks/useToken";
import useEvent from "react-use-event";
import {
  AcceptEvent,
  ConfirmEvent,
  LoginEvent,
  RatingEvent,
  RejectEvent,
  UpdateProfileEvent,
} from "../utils/events";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";

export default function OtherProfileScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { token, payload } = useToken();
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
      headerTitle: "Manage Tour",
    });
  }, []);

  // Select avatar
  const handleAvatarClick = (
    id: number,
    username: string,
    post_id: string,
    post_user_id?: string
  ) => {
    navigation.navigate("Other Profile", {
      id,
      username,
      post_id,
      post_user_id,
    });
  };

  // Accept
  const [isAccept, setIsAccept] = useState<boolean | null>();
  const dispatchAcceptEvent = useEvent<AcceptEvent>("Accept");
  const accept = async (user_id: number, username: string) => {
    try {
      let updatedStatus = await api.patch(
        `/application/${id}/${user_id}`,
        { username },
        acceptStatusParser,
        token
      );
      if (updatedStatus.status !== true && updatedStatus.status !== false) {
        throw new Error();
      }
      if (isAccept !== null) {
        setIsAccept(!isAccept);
      }
      dispatchAcceptEvent("Accept");
    } catch (err) {
      IonNeverDialog.show({
        type: "warning",
        title: "Error",
        message: `The targeted member number for the tour #${id} may have been reached`,
        firstButtonVisible: true,
        firstButtonFunction: () => {
          IonNeverDialog.dismiss();
        },
      });
      console.log({ err });
    }
  };
  useEvent<AcceptEvent>("Accept", (event) => {
    getApplicationList();
  });

  // Get application list
  const [applications, setApplications] = useState<AppliedUserItem[] | null>(
    []
  );
  const getApplicationList = async () => {
    try {
      let applicationList = await api.get(
        `/application/users/${id}`,
        appliedUserParser,
        token
      );
      setApplications(applicationList);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getApplicationList();
  }, []);
  useEvent<UpdateProfileEvent>("UpdateProfile", (event) => {
    getApplicationList();
  });
  useEvent<LoginEvent>("Login", (event) => {
    getApplicationList();
    navigation.pop(2);
  });
  useEvent<RejectEvent>("Reject", (event) => {
    getApplicationList();
  });
  useEvent<ConfirmEvent>("Confirm", (event) => {
    getApplicationList();
  });
  useEvent<CloseEvent>("Close", (event) => {
    getApplicationList();
  });
  useEvent<RatingEvent>("Rating", (event) => {
    getApplicationList();
  });

  const ItemView = useCallback(
    ({ item, index }: ListRenderItemInfo<AppliedUserItem>) => (
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
              <Text style={{ fontWeight: "800" }}>#{index + 1} Member</Text>
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
          {item.confirm_status === true ? (
            <></>
          ) : (
            <TouchableOpacity
              style={ManageTourScreenStyleSheet.button}
              onPress={() => {
                accept(item.user_id, item.username);
              }}
            >
              <Text style={ManageTourScreenStyleSheet.text}>
                {item.status === false ? "Accept" : "Cancel"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    ),
    []
  );

  return (
    <View style={{ flexGrow: 1 }}>
      <FlatList
        data={applications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ItemSeparatorComponent={ItemSeparatorView}
      />
    </View>
  );
}
