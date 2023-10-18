//Buffer Line

import { CheckBox, SearchBar } from "@rneui/themed";
import { useState, useEffect } from "react";
import { TouchableOpacity, View, FlatList, Text } from "react-native";

import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";

import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

import { api } from "../apis/api";
import { countryListParser } from "../utils/parser";
import { LanguageList } from "../utils/types";

export default function MultipleLanguagesCheckbox({
  //@ts-ignore
  updateInputText,
  //@ts-ignore
  setSelectedLanguage,
}) {
  const [languages, setLanguages] = useState<string[]>([]);

  const { IonNeverDialog } = useIonNeverNotification();

  const [localLanguages, setLocalLanguages] = useState<string[]>(languages);
  const [searchLanguages, setSearchLanguages] = useState("");
  const [languagesList, setLanguagesList] = useState<LanguageList[]>([]);
  const [matchedLanguagesList, setMatchedLanguagesList] = useState<
    LanguageList[]
  >([]);
  const [code, setCode] = useState<string[]>([]);
  const [localCode, setLocalCode] = useState<string[]>(code);

  const getList = async () => {
    const json = await api.getList("/languages", countryListParser);

    setLanguagesList(json);
    setMatchedLanguagesList(json);
  };
  // const countriesListData = countriesList;
  useEffect(() => {
    getList();
  }, []);

  useEffect(() => {
    setMatchedLanguagesList(
      languagesList.filter((language) =>
        language.name
          .toLocaleLowerCase()
          .includes(searchLanguages.toLocaleLowerCase())
      )
    );
  }, [searchLanguages, languagesList]);

  const updateSearch = (search: string) => {
    setSearchLanguages(search);
  };

  const toggleLanguageSelection = (name: string) => {
    if (localLanguages.includes(name)) {
      setLocalLanguages(
        localLanguages.filter((language: string) => language !== name)
      );
    } else {
      setLocalLanguages([...localLanguages, name]);
    }
  };

  const toggleLanguageIDSelection = (id: string) => {
    if (localCode.includes(id)) {
      setLocalCode(localCode.filter((code: string) => code !== id));
    } else {
      setLocalCode([...localCode, id]);
    }
  };

  type LanguagesProps = { name: string; id: string };

  const Languages = ({ name, id }: LanguagesProps) => (
    <View>
      <CheckBox
        id={id}
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
        checked={localLanguages.includes(name)}
        onPress={() => {
          toggleLanguageSelection(name);
          toggleLanguageIDSelection(id);
        }}
      />
    </View>
  );
  return (
    <>
      <SearchBar
        placeholder="Search..."
        onChangeText={updateSearch}
        value={searchLanguages}
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
      <FlatList
        data={matchedLanguagesList}
        renderItem={({ item }) => <Languages name={item.name} id={item.id} />}
      />
      <View style={AddPostPageStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            const selectedLanguagesString = localLanguages.join(", ");
            const selectedLanguageIDString = localCode.join(",");
            setLanguages(localLanguages);
            if (selectedLanguagesString) {
              setSelectedLanguage(selectedLanguagesString);
              updateInputText("language", selectedLanguageIDString);
            }

            IonNeverDialog.dismiss();
          }}
        >
          <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
