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

const MultipleSelectorWithOther = ({
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
}) => {
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
    if (name === "Other: ") {
      if (!localSkills.includes(name)) {
        setSkills([...skills, otherSkill]);
        setLocalSkills([...localSkills, name]);
      } else {
        setSkills(skills.filter((skill: string) => skill !== otherSkill));
        setLocalSkills(localSkills.filter((skill: string) => skill !== name));
      }
    } else if (localSkills.includes(name)) {
      setSkills(skills.filter((skill: string) => skill !== name));
      setLocalSkills(localSkills.filter((skill: string) => skill !== name));
    } else {
      setSkills([...skills, name]);
      setLocalSkills([...localSkills, name]);
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
                if (!localSkills.includes("Other: ")) {
                  setLocalSkills([...localSkills, "Other: "]);
                }
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
            if (localSkills.includes("Other: ")) {
              let array = [];
              if (localSkills.includes("Other: ")) {
                for (let skill of localSkills) {
                  if (skill === "Other: ") {
                    array.push(otherSkill);
                    continue;
                  } else {
                    array.push(skill);
                  }
                }
              }
              let arrayString = array.join(", ");
              setSelectedSkillsText(arrayString);

              const formattedLocalSkills = localSkills.filter(
                (skill) => skill !== "Other: ",
              );

              if (otherSkill !== "") {
                if (!formattedLocalSkills.includes(otherSkill)) {
                  setSkillsListData([...skillsListData, otherSkill]);
                  setSkills([...formattedLocalSkills, otherSkill]);
                  setLocalSkills([...formattedLocalSkills, otherSkill]);
                  setSelectedSkills([...formattedLocalSkills, otherSkill]);
                } else {
                  setSkills(formattedLocalSkills);
                  setLocalSkills(formattedLocalSkills);
                  setSelectedSkills(formattedLocalSkills);
                }
              } else {
                setSkills(formattedLocalSkills);
                setLocalSkills(formattedLocalSkills);
                setSelectedSkills(formattedLocalSkills);
              }
              setSelectedSkillsText(arrayString);
              IonNeverDialog.dismiss();
            } else if (localSkills.length <= 0) {
              setSkills([]);
              setSelectedSkills([]);
            } else {
              setSkills(localSkills);
              setSelectedSkills(localSkills);
            }
            const selectedSkillsString = localSkills.join(", ");
            selectedSkillsString;
            if (localSkills.length <= 0) {
              setSelectedSkillsText("Preferred Hobbies");
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

export default MultipleSelectorWithOther;
