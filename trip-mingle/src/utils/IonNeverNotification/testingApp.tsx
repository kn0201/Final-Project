// Buffer Line
import { View, Text, Button } from "react-native";
import IonNeverNotificationRoot, {
  useIonNeverNotification,
} from "./NotificationProvider";

function TestingRootApp() {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  return (
    <IonNeverNotificationRoot>
      <View style={{ padding: 20 }}>
        <Button
          title="See Success Toast"
          onPress={() =>
            IonNeverToast.show({
              type: "success",
              title: "Using Success Toast",
            })
          }
        />
        <View>
          <Text>Break</Text>
        </View>
        <Button
          title="See Warning Toast"
          onPress={() =>
            IonNeverToast.show({
              type: "warning",
              title: "Using Warning Toast",
              autoClose: 500,
            })
          }
        />
        <View>
          <Text>Break</Text>
        </View>
        <Button
          title="See Info Toast"
          onPress={() =>
            IonNeverToast.show({ type: "info", title: "Using Info Toast" })
          }
        />
        <View>
          <Text>Break</Text>
        </View>
        <Button
          title="See Danger Toast"
          onPress={() =>
            IonNeverToast.show({ type: "danger", title: "Using Danger Toast" })
          }
        />
        <View>
          <Text>Break</Text>
        </View>
        <Button
          title="See success Dialog"
          onPress={() =>
            IonNeverDialog.show({
              type: "success",
              title: "Shown Successfully",
              // leftButtonVisible: true,
              // leftButtonFunction: () => {
              //   console.log("Left Button Pressed for No Reason");
              // },
            })
          }
        />
      </View>
    </IonNeverNotificationRoot>
  );
}

function TestingApp() {
  return (
    <IonNeverNotificationRoot>
      <TestingRootApp />
    </IonNeverNotificationRoot>
  );
}

export default TestingApp;
