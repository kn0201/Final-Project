//Buffer Line

import { CheckBox, SearchBar } from "@rneui/base";
import { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { countriesList } from "../source/countries";
import RegisterScreenStyleSheet from "../StyleSheet/RegisterScreenCss";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

//@ts-ignore
export default function SelectCountry({ setSelectedCountry, updateInputText }) {
  let countriesListData = countriesList;
  const { IonNeverDialog } = useIonNeverNotification();
  const [country, setCountry] = useState("");
  const [localCountry, setLocalCountry] = useState<string>(country);
  const [search, setSearch] = useState("");
  const [countryList, setCountryList] = useState(countriesListData);

  const [matchedCountryList, setMatchedCountryList] =
    useState(countriesListData);

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
        checked={localCountry === name}
        onPress={() => {
          setCountry(name);
          setLocalCountry(name);
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
        data={matchedCountryList}
        renderItem={({ item }) => <Country name={item.name} />}
      />
      <View style={RegisterScreenStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          disabled={localCountry === ""}
          onPress={() => {
            setSelectedCountry(localCountry);
            IonNeverDialog.dismiss();
            updateInputText("country", country);
          }}
        >
          <Text style={RegisterScreenStyleSheet.ModalText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
