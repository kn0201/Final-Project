// Buffer Line
import React, {
  useState,
  useRef,
  useContext,
  createContext,
  ReactNode,
  Fragment,
} from "react";
import { View, Text, Animated, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import {
  NotificationChoices,
  NotificationContextInfo,
  ShowDialogParams,
  ShowToastParams,
} from "./utils/type";
import iconInfo from "./utils/iconInfo";
import providerStyleSheet from "./utils/NotificationProviderStyleSheet";
import useButton from "./utils/useButton";

const NotificationContext = createContext<NotificationContextInfo>({} as any);
export const useIonNeverNotification = () => {
  return useContext(NotificationContext);
};

function IonNeverNotificationRoot(props: { children: ReactNode }) {
  const defaultValues = {
    backgroundColor: "#F8FAFC",
    displayTime: 2500,
    leftButtonColor: "#0EA5E9",
    rightButtonColor: "#FD0050",
  };
  // const [dummyDivVisible, setDummyDivVisible] = useState<boolean>(false);
  // const [dummyDivDisabled, setDummyDivDisabled] = useState<boolean>(true);
  const [notificationType, setNotificationType] =
    useState<NotificationChoices>("success");
  const [title, setTitle] = useState<string>("Successfully Showed");
  const [message, setMessage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    defaultValues.backgroundColor
  );
  // const [DialogComponent, setDialogComponent] = useState<
  //   (() => JSX.Element) | null
  // >(null);

  let displayTime = useRef<number>(defaultValues.displayTime).current;

  const toastTranslateAnim = useRef(new Animated.Value(0)).current;
  const dialogTransformAnim = useRef(new Animated.Value(0)).current;

  const dismissDialog = () => {
    setBackgroundColor(defaultValues.backgroundColor);
    // setDialogComponent(null);
    // setDummyDivVisible(false);
    displayTime = defaultValues.displayTime;
  };

  // const leftButton = useButton(
  //   "OK",
  //   defaultValues.leftButtonColor,
  //   dismissDialog
  // );
  // const rightButton = useButton(
  //   "Cancel",
  //   defaultValues.rightButtonColor,
  //   dismissDialog
  // );

  const showToast = (toastParams: ShowToastParams) => {
    const { type, title, backgroundColor, autoClose } = toastParams;

    switch (true) {
      case ["success", "warning", "danger", "info"].indexOf(type) === -1:
        throw new Error("Notification Type undefined");
      case !title:
        throw new Error("No Title Received");
      case backgroundColor !== undefined && typeof backgroundColor !== "string":
        throw new Error("Background Color Input Invalid");
      case autoClose !== undefined && typeof autoClose !== "number":
        throw new Error("Invalid Auto-Close Time");
    }

    setTitle(title);
    setNotificationType(type);
    setBackgroundColor(backgroundColor || defaultValues.backgroundColor);
    displayTime = autoClose || defaultValues.displayTime;

    Animated.sequence([
      Animated.timing(toastTranslateAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(displayTime),
      Animated.timing(toastTranslateAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // const showDialog = (dialogParams: ShowDialogParams) => {
  //   const {
  //     type,
  //     title,
  //     backgroundColor,
  //     autoClose,
  //     component,
  //     message,
  //     leftButtonColor,
  //     leftButtonText,
  //     leftButtonVisible,
  //     leftButtonFunction,
  //     rightButtonColor,
  //     rightButtonText,
  //     rightButtonVisible,
  //     rightButtonFunction,
  //   } = dialogParams;

  //   if (component) return;

  //   switch (true) {
  //     case ["success", "warning", "danger", "info"].indexOf(type) === -1:
  //       throw new Error("Notification Type undefined");
  //     case !title:
  //       throw new Error("No Title Received");
  //     case backgroundColor !== undefined && typeof backgroundColor !== "string":
  //       throw new Error("Background Color Input Invalid");
  //     case autoClose !== undefined && typeof autoClose !== "number":
  //       throw new Error("Invalid Auto-Close Time");
  //     case message !== undefined && typeof message !== "string":
  //       throw new Error("Invalid Message Submitted");
  //     case leftButtonVisible:
  //       switch (true) {
  //         case leftButtonColor !== undefined &&
  //           typeof leftButtonColor !== "string":
  //           throw new Error("Button Color Invalid Input");
  //         case leftButtonText !== undefined &&
  //           typeof leftButtonText !== "string":
  //           throw new Error("Button Text Invalid");
  //       }

  //       leftButton.updateButtonColor(leftButtonColor || "#");
  //       break;
  //     case rightButtonVisible:
  //       switch (true) {
  //         case rightButtonColor !== undefined &&
  //           typeof rightButtonColor !== "string":
  //           throw new Error("Button Color Invalid Input");
  //         case rightButtonText !== undefined &&
  //           typeof rightButtonText !== "string":
  //           throw new Error("Button Text Invalid");
  //       }

  //       break;
  //   }

  //   setDialogComponent(null);
  //   setTitle(title);
  //   setMessage(message || null);
  //   setNotificationType(type);
  //   leftButton.updateButtonColor(leftButtonColor);
  //   leftButton.updateButtonText(leftButtonText);
  //   leftButton.updateButtonVisible(leftButtonVisible);
  //   leftButton.updateButtonFunction(leftButtonFunction);
  //   rightButton.updateButtonColor(rightButtonColor);
  //   rightButton.updateButtonText(rightButtonText);
  //   rightButton.updateButtonVisible(rightButtonVisible);
  //   rightButton.updateButtonFunction(rightButtonFunction);
  //   setDummyDivVisible(true);
  // };
  const showDialog = (dialogParams: ShowDialogParams) => {
    console.log("Unavailable at the moment");
  };

  function IconDiv(props: { iconType: NotificationChoices; iconSize: number }) {
    const { iconType, iconSize } = props;
    const { color, iconName } = iconInfo[iconType];
    return <AntDesign name={iconName as any} size={iconSize} color={color} />;
  }

  // function ButtonDiv(props: {
  //   largeButton: boolean;
  //   buttonColor: string;
  //   buttonText: string;
  //   // buttonFunction: () => void;
  // }) {
  //   const { largeButton, buttonColor, buttonText } = props;

  //   const buttonAction = () => {
  //     // buttonFunction();
  //     dismissDialog();
  //   };
  //   return (
  //     <View style={{ width: largeButton ? "80%" : "45%" }}>
  //       <TouchableOpacity
  //         onPress={() => buttonAction()}
  //         style={[
  //           { backgroundColor: buttonColor },
  //           providerStyleSheet.buttonDiv,
  //         ]}
  //       >
  //         <Text>{buttonText}</Text>
  //       </TouchableOpacity>
  //     </View>
  //   );
  // }

  const IonNeverToast = { show: showToast };
  const IonNeverDialog = { show: showDialog, dismiss: dismissDialog };

  return (
    <NotificationContext.Provider value={{ IonNeverToast, IonNeverDialog }}>
      <View style={providerStyleSheet.pageDiv}>{props.children}</View>
      <Animated.View
        style={[
          providerStyleSheet.toastDiv,
          {
            top: 5 - 180,
            transform: [
              {
                translateY: toastTranslateAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 180],
                }),
              },
            ],
          },
          {
            opacity: toastTranslateAnim.interpolate({
              inputRange: [0, 0.3, 1],
              outputRange: [0, 0, 1],
            }),
          },
          { backgroundColor },
        ]}
      >
        <View style={providerStyleSheet.iconDiv}>
          <IconDiv
            iconType={notificationType}
            iconSize={providerStyleSheet.titleText.fontSize * 1.25}
          />
        </View>
        <Text style={providerStyleSheet.titleText}>{title}</Text>
      </Animated.View>
      {/* {dummyDivVisible ? (
        <Fragment>
          <TouchableOpacity
            style={providerStyleSheet.dummyDiv}
            onPress={dismissDialog}
          />
          <Animated.View
            style={[{ backgroundColor }, providerStyleSheet.dialogDiv]}
          >
            {DialogComponent ? (
              <Fragment>
                <View style={{ zIndex: 1 }}>
                  <Text>Showed Component</Text>
                </View>
                <DialogComponent />
              </Fragment>
            ) : (
              <Fragment>
                <View>
                  <IconDiv iconType={notificationType} iconSize={60} />
                  <View style={providerStyleSheet.dialogTextDiv}>
                    <Text>{title}</Text>
                  </View>
                  {message ? (
                    <View style={providerStyleSheet.dialogTextDiv}>
                      <Text>{message}</Text>
                    </View>
                  ) : null}
                  <View style={providerStyleSheet.dialogButtonDiv}>
                    {leftButton.buttonVisible ? (
                      <ButtonDiv
                        largeButton={!rightButton.buttonVisible}
                        buttonColor={leftButton.buttonColor}
                        buttonText={leftButton.buttonText}
                        // buttonFunction={leftButton.buttonFunction}
                      />
                    ) : null}
                    {rightButton.buttonVisible ? (
                      <ButtonDiv
                        largeButton={false}
                        buttonColor={rightButton.buttonColor}
                        buttonText={rightButton.buttonText}
                        // buttonFunction={rightButton.buttonFunction}
                      />
                    ) : null}
                  </View>
                </View>
              </Fragment>
            )}
          </Animated.View>
        </Fragment>
      ) : (
        <View />
      )} */}
    </NotificationContext.Provider>
  );
}

export default IonNeverNotificationRoot;
