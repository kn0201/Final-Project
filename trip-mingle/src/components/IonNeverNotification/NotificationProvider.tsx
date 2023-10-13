// Buffer Line
import React, {
  useState,
  useRef,
  useContext,
  createContext,
  ReactNode,
  Fragment,
  useEffect,
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
import providerStyleSheet, {
  dialogDivPositioning,
} from "./utils/NotificationProviderStyleSheet";
import useButton from "./utils/useButton";

const NotificationContext = createContext<NotificationContextInfo>({} as any);
export const useIonNeverNotification = () => {
  return useContext(NotificationContext);
};

function IonNeverNotificationRoot(props: { children: ReactNode }) {
  const defaultValues = {
    backgroundColor: "#F8FAFC",
    leftButtonColor: "#2FD0FD",
    rightButtonColor: "#FD0050",
    displayTime: 2500,
    dialogHeight: 300,
  };
  const [dummyDivVisible, setDummyDivVisible] = useState<boolean>(false);
  const [dummyDivDisabled, setDummyDivDisabled] = useState<boolean>(true);
  const [notificationType, setNotificationType] =
    useState<NotificationChoices>("success");
  const [title, setTitle] = useState<string>("Successfully Showed");
  const [message, setMessage] = useState<string | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>(
    defaultValues.backgroundColor,
  );
  const [dialogHeight, setDialogHeight] = useState<number>(
    defaultValues.dialogHeight,
  );
  const [DialogComponent, setDialogComponent] = useState<
    (() => JSX.Element) | null
  >(null);

  let displayTime = useRef<number>(defaultValues.displayTime).current;

  const toastTranslateAnim = useRef(new Animated.Value(0)).current;
  const dialogTransformAnim = useRef(new Animated.Value(0)).current;

  const dismissDialog = () => {
    setBackgroundColor(defaultValues.backgroundColor);
    setDialogComponent(null);
    displayTime = defaultValues.displayTime;

    setDummyDivDisabled(true);
    Animated.timing(dialogTransformAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start(() => setDummyDivVisible(false));

    dialogTransformAnim.resetAnimation();
  };

  const leftButton = useButton(
    "OK",
    defaultValues.leftButtonColor,
    dismissDialog,
  );
  const rightButton = useButton(
    "Cancel",
    defaultValues.rightButtonColor,
    dismissDialog,
  );

  const showToast = (toastParams: ShowToastParams) => {
    const { type, title, backgroundColor, autoClose } = toastParams;

    switch (true) {
      case ["success", "warning", "danger", "info"].indexOf(type) === -1:
        throw new Error("Notification Type undefined");
      case !title:
        throw new Error("title is required");
      case backgroundColor !== undefined && typeof backgroundColor !== "string":
        throw new Error("backgroundColor must be of type 'string'");
      case autoClose !== undefined && typeof autoClose !== "number":
        throw new Error("autoClose must be of type 'number'");
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

  const showDialog = (dialogParams: ShowDialogParams) => {
    const {
      type,
      title,
      backgroundColor,
      dialogHeight,
      autoClose,
      component,
      message,
      firstButtonColor,
      firstButtonText,
      firstButtonVisible,
      firstButtonFunction,
      secondButtonColor,
      secondButtonText,
      secondButtonVisible,
      secondButtonFunction,
    } = dialogParams;

    if (dialogHeight) {
      if (typeof dialogHeight !== "number") {
        throw new Error("dialogHeight must be of type 'number'");
      } else if (dialogHeight < defaultValues.dialogHeight) {
        throw new Error(`minimum dialogHeight = ${defaultValues.dialogHeight}`);
      }
    }
    setDialogHeight(dialogHeight || defaultValues.dialogHeight);
    if (component) {
      setDialogComponent(() => component);
    } else {
      switch (true) {
        case ["success", "warning", "danger", "info"].indexOf(
          type || "undefined",
        ) === -1:
          throw new Error("Notification Type undefined");
        case !title:
          throw new Error("title is required");
        case backgroundColor !== undefined &&
          typeof backgroundColor !== "string":
          throw new Error("backgroundColor must be of type 'string'");
        case autoClose !== undefined && typeof autoClose !== "number":
          throw new Error("autoClose must be of type 'number'");
        case message !== undefined && typeof message !== "string":
          throw new Error("message must be of type 'string' if provided");
        case firstButtonVisible:
          switch (true) {
            case firstButtonColor !== undefined &&
              typeof firstButtonColor !== "string":
              throw new Error("buttonColor must be of type 'string'");
            case firstButtonText !== undefined &&
              typeof firstButtonText !== "string":
              throw new Error("buttonText must be of type 'string'");
          }

          leftButton.updateButtonColor(
            firstButtonColor || defaultValues.leftButtonColor,
          );

          if (secondButtonVisible) {
            switch (true) {
              case secondButtonColor !== undefined &&
                typeof secondButtonColor !== "string":
                throw new Error("buttonColor must be of type 'string'");
              case secondButtonText !== undefined &&
                typeof secondButtonText !== "string":
                throw new Error("buttonText must be of type 'string'");
            }
          }
          break;
      }
      setDialogComponent(null);
    }

    setTitle(title || "An Error Occurred");
    setMessage(message || null);
    setNotificationType(type || "success");
    setBackgroundColor(backgroundColor || defaultValues.backgroundColor);
    leftButton.updateButtonColor(firstButtonColor);
    leftButton.updateButtonText(firstButtonText);
    leftButton.updateButtonVisible(firstButtonVisible);
    leftButton.updateButtonFunction(firstButtonFunction);
    rightButton.updateButtonColor(secondButtonColor);
    rightButton.updateButtonText(secondButtonText);
    rightButton.updateButtonVisible(secondButtonVisible);
    rightButton.updateButtonFunction(secondButtonFunction);

    Animated.timing(dialogTransformAnim, {
      toValue: 0.5,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setDummyDivVisible(true);
    });
    Animated.timing(dialogTransformAnim, {
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setDummyDivDisabled(false);
    });
  };

  function IconDiv(props: { iconType: NotificationChoices; iconSize: number }) {
    const { iconType, iconSize } = props;
    const { color, iconName } = iconInfo[iconType];
    return <AntDesign name={iconName as any} size={iconSize} color={color} />;
  }

  function ButtonDiv(props: {
    largeButton: boolean;
    buttonColor: string;
    buttonText: string;
    buttonFunction: () => void;
  }) {
    const { largeButton, buttonColor, buttonText, buttonFunction } = props;

    const buttonAction = () => {
      buttonFunction();
      dismissDialog();
    };

    return (
      <View
        style={[
          {
            width: largeButton ? "80%" : "65%",
          },
          providerStyleSheet.buttonOuterDiv,
        ]}
      >
        <TouchableOpacity
          onPress={buttonAction}
          style={[
            { backgroundColor: buttonColor },
            providerStyleSheet.buttonDiv,
          ]}
        >
          <Text style={providerStyleSheet.dialogButtonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
                  outputRange: [0, 200],
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
      {dummyDivVisible ? (
        <Fragment>
          <TouchableOpacity
            style={providerStyleSheet.dummyDiv}
            disabled={dummyDivDisabled}
            activeOpacity={0.6}
            onPress={dismissDialog}
          />
          <Animated.View
            style={[
              { backgroundColor, height: dialogHeight },
              providerStyleSheet.dialogDiv,
              dialogDivPositioning(dialogHeight),
              {
                transform: [
                  {
                    scale: dialogTransformAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            {DialogComponent ? (
              <>
                <DialogComponent />
              </>
            ) : (
              <View style={providerStyleSheet.dialogInnerDiv}>
                <View style={{ width: "100%" }}>
                  <View style={providerStyleSheet.dialogIconDiv}>
                    <IconDiv iconType={notificationType} iconSize={72} />
                  </View>
                  <View
                    style={[
                      providerStyleSheet.dialogTextDiv,
                      { marginVertical: 10 },
                    ]}
                  >
                    <Text style={providerStyleSheet.dialogTitleText}>
                      {title}
                    </Text>
                  </View>
                  {message ? (
                    <View style={providerStyleSheet.dialogTextDiv}>
                      <Text style={providerStyleSheet.dialogMessageText}>
                        {message}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <View style={providerStyleSheet.dialogButtonDiv}>
                  {leftButton.buttonVisible ? (
                    <ButtonDiv
                      largeButton={!rightButton.buttonVisible}
                      buttonColor={leftButton.buttonColor}
                      buttonText={leftButton.buttonText}
                      buttonFunction={leftButton.buttonFunction}
                    />
                  ) : null}
                  {rightButton.buttonVisible ? (
                    <ButtonDiv
                      largeButton={false}
                      buttonColor={rightButton.buttonColor}
                      buttonText={rightButton.buttonText}
                      buttonFunction={rightButton.buttonFunction}
                    />
                  ) : null}
                </View>
              </View>
            )}
          </Animated.View>
        </Fragment>
      ) : (
        <View />
      )}
    </NotificationContext.Provider>
  );
}

export default IonNeverNotificationRoot;
