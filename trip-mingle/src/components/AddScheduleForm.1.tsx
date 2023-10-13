import { useState } from "react";
import { View } from "react-native";

export function AddScheduleForm() {
  <View style={{ flex: 1, alignItems: "center", backgroundColor: white }}>
    <View style={RegisterScreenStyleSheet.uploadContainerSquare}>
      {image && (
        <Image source={{ uri: image }} style={{ width: 300, height: 300 }} />
      )}
      <View style={RegisterScreenStyleSheet.uploadBtnContainerSquare}>
        <TouchableOpacity
          onPress={addImage}
          style={RegisterScreenStyleSheet.uploadBtn}
        >
          <Text>{image ? "Edit" : "Upload"} Image</Text>
          <AntDesign name="camera" size={20} color="black" />
        </TouchableOpacity>
      </View>
    </View>
    <TextInput
      style={RegisterScreenStyleSheet.inputContainer}
      onChangeText={onChangeTitle}
      value={title}
      placeholder="Title"
    />
    <TouchableOpacity
      style={RegisterScreenStyleSheet.countryContainer}
      onPress={() => {
        IonNeverDialog.show({
          dialogHeight: 800,
          component: () => {
            const [localCountry, setLocalCountry] = useState<string>(country);
            const [search, setSearch] = useState("");

            const [countryList, setCountryList] = useState(countriesListData);

            const [matchedCountryList, setMatchedCountryList] =
              useState(countriesListData);

            useEffect(() => {
              setMatchedCountryList(
                countryList.filter((country) =>
                  country.name
                    .toLocaleLowerCase()
                    .includes(search.toLocaleLowerCase())
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
                  placeholder="Search..."
                  onChangeText={updateSearch}
                  value={search}
                  containerStyle={{ borderRadius: 10 }}
                  inputContainerStyle={{ backgroundColor: "white" }}
                  lightTheme={true}
                />
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
                    <Text style={RegisterScreenStyleSheet.ModalText}>OK</Text>
                  </TouchableOpacity>
                </View>
              </>
            );
          },
        });
      }}
    >
      <Icon
        style={{
          display: flex,
          justifyContent: "flex-start",
          marginEnd: 4,
        }}
        name={country === "" ? "earth" : ""}
        size={16}
      />
      <Text>{selectedCountry}</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={LoginPageStyleSheet.login}
      onPress={() => {
        setModalVisible(false);
        console.log("OnPress");
      }}
    >
      <Text style={LoginPageStyleSheet.loginText}>Add New Plan</Text>
    </TouchableOpacity>
  </View>;
}
