// Buffer Line
import { useEffect } from "react";
import { View, Text, Button } from "react-native";
import IonNeverNotificationRoot, {
  useIonNeverNotification,
} from "./NotificationProvider";

function TestingRootApp() {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  useEffect(() => console.log("re-rendered"), []);

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
              firstButtonVisible: true,
              firstButtonFunction: () => {
                console.log("Left Button Pressed for No Reason");
              },
              secondButtonVisible: true,
            })
          }
        />
        <View>
          <Text>Break</Text>
        </View>
        <Button
          title="See warning Dialog"
          onPress={() =>
            IonNeverDialog.show({
              type: "warning",
              title: "Showed Warning",
              message: "This is a message",
              firstButtonVisible: true,
              firstButtonFunction: () => {
                console.log("Left Button Pressed for No Reason in another Div");
              },
            })
          }
        />
        <View>
          <Text>Break</Text>
        </View>
        <Button
          title="See Element Dialog"
          onPress={() =>
            IonNeverDialog.show({
              component: function RandomElement() {
                return (
                  <View>
                    <Text>This is a fake element</Text>
                  </View>
                );
              },
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
