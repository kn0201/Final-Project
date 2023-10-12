//Buffer Line

import { CheckBox, SearchBar } from "@rneui/base";
import { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import RegisterScreenStyleSheet from "../StyleSheet/RegisterScreenCss";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";
import languagesList from "../source/languages";

export default function SelectLanguage({
  //@ts-ignore
  setSelectedLanguage,
  //@ts-ignore
  updateInputText,
}) {
  let languageListData = languagesList;
  const { IonNeverDialog } = useIonNeverNotification();
  const [language, setLanguage] = useState("");
  const [localLanguage, setLocalLanguage] = useState<string>(language);
  const [search, setSearch] = useState("");
  const [languageList, setLanguageList] = useState(languageListData);

  const [matchedLanguageList, setMatchedLanguageList] =
    useState(languageListData);

  useEffect(() => {
    setMatchedLanguageList(
      languageList.filter((language) =>
        language.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      )
    );
  }, [search, languageList]);

  const updateSearch = (search: string) => {
    setSearch(search);
  };
  type CountryProps = { name: string };
  const Country = ({ name }: CountryProps) => (
    <View>
      <CheckBox
        title={name}
        containerStyle={{
          backgroundColor: "transparent",
          borderWidth: 0,
        }}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={localLanguage === name}
        onPress={() => {
          setLanguage(name);
          setLocalLanguage(name);
        }}
      />
    </View>
  );
  return (
    <>
      <SearchBar
        placeholder="Type Here..."
        onChangeText={updateSearch}
        value={search}
        containerStyle={{ borderRadius: 10 }}
        inputContainerStyle={{ backgroundColor: "white" }}
        lightTheme={true}
      />
      <Text>Result : {search}</Text>
      <FlatList
        data={matchedLanguageList}
        renderItem={({ item }) => <Country name={item.name} />}
      />
      <View style={RegisterScreenStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          disabled={localLanguage === ""}
          onPress={() => {
            setSelectedLanguage(localLanguage);
            IonNeverDialog.dismiss();
            updateInputText("language", language);
          }}
        >
          <Text style={RegisterScreenStyleSheet.ModalText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
