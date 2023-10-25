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
import { ConfirmedUserItem } from "../utils/types";
import { api } from "../apis/api";
import {
  allConfirmStatusParser,
  confirmStatusParser,
  confirmedUserParser,
} from "../utils/parser";
import { useToken } from "../hooks/useToken";
import useEvent from "react-use-event";
import {
  AcceptEvent,
  ConfirmEvent,
  LoginEvent,
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
  const [isConfirm, setIsConfirm] = useState<boolean | null>(false);
  const dispatchConfirmEvent = useEvent<ConfirmEvent>("Confirm");
  const confirm = async (user_id: number, username: string) => {
    try {
      let updatedStatus = await api.patch(
        `/application/confirm/${id}/${user_id}`,
        { username },
        confirmStatusParser,
        token,
      );
      setIsConfirm(!isConfirm);
      dispatchConfirmEvent("Confirm");
    } catch (err) {
      console.log({ err });
    }
  };
  useEvent<ConfirmEvent>("Confirm", (event) => {
    getConfirmedUsersList();
  });
  useEvent<AcceptEvent>("Accept", (event) => {
    getConfirmedUsersList();
  });

  // Reject
  const dispatchRejectEvent = useEvent<RejectEvent>("Reject");
  const reject = async (user_id: number, username: string) => {
    try {
      let updatedStatus = await api.patch(
        `/application/reject/${id}/${user_id}`,
        { username },
        confirmStatusParser,
        token,
      );
      setIsConfirm(null);
      dispatchRejectEvent("Reject");
    } catch (err) {
      console.log({ err });
    }
  };
  useEvent<RejectEvent>("Reject", (event) => {
    getConfirmedUsersList();
    navigation.pop();
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

  // Get confirm status
  const [allConfirm, setAllConfirm] = useState<boolean>(false);
  const getAllConfirmStatus = async () => {
    try {
      let allConfirmStatus = await api.get(
        `/application/all/${id}`,
        allConfirmStatusParser,
      );
      setAllConfirm(allConfirmStatus?.result);
    } catch (err) {
      console.log({ err });
    }
  };
  useEffect(() => {
    getAllConfirmStatus();
  }, []);

  useEvent<UpdateProfileEvent>("UpdateProfile", (event) => {
    getConfirmedUsersList();
  });
  useEvent<LoginEvent>("Login", (event) => {
    getConfirmedUsersList();
    getAllConfirmStatus();
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
          {item.user_id == post_user_id ? (
            <></>
          ) : login_user_id === item.user_id ? (
            <View style={{ flexDirection: "row" }}>
              {item.confirm_status === false ? (
                <TouchableOpacity
                  style={ManageTourScreenStyleSheet.button}
                  onPress={() => {
                    confirm(item.user_id, item.username);
                  }}
                >
                  <Text style={ManageTourScreenStyleSheet.text}>Confirm</Text>
                </TouchableOpacity>
              ) : (
                <Text style={ManageTourScreenStyleSheet.statusText}>
                  Confirmed
                </Text>
              )}
              {item.confirm_status === false ? (
                <TouchableOpacity
                  style={ManageTourScreenStyleSheet.rejectButton}
                  onPress={() => {
                    reject(item.user_id, item.username);
                  }}
                >
                  <Text style={ManageTourScreenStyleSheet.text}>Reject</Text>
                </TouchableOpacity>
              ) : (
                <></>
              )}
            </View>
          ) : (
            <Text style={ManageTourScreenStyleSheet.statusText}>
              {item.user_id == post_user_id
                ? ""
                : item.confirm_status === false
                ? "Pending"
                : "Confirmed"}
            </Text>
          )}
        </View>
      </>
    ),
    [],
  );

  return (
    <View style={{ flexGrow: 1 }}>
      <FlatList
        data={confirmedUsers}
        keyExtractor={(item, index) => index.toString()}
        renderItem={ItemView}
        ItemSeparatorComponent={ItemSeparatorView}
      />

      {login_user_id == post_user_id && allConfirm === true ? (
        <View
          style={{
            paddingBottom: 13,
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 5,
          }}
        >
          <TouchableOpacity
            style={ManageTourScreenStyleSheet.planButton}
            // onPress={accept}
          >
            <Text style={ManageTourScreenStyleSheet.planButtonText}>
              Start Tour Planning
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
    </View>
  );
}
