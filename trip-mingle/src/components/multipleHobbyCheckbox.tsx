import { CheckBox, SearchBar } from "@rneui/themed";
import { useState, useEffect } from "react";
import { TouchableOpacity, Keyboard, View, FlatList, Text } from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import { api } from "../apis/api";
import { countryListParser } from "../utils/parser";
import { CountryList } from "../utils/types";
import { useIonNeverNotification } from "./IonNeverNotification/NotificationProvider";

export default function MultipleHobbyCheckbox({
  //@ts-ignore
  setSelectedHobby,
  //@ts-ignore
  updateInputText,
}) {
  const [hobby, setHobby] = useState<string[]>([]);

  const { IonNeverDialog } = useIonNeverNotification();

  const [localHobby, setLocalHobby] = useState<string[]>(hobby);
  const [search, setSearch] = useState("");
  const [hobbyList, setHobbyList] = useState<CountryList[]>([]);
  const [matchedHobbyList, setMatchedHobbyList] = useState<CountryList[]>([]);
  const [code, setCode] = useState([]);
  const [localCode, setLocalCode] = useState<string[]>(code);

  const getList = async () => {
    const json = await api.getList("/user/hobby_list", countryListParser);
    setHobbyList(json);
    setMatchedHobbyList(json);
  };

  useEffect(() => {
    getList();
  }, []);
  useEffect(() => {
    setMatchedHobbyList(
      hobbyList.filter((hobby) =>
        hobby.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      )
    );
  }, [search, hobbyList]);
  const updateSearch = (search: string) => {
    setSearch(search);
  };

  const toggleHobbySelection = (name: string) => {
    if (localHobby.includes(name)) {
      setLocalHobby(localHobby.filter((language: string) => language !== name));
    } else {
      setLocalHobby([...localHobby, name]);
    }
  };

  const toggleHobbyIDSelection = (id: string) => {
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
        checked={localHobby.includes(name)}
        onPress={() => {
          toggleHobbySelection(name);
          toggleHobbyIDSelection(id);
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
        data={matchedHobbyList}
        renderItem={({ item }) => <Country name={item.name} id={item.id} />}
      />
      <View style={AddPostPageStyleSheet.ModalButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            const selectedHobbyString = localHobby.join(", ");
            const selectedHobbyIDString = localCode.join(",");
            setHobby(localHobby);
            if (selectedHobbyString) {
              setSelectedHobby(selectedHobbyString);
              updateInputText("hobby", selectedHobbyIDString);
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
