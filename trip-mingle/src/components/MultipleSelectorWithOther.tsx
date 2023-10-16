import {
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { CheckBox, SearchBar } from "@rneui/themed";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

const MultipleSelectorWithOther = (
  //@ts-ignore
  setSkills,
  //@ts-ignore
  setSelectedSkills,
  //@ts-ignore
  setSelectedSkillsText,
  //@ts-ignore
  setSkillsListData,
  //@ts-ignore
  skills,
  //@ts-ignore
  selectedSkills,
  //@ts-ignore
  skillsListData,
) => {
  const { IonNeverDialog } = useIonNeverNotification();
  const [localSkills, setLocalSkills] = useState<string[]>(skills);
  const [otherSkill, setOtherSkill] = useState<string>("");
  const [searchSkills, setSearchSkills] = useState("");
  const [matchedSkillsList, setMatchedSkillsList] =
    useState<string[]>(skillsListData);

  useEffect(() => {
    setMatchedSkillsList(
      skillsListData.filter((skill: string) =>
        skill.toLocaleLowerCase().includes(searchSkills.toLocaleLowerCase()),
      ),
    );
  }, [searchSkills, skillsListData]);

  const toggleSkillSelection = (name: string) => {
    console.log("0", localSkills);
    if (name === "Other: ") {
      if (!localSkills.includes(name)) {
        console.log("1", localSkills);

        setSkills([...skills, otherSkill]);
        setLocalSkills([...localSkills, name]);
        console.log("2", localSkills);
      } else {
        console.log("3", localSkills);
        setSkills(skills.filter((skill: string) => skill !== otherSkill));
        setLocalSkills(localSkills.filter((skill: string) => skill !== name));
        console.log("4", localSkills);
      }
      console.log("5", localSkills);
    } else if (localSkills.includes(name)) {
      console.log("6", localSkills);
      setSkills(skills.filter((skill: string) => skill !== name));
      setLocalSkills(localSkills.filter((skill: string) => skill !== name));
      console.log("7", localSkills);
    } else {
      console.log("8", localSkills);
      setSkills([...skills, name]);
      setLocalSkills([...localSkills, name]);
      console.log("9", localSkills);
    }
  };

  return (
    <>
      <SearchBar
        placeholder="Search..."
        onChangeText={setSearchSkills}
        value={searchSkills}
        containerStyle={{
          backgroundColor: "transparent",
          borderTopColor: "transparent",
          borderBottomColor: "transparent",
          height: 50,
        }}
        inputContainerStyle={{
          backgroundColor: "white",
          borderColor: "black",
          height: 40,
          borderRadius: 10,
          borderBottomWidth: 1,
          borderWidth: 1,
        }}
        inputStyle={{ fontSize: 14, color: "black" }}
        placeholderTextColor="#BFBFC1"
        searchIcon={false}
        lightTheme
      />
      <ScrollView
        horizontal={false}
        style={AddPostPageStyleSheet.AgeScrollViewContainer}
      >
        {searchSkills ? (
          matchedSkillsList.map((name: string, index: number) => (
            <CheckBox
              key={index + 1}
              title={name}
              containerStyle={{
                backgroundColor: "transparent",
                borderWidth: 0,
                padding: 3,
              }}
              textStyle={{ fontWeight: "normal" }}
              iconType="material-community"
              checkedIcon="checkbox-marked-outline"
              uncheckedIcon="checkbox-blank-outline"
              checked={localSkills.includes(name)}
              onPress={() => {
                toggleSkillSelection(name);
              }}
            />
          ))
        ) : (
          <>
            {[...skillsListData, "Other: "].map(
              (name: string, index: number) => (
                <CheckBox
                  key={index + 1}
                  title={name}
                  containerStyle={{
                    backgroundColor: "transparent",
                    borderWidth: 0,
                    padding: 3,
                  }}
                  textStyle={{ fontWeight: "normal" }}
                  iconType="material-community"
                  checkedIcon="checkbox-marked-outline"
                  uncheckedIcon="checkbox-blank-outline"
                  checked={localSkills.includes(name)}
                  onPress={() => {
                    toggleSkillSelection(name);
                  }}
                />
              ),
            )}
            <TextInput
              style={AddPostPageStyleSheet.otherInputContainer}
              onFocus={() => {
                setLocalSkills([...localSkills]);
              }}
              onChangeText={(text) => {
                setOtherSkill(text);
              }}
              value={otherSkill}
              returnKeyType="done"
            />
          </>
        )}
      </ScrollView>
      <View style={AddPostPageStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            console.log({ aa: otherSkill });
            console.log({ localSkillsb4: localSkills });
            if (localSkills.includes("Other: ")) {
              console.log({ bb: otherSkill });
              const formattedLocalSkills = localSkills.filter(
                (skill) => skill !== "Other: ",
              );
              console.log({ formattedLocalSkills });

              if (otherSkill !== "") {
                console.log({ cc: otherSkill });
                if (!formattedLocalSkills.includes(otherSkill)) {
                  console.log({ dd: otherSkill });
                  console.log({ 11: localSkills });
                  console.log({ "00": formattedLocalSkills });
                  setSkillsListData([...skillsListData, otherSkill]);
                  setSkills([...formattedLocalSkills, otherSkill]);

                  setLocalSkills([...formattedLocalSkills, otherSkill]);
                  setSelectedSkills([...formattedLocalSkills, otherSkill]);
                  console.log({ 12: localSkills });
                  console.log({ "01": formattedLocalSkills });
                  console.log({ ee: otherSkill });
                } else {
                  console.log({ ff: otherSkill });
                  console.log({ 13: localSkills });
                  setSkills(formattedLocalSkills);
                  setLocalSkills(formattedLocalSkills);
                  setSelectedSkills(formattedLocalSkills);
                  console.log({ 'localSkillsOther!=""': localSkills });
                  console.log({ 'selectedSkillsOther!=""': localSkills });
                  console.log({ "02": formattedLocalSkills });
                  console.log({ gg: otherSkill });
                }
              } else {
                console.log({ hh: otherSkill });
                console.log({ 14: localSkills });
                console.log({ "03": formattedLocalSkills });
                setSkills(formattedLocalSkills);
                setLocalSkills(formattedLocalSkills);
                setSelectedSkills(formattedLocalSkills);
                console.log({ 15: localSkills });
                console.log({ ii: otherSkill });
              }
            } else if (localSkills.length <= 0) {
              console.log({ 16: localSkills });
              setSkills([]);
              setSelectedSkills([]);
            } else {
              console.log({ 17: localSkills });
              setSkills(localSkills);
              setSelectedSkills(localSkills);
            }
            console.log({ localSkillsafter: localSkills });
            const selectedSkillsString = localSkills.join(", ");
            selectedSkillsString;
            localSkills.length <= 0
              ? setSelectedSkillsText("Preferred Skill(s)")
              : setSelectedSkillsText(selectedSkillsString);
            IonNeverDialog.dismiss();
          }}
        >
          <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default MultipleSelectorWithOther;
