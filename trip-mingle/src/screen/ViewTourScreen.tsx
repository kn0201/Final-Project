import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ListRenderItemInfo,
  TouchableWithoutFeedback,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Modal,
  Keyboard,
} from "react-native";
import { ItemSeparatorView, setStarRating } from "./PostScreen";
import ManageTourScreenStyleSheet from "../StyleSheet/ManageTourScreenCss";
import { apiOrigin } from "../utils/apiOrigin";
import { ConfirmedUserItem, PostDetailItem } from "../utils/types";
import { api } from "../apis/api";
import {
  PlanListItem,
  allConfirmStatusParser,
  closePostParser,
  confirmStatusParser,
  confirmedUserParser,
  getMyPlanListParser,
  postDetailParser,
} from "../utils/parser";
import { useToken } from "../hooks/useToken";
import useEvent from "react-use-event";
import {
  AcceptEvent,
  ConfirmEvent,
  LoginEvent,
  RejectEvent,
  UpdateProfileEvent,
  CloseEvent,
} from "../utils/events";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import { useGet } from "../hooks/useGet";
import AddScheduleForm from "../components/AddScheduleForm";
import { useAppNavigation } from "../../navigators";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { iosBlue } from "../StyleSheet/StyleSheetHelper";
import { useNavigation } from "@react-navigation/native";

export default function ViewTourScreen({ route }: { route: any }) {
  const { token, payload, setToken } = useToken();
  let login_user_id = payload?.user_id;
  const { IonNeverDialog } = useIonNeverNotification();

  // Plan define
  const translateAnim = useRef(new Animated.Value(0)).current;
  const navigation = useAppNavigation();
  const { width, height } = Dimensions.get("screen");
  const openModal = () => {
    console.log("opened modal");
    Animated.timing(translateAnim, {
      duration: 500,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };
  const closeModal = () => {
    Animated.timing(translateAnim, {
      duration: 500,
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };
  const myPlanListResult = useGet("/planning/my-plans", getMyPlanListParser);
  const addNewScheduleCard = (newScheduleInfo: PlanListItem) => {
    myPlanListResult.setState((state) => ({
      planList: [...state!.planList, newScheduleInfo],
    }));
  };

  // Get post details
  const [post, setPost] = useState<PostDetailItem | null>();
  const getPostDetail = async () => {
    try {
      let postDetailData = await api.get(`/blog/${id}`, postDetailParser);
      setPost(postDetailData);
    } catch (err) {
      console.log({ err });
    }
  };
  useEffect(() => {
    getPostDetail();
  }, []);

  // Handle close
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const handleClose = () => {
    IonNeverDialog.show({
      type: "warning",
      title: `Do you confirm to close tour #${id}?`,
      message: ``,
      firstButtonVisible: true,
      firstButtonText: "Cancel",
      firstButtonFunction: () => {
        IonNeverDialog.dismiss();
      },
      secondButtonVisible: true,
      secondButtonText: "Close",
      secondButtonFunction: () => {
        closePost();
      },
    });
    setPopoverVisible(false);
  };
  const dispatchCloseEvent = useEvent<CloseEvent>("Close");
  const closePost = async () => {
    try {
      let result = await api.patch(
        `/blog/close/${id}`,
        { id },
        closePostParser,
        token,
      );
      if (result.result === true) {
        dispatchCloseEvent("Close");
      } else {
        throw new Error(`Unauthorized to close tour #${id}`);
      }
    } catch (err) {
      console.log({ err });
    }
  };
  useEvent<CloseEvent>("Close", (event) => {
    getPostDetail();
    checkCloseStatus();
  });

  // Params
  const { id, post_user_id } = route.params || {
    id: 0,
    post_user_id: 0,
  };

  // Header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "My Tour",
    }),
      [];
  });

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

  // Get close status
  const [closeStatus, setCloseStatus] = useState<boolean>(false);
  const checkCloseStatus = async () => {
    try {
      let result = await api.patch(
        `/application/closeStatus/${id}`,
        { id },
        closePostParser,
        token,
      );
      setCloseStatus(result.result);
      if (result.result === true) {
        dispatchCloseEvent("Close");
      }
    } catch (err) {
      console.log({ err });
    }
  };
  useEffect(() => {
    checkCloseStatus();
  }, []);

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
    navigation.navigate("ExplorePage", { screen: "Tour Detail" });
  });

  // Get approved list
  const [confirmedUsers, setConfirmedUsers] = useState<ConfirmedUserItem[]>([]);
  const confirmedUsersList: any[] = [];
  const getConfirmedUsersList = async () => {
    try {
      let result = await api.get(
        `/application/tour/${id}/${post_user_id}`,
        confirmedUserParser,
        token,
      );
      if (result) {
        for (let user of result) {
          confirmedUsersList.push(user.user_id);
        }
      }
      setConfirmedUsers(result);
      console.log(confirmedUsersList);
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

  // Get plan status
  const [startPlan, setStartPlan] = useState<boolean>(false);
  const checkPlanStatus = async () => {
    try {
      let result = await api.get(
        `/application/plan/${id}/${post_user_id}`,
        closePostParser,
        token,
      );
      setStartPlan(result.result);
    } catch (err) {
      console.log({ err });
    }
  };
  useEffect(() => {
    checkPlanStatus();
  }, []);

  useEvent<UpdateProfileEvent>("UpdateProfile", (event) => {
    getConfirmedUsersList();
  });
  useEvent<LoginEvent>("Login", (event) => {
    getConfirmedUsersList();
    getAllConfirmStatus();
    navigation.navigate("ExplorePage", { screen: "BuddiesPage" });
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
          {closeStatus === false ? (
            item.user_id == post_user_id ? (
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
            )
          ) : (
            <TouchableOpacity
              style={ManageTourScreenStyleSheet.button}
              onPress={() => {
                confirm(item.user_id, item.username);
              }}
            >
              <Text style={ManageTourScreenStyleSheet.text}>Rating</Text>
            </TouchableOpacity>
          )}
        </View>
      </>
    ),
    [],
  );

  return (
    <>
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
              paddingBottom: 5,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 5,
            }}
          >
            {startPlan === false ? (
              <TouchableOpacity
                style={ManageTourScreenStyleSheet.planButton}
                onPress={() => {
                  openModal();
                }}
              >
                <Text style={ManageTourScreenStyleSheet.planButtonText}>
                  Start Tour Planning
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={ManageTourScreenStyleSheet.planButton}
                onPress={() => {
                  openModal();
                }}
              >
                <Text style={ManageTourScreenStyleSheet.planButtonText}>
                  View Tour Planning
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <></>
        )}
        {login_user_id == post_user_id ? (
          <View
            style={{
              paddingBottom: 13,
              paddingLeft: 10,
              paddingRight: 10,
              paddingTop: 5,
            }}
          >
            <TouchableOpacity
              style={ManageTourScreenStyleSheet.planCloseButton}
              onPress={handleClose}
            >
              <Text style={ManageTourScreenStyleSheet.planButtonText}>
                Close This Tour
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
      <Animated.View
        style={[
          {
            width,
            height: height * 0.9,
            position: "absolute",
            top: height,
            zIndex: 1,
            backgroundColor: "white",
          },
          {
            transform: [
              {
                translateY: translateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -height],
                }),
              },
            ],
          },
        ]}
      >
        <AddScheduleForm
          closeModal={closeModal}
          addNewScheduleCard={addNewScheduleCard}
          confirmedUsersList={confirmedUsersList}
        />
      </Animated.View>
    </>
  );
}
