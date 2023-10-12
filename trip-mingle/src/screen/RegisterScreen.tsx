import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  Modal,
  Image,
  FlatList,
} from "react-native";

import LoginPageStyleSheet from "../StyleSheet/LoginScreenCss";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { flex } from "../StyleSheet/StyleSheetHelper";
import { useRef, useState, useEffect, SetStateAction } from "react";
import { CheckBox, SearchBar } from "@rneui/themed";
import RegisterScreenStyleSheet from "../StyleSheet/RegisterScreenCss";
import { RegisInfo } from "../utils/types";
import { AntDesign } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { countriesList } from "../source/countries";
import { api } from "../apis/api";
import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";

//@ts-ignore
export default function RegisterScreen({ navigation }) {
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();

  const [checkGender, setCheck1] = useState(true);

  const [selectedAge, setSelectedAge] = useState("Select Your Age Group");
  const [age, setAge] = useState("");
  const [birthdayIcon, setBirthdayIcon] = useState(true);
  const [visibleBirthday, setVisibleBirthday] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState("Country");
  const [country, setCountry] = useState("");
  const [countryIcon, setCountryIcon] = useState(true);
  const [visibleCountry, setVisibleCountry] = useState(false);

  const [image, setImage] = useState(null);

  const regisInfo = useRef<RegisInfo>({
    username: "",
    email: "",
    password: "",
    gender: checkGender,
    age: "",
    country: "",
    avatar: "",
  }).current;

  const clearInputs = useRef({
    username() {},
    email() {},
    password() {},
    confirmPassword() {},
    gender() {},
    age() {},
    country() {},
  }).current;

  const [showPassword, setPassword] = useState(true);
  const password = () => {
    setPassword(!showPassword);
  };

  const [showConfirmPassword, setConfirmPassword] = useState(true);
  const confirmPassword = () => {
    setConfirmPassword(!showConfirmPassword);
  };

  const updateInputText = (field: string, value: string) => {
    //@ts-ignore
    regisInfo[field as keyof RegisInfo] = value;
  };

  const toggleCountryDialog = () => {
    setVisibleCountry(!visibleCountry);
  };
  let countriesListData = countriesList;

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // @ts-ignore
    console.log(JSON.stringify(_image.assets[0].uri));
    //@ts-ignore
    if (!_image.canceled) {
      //@ts-ignore
      setImage(_image.assets[0].uri);
      updateInputText("avatar", _image.assets[0].uri);
    }
  };

  const register = async () => {
    // try {
    //   let json = await api.post("/login", regisInfo, loginResult);
    //   Object.entries(clearInputs).map(([_key, clear]) => clear());
    // } catch (error) {
    //   const errorObject: any = { ...(error as object) };
    //   console.log(errorObject);
    // }
    IonNeverDialog.show({
      type: "success",
      title: "Shown Successfully",
      firstButtonVisible: true,
      firstButtonFunction: () => {
        console.log("Left Button Pressed for No Reason");
      },
      secondButtonVisible: true,
    });
    console.log(regisInfo);
    navigation.navigate("Users");
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss;
        toggleCountryDialog;
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={RegisterScreenStyleSheet.uploadContainer}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 150, height: 150 }}
            />
          )}
          <View style={RegisterScreenStyleSheet.uploadBtnContainer}>
            <TouchableOpacity
              onPress={addImage}
              style={RegisterScreenStyleSheet.uploadBtn}
            >
              <Text>{image ? "Edit" : "Upload"} Image</Text>
              <AntDesign name="camera" size={20} color="black" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={RegisterScreenStyleSheet.inputContainer}>
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name="account-outline"
            size={20}
          />

          <TextInput
            ref={(input: any) => {
              clearInputs.username = () => input?.clear();
            }}
            onChangeText={(text: string) => updateInputText("username", text)}
            onEndEditing={() => Keyboard.dismiss()}
            placeholder="Username"
            style={RegisterScreenStyleSheet.textInput}
          ></TextInput>
          <Icon
            style={{ display: flex, justifyContent: "flex-end" }}
            name="close"
            size={20}
            onPress={() => clearInputs.username()}
          />
        </View>
        <View style={RegisterScreenStyleSheet.inputContainer}>
          <Icon
            style={{
              display: flex,
              justifyContent: "flex-start",
              marginEnd: 4,
            }}
            name="email-outline"
            size={20}
          />

          <TextInput
            ref={(input: any) => {
              clearInputs.email = () => input?.clear();
            }}
            onChangeText={(text: string) => updateInputText("email", text)}
            onEndEditing={() => Keyboard.dismiss()}
            keyboardType="email-address"
            placeholder="Email"
            style={RegisterScreenStyleSheet.textInput}
          ></TextInput>
          <Icon
            style={{ display: flex, justifyContent: "flex-end" }}
            name="close"
            size={20}
            onPress={() => clearInputs.email()}
          />
        </View>
        <View style={RegisterScreenStyleSheet.passwordContainer}>
          <View style={RegisterScreenStyleSheet.password}>
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name="lock-outline"
              size={20}
            />

            <TextInput
              style={RegisterScreenStyleSheet.textInput}
              ref={(input: any) => {
                clearInputs.password = () => input?.clear();
              }}
              onChangeText={(text: string) => updateInputText("password", text)}
              placeholder="Password"
              secureTextEntry={showPassword}
              clearTextOnFocus={true}
            ></TextInput>
            <Icon
              style={{ display: flex, justifyContent: "flex-end" }}
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              onPress={password}
            />
          </View>
          <Text>─────────────────────────</Text>
          <View style={RegisterScreenStyleSheet.password}>
            <Icon
              style={{
                display: flex,
                justifyContent: "flex-start",
                marginEnd: 4,
              }}
              name="lock-outline"
              size={20}
            />

            <TextInput
              style={RegisterScreenStyleSheet.textInput}
              ref={(input: any) => {
                clearInputs.confirmPassword = () => input?.clear();
              }}
              placeholder="Confirm Password"
              secureTextEntry={showConfirmPassword}
              clearTextOnFocus={true}
            ></TextInput>
            <Icon
              style={{ display: flex, justifyContent: "flex-end" }}
              name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
              size={20}
              onPress={confirmPassword}
            />
          </View>
        </View>
        <View style={RegisterScreenStyleSheet.genderContainer}>
          <CheckBox
            center
            title="Male"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={checkGender}
            onPress={() => setCheck1(!checkGender)}
            size={20}
            containerStyle={{ backgroundColor: "transparent" }}
          />
          <CheckBox
            center
            title="Female"
            checkedIcon="dot-circle-o"
            uncheckedIcon="circle-o"
            checked={!checkGender}
            onPress={() => setCheck1(!checkGender)}
            size={20}
            containerStyle={{ backgroundColor: "transparent" }}
          />
        </View>
        <View style={LoginPageStyleSheet.center}>
          <TouchableOpacity
            style={RegisterScreenStyleSheet.birthdayContainer}
            onPress={() => {
              IonNeverDialog.show({
                dialogHeight: 500,
                component: () => {
                  const [localAge, setLocalAge] = useState<string>(age);
                  return (
                    <>
                      <ScrollView
                        horizontal={false}
                        style={
                          RegisterScreenStyleSheet.BirthdayScrollViewContainer
                        }
                      >
                        {[
                          "18-24",
                          "25-30",
                          "31-36",
                          "37-42",
                          "42-48",
                          "48-54",
                          ">55",
                        ].map((label, index) => (
                          <CheckBox
                            key={index + 1}
                            title={label}
                            containerStyle={{
                              backgroundColor: "transparent",
                              borderWidth: 0,
                            }}
                            checkedIcon="dot-circle-o"
                            uncheckedIcon="circle-o"
                            checked={localAge === label}
                            onPress={() => {
                              setAge(label);
                              setLocalAge(label);
                            }}
                          />
                        ))}
                      </ScrollView>
                      <View
                        style={RegisterScreenStyleSheet.ModalButtonContainer}
                      >
                        <TouchableOpacity
                          disabled={localAge === ""}
                          onPress={() => {
                            setSelectedAge(localAge);
                            setBirthdayIcon(!birthdayIcon);
                            IonNeverDialog.dismiss();
                            updateInputText("age", localAge);
                          }}
                        >
                          <Text style={RegisterScreenStyleSheet.ModalText}>
                            Confirm
                          </Text>
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
              name={age === "" ? "cake-variant-outline" : ""}
              size={20}
            />
            <Text>{selectedAge}</Text>
          </TouchableOpacity>
        </View>
        <View style={RegisterScreenStyleSheet.center}>
          <TouchableOpacity
            style={RegisterScreenStyleSheet.countryContainer}
            onPress={() => {
              IonNeverDialog.show({
                dialogHeight: 800,
                component: () => {
                  const [localCountry, setLocalCountry] =
                    useState<string>(country);
                  const [search, setSearch] = useState("");

                  const [countryList, setCountryList] =
                    useState(countriesListData);

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
                      <View
                        style={RegisterScreenStyleSheet.ModalButtonContainer}
                      >
                        <TouchableOpacity
                          disabled={localCountry === ""}
                          onPress={() => {
                            setSelectedCountry(localCountry);
                            setCountryIcon(!countryIcon);
                            IonNeverDialog.dismiss();
                            updateInputText("country", country);
                          }}
                        >
                          <Text style={RegisterScreenStyleSheet.ModalText}>
                            Confirm
                          </Text>
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
              size={20}
            />
            <Text>{selectedCountry}</Text>
          </TouchableOpacity>
          <TouchableWithoutFeedback onPress={toggleCountryDialog}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={visibleCountry}
              onRequestClose={toggleCountryDialog}
            >
              <View style={RegisterScreenStyleSheet.ModalContainer}></View>
            </Modal>
          </TouchableWithoutFeedback>
        </View>
        <View style={LoginPageStyleSheet.center}>
          <TouchableOpacity
            style={LoginPageStyleSheet.login}
            onPress={register}
          >
            <Text style={LoginPageStyleSheet.loginText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
