import { CheckBox, SearchBar } from "@rneui/themed";
import { useState, useEffect } from "react";
import { TouchableOpacity, Keyboard, View, FlatList, Text } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import { api } from "../apis/api";
import { countryListParser } from "../utils/parser";
import { CountryList } from "../utils/types";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

export default function MultipleCountryCheckbox({
  //@ts-ignore
  setSelectedCountry,
  //@ts-ignore
  updateInputText,
}) {
  const [country, setCountry] = useState<string[]>([]);

  const { IonNeverDialog } = useIonNeverNotification();

  const [localCountry, setLocalCountry] = useState<string[]>(country);
  const [search, setSearch] = useState("");
  const [countryList, setCountryList] = useState<CountryList[]>([]);
  const [matchedCountryList, setMatchedCountryList] = useState<CountryList[]>(
    []
  );
  const [code, setCode] = useState<string[]>([]);
  const [localCode, setLocalCode] = useState<string[]>(code);

  const getList = async () => {
    const json = await api.get("/country", countryListParser);
    setCountryList(json);
    setMatchedCountryList(json);
  };
  // const countriesListData = countriesList;
  useEffect(() => {
    getList();
  }, []);
  useEffect(() => {
    setMatchedCountryList(
      countryList.filter((country) =>
        country.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      )
    );
  }, [search, countryList]);
  const updateSearch = (search: string) => {
    setSearch(search);
  };

  const toggleCountrySelection = (name: string) => {
    if (localCountry.includes(name)) {
      setLocalCountry(
        localCountry.filter((country: string) => country !== name)
      );
    } else {
      setLocalCountry([...localCountry, name]);
    }
  };

  const toggleCountryIDSelection = (id: string) => {
    if (localCode.includes(id)) {
      setLocalCode(localCode.filter((code: string) => code !== id));
    } else {
      setLocalCode([...localCode, id]);
    }
  };
  type CountryProps = { name: string; id: string };
  const Country = ({ name, id }: CountryProps) => (
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
        checked={localCountry.includes(name)}
        onPress={() => {
          toggleCountrySelection(name);
          toggleCountryIDSelection(id);
        }}
      />
    </View>
  );
  return (
    <>
      <SearchBar
        placeholder="Search..."
        onChangeText={updateSearch}
        value={search}
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
        data={matchedCountryList}
        renderItem={({ item }) => <Country name={item.name} id={item.id} />}
      />
      <View style={AddPostPageStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            const selectedCountryString = localCountry.join(", ");
            const selectedCountryIDString = localCode.join(",");
            setCountry(localCountry);
            if (selectedCountryString) {
              setSelectedCountry(selectedCountryString);
              updateInputText("country", selectedCountryIDString);
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
