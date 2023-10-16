import { useState } from "react";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
  Text,
} from "react-native";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import { CheckBox } from "@rneui/themed";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

const SingleSelectorWithOther = ({
  //@ts-ignore
  setHeadcount,
  //@ts-ignore
  setSelectedHeadcount,
  //@ts-ignore
  setHeadcountListData,
  //@ts-ignore
  headcount,
  //@ts-ignore
  headcountListData,
}) => {
  const { IonNeverDialog } = useIonNeverNotification();
  const [localHeadcount, setLocalHeadcount] = useState<string>(headcount);
  const [otherHeadcount, setOtherHeadcount] = useState<string>("");

  return (
    <>
      <ScrollView
        horizontal={false}
        style={AddPostPageStyleSheet.AgeScrollViewContainer}
      >
        {[...headcountListData, "Other: "].map(
          (label: string, index: number) => (
            <CheckBox
              key={index + 1}
              title={label}
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 3,
              }}
              textStyle={{ fontWeight: "normal" }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              checked={localHeadcount === label}
              onPress={() => {
                if (localHeadcount === "Other: ") {
                  setHeadcount(otherHeadcount);
                  setLocalHeadcount(otherHeadcount);
                } else if (localHeadcount === label) {
                  setHeadcount("");
                  setLocalHeadcount("");
                } else {
                  setHeadcount(label);
                  setLocalHeadcount(label);
                }
              }}
            />
          )
        )}
        <TextInput
          style={AddPostPageStyleSheet.otherInputContainer}
          onFocus={() => {
            setLocalHeadcount("Other: ");
          }}
          onChangeText={(text) => {
            setOtherHeadcount(text);
          }}
          value={otherHeadcount}
          keyboardType="numeric"
          returnKeyType="done"
        />
      </ScrollView>
      <View style={AddPostPageStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            if (localHeadcount === "Other: " && otherHeadcount !== "") {
              if (!headcountListData.includes(otherHeadcount)) {
                setHeadcountListData([...headcountListData, otherHeadcount]);
              }
              setHeadcount(otherHeadcount);
              setLocalHeadcount(otherHeadcount);
              setSelectedHeadcount(otherHeadcount);
            } else if (localHeadcount === "Other: " && otherHeadcount == "") {
              setHeadcount("");
              setLocalHeadcount("");
              setSelectedHeadcount("Preferred Headcount *");
            } else if (localHeadcount === "") {
              setSelectedHeadcount("Preferred Headcount *");
            } else {
              setSelectedHeadcount(localHeadcount);
            }
            IonNeverDialog.dismiss();
          }}
        >
          <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default SingleSelectorWithOther;
