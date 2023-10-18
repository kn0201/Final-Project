//Buffer Line

import { CheckBox, SearchBar } from "@rneui/base";
import { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import RegisterScreenStyleSheet from "../StyleSheet/RegisterScreenCss";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";
import { api } from "../apis/api";
import { countryListParser } from "../utils/parser";
import { CountryList } from "../utils/types";

//@ts-ignore
export default function SelectCountry({ setSelectedCountry, updateInputText }) {
  const getList = async () => {
    const json = await api.get("/country", countryListParser);

    setCountryList(json);
    setMatchedCountryList(json);
  };
  // const countriesListData = countriesList;
  useEffect(() => {
    getList();
  }, []);

  const { IonNeverDialog } = useIonNeverNotification();
  const [country, setCountry] = useState("");
  const [localCountry, setLocalCountry] = useState<string>(country);
  const [search, setSearch] = useState("");
  const [countryList, setCountryList] = useState<CountryList[]>([]);
  const [countryID, setCountryID] = useState("");
  const [matchedCountryList, setMatchedCountryList] = useState<CountryList[]>(
    [],
  );

  useEffect(() => {
    setMatchedCountryList(
      countryList.filter((country) =>
        country.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()),
      ),
    );
  }, [search, countryList]);

  const updateSearch = (search: string) => {
    setSearch(search);
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
        }}
        checkedIcon="dot-circle-o"
        uncheckedIcon="circle-o"
        checked={localCountry === name}
        onPress={() => {
          setCountryID(id);
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
        renderItem={({ item }) => <Country name={item.name} id={item.id} />}
      />
      <View style={RegisterScreenStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          disabled={localCountry === ""}
          onPress={() => {
            setSelectedCountry(localCountry);
            IonNeverDialog.dismiss();
            updateInputText("country_id", countryID);
          }}
        >
          <Text style={RegisterScreenStyleSheet.ModalText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
