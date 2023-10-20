import { CheckBox, SearchBar } from "@rneui/themed";
import { useEffect, useRef, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { PostInfo } from "../utils/types";

import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LocationInput from "../components/locationInput";
import PeriodPicker from "../components/PeriodPicker";
import MultipleSelector from "../components/MutlipleSelector";
import SingleSelectorWithOther from "../components/SingleSelectorWithOther";
import MultipleSelectorWithOther from "../components/MultipleSelectorWithOther";
import {
  LanguageListItem,
  addPostCountryListParser,
  addTourPostParser,
  languageListParser,
} from "../utils/parser";
import { api } from "../apis/api";
import { useToken } from "../hooks/useToken";
import { useGet } from "../hooks/useGet";
import { Modal } from "../components/Modal";
import TextButton from "../components/TextButton";
import useBoolean from "../hooks/useBoolean";
import { useSelection } from "../hooks/useSelection";
import { theme } from "../theme/variables";

//@ts-ignore
export function AddPostScreen1({ navigation }) {
  const { token, payload, setToken } = useToken();
  const { IonNeverDialog } = useIonNeverNotification();
  const [title, setTitle] = useState("");
  const [budget, setBudget] = useState("");
  const [content, setContent] = useState("");
  const [selectedGender, setSelectedGender] = useState("Preferred Gender");
  const [gender, setGender] = useState("");
  const [selectedHeadcount, setSelectedHeadcount] = useState<string>(
    "Preferred Headcount *",
  );
  const [headcount, setHeadcount] = useState<string>("");
  const [headcountListData, setHeadcountListData] = useState<string[]>([
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
  ]);
  const [selectedCountry, setSelectedCountry] = useState(
    "Destination Country *",
  );
  const [country, setCountry] = useState("");
  const [code, setCode] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Trip Period");
  const [period, setPeriod] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [selectedLanguagesText, setSelectedLanguagesText] = useState(
    "Preferred Languages(s)",
  );
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [skillsListData, setSkillsListData] = useState<string[]>([
    "Driving",
    "Cycling",
    "Diving",
    "Cooking",
    "Camping",
    "Photography",
    "VLogging",
    "Sketching",
  ]);
  const [selectedSkillsText, setSelectedSkillsText] =
    useState<string>("Preferred Hobbies");
  const [selectedAgesText, setSelectedAgesText] = useState("Preferred Age(s)");
  const [selectedAgesList, setSelectedAgesList] = useState<string[]>([]);
  const ageLabels = [
    "18-24",
    "25-30",
    "31-36",
    "37-42",
    "42-48",
    "48-54",
    ">55",
  ];
  const countriesList = useGet("/country", addPostCountryListParser);
  const languagesList = useGet("/languages", languageListParser);
  const countriesListData = countriesList.state || [];
  const languagesListData = languagesList.state || [];
  const [checkType, setCheckType] = useState("none");

  // Submit
  const postInfo = useRef<PostInfo>({
    type: "",
    title: "",
    content: "",
    trip_country: "",
    trip_location: [],
    trip_period: "",
    trip_headcount: "",
    trip_budget: "",
    preferred_gender: null,
    preferred_age: "",
    preferred_language: "",
    preferred_hobby: "",
  }).current;

  const addPost = async () => {
    try {
      if (checkType !== "none") {
        updateInputText("type", checkType);
      } else {
        throw new Error("Missing type");
      }
      if (title !== "") {
        updateInputText("title", title);
      } else {
        throw new Error("Missing title");
      }
      if (content !== "") {
        updateInputText("content", content);
      } else {
        throw new Error("Missing content");
      }
      if (checkType !== "enquire") {
        if (selectedCountry !== "Destination Country *") {
          updateInputText("trip_country", selectedCountry);
        } else {
          throw new Error("Missing destination country");
        }
        if (selectedPeriod !== "Trip Period") {
          updateInputText("trip_period", selectedPeriod);
        }
      }
      if (checkType === "tour") {
        if (selectedHeadcount !== "Preferred Headcount *") {
          updateInputText("trip_headcount", selectedHeadcount);
        } else {
          throw new Error("Missing preferred headcount");
        }
        if (budget !== "") {
          updateInputText("trip_budget", budget);
        }
        if (selectedGender !== "Preferred Gender") {
          if (selectedGender === "Male") {
            updateInputText("preferred_gender", true);
          } else {
            updateInputText("preferred_gender", false);
          }
        }
        if (selectedAgesText != "Preferred Age(s)") {
          updateInputText("preferred_age", selectedAgesText);
        }
        if (selectedLanguagesText != "Preferred Languages(s)") {
          updateInputText("preferred_language", selectedLanguagesText);
        }
        if (selectedSkillsText != "Preferred Hobbies") {
          updateInputText("preferred_hobby", selectedSkillsText);
        }
      }
      let result = await api.post(
        "/blog/tour",
        postInfo,
        addTourPostParser,
        token,
      );
      IonNeverDialog.show({
        type: "success",
        title: `Success`,
        message: `Created new post #${result.id}`,
        firstButtonVisible: true,
        firstButtonFunction: () => {
          navigation.navigate("Tour");
        },
        secondButtonVisible: false,
      });
      console.log(postInfo);
    } catch (e) {
      IonNeverDialog.show({
        type: "warning",
        title: "Error",
        message: `${e}`,
        firstButtonVisible: true,
        firstButtonFunction: () => {
          IonNeverDialog.dismiss();
        },
      });
      console.log({ e });
    }
  };

  const updateInputText = (
    field: string,
    value: string | boolean | string[],
  ) => {
    //@ts-ignore
    postInfo[field as keyof PostInfo] = value;
  };

  // Autofocus
  const inputRef = useRef<TextInput | null>(null);
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Title input
  const TitleInput = () => {
    return (
      <TextInput
        ref={inputRef}
        style={AddPostPageStyleSheet.postInputContainer}
        onChangeText={(title) => {
          setTitle(title);
        }}
        value={title}
        placeholder="Post Title *"
        returnKeyType="done"
      />
    );
  };

  // Budget input
  const BudgetInput = () => {
    return (
      <TextInput
        ref={inputRef}
        style={AddPostPageStyleSheet.postInputContainer}
        onChangeText={(budget) => {
          setBudget(budget);
        }}
        value={budget}
        placeholder="Expected Budget (e.g. HKD10,000)"
        returnKeyType="done"
      />
    );
  };

  // Content input
  const ContentInput = () => {
    return (
      <TextInput
        ref={inputRef}
        style={AddPostPageStyleSheet.contentContainer}
        onChangeText={(content) => {
          setContent(content);
        }}
        value={content}
        multiline
        placeholder="Post Content *"
      />
    );
  };

  // Headcount checkbox
  const HeadcountCheckbox = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postAgeContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 300,
            component: () => {
              return (
                <SingleSelectorWithOther
                  setHeadcount={setHeadcount}
                  setSelectedHeadcount={setSelectedHeadcount}
                  setHeadcountListData={setHeadcountListData}
                  headcount={headcount}
                  headcountListData={headcountListData}
                />
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedHeadcount}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Gender checkbox
  const GenderCheckbox = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postAgeContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 300,
            component: () => {
              const [localGender, setLocalGender] = useState<string>(gender);
              return (
                <>
                  <ScrollView
                    horizontal={false}
                    style={AddPostPageStyleSheet.AgeScrollViewContainer}
                  >
                    {["Male", "Female"].map((label, index) => (
                      <CheckBox
                        key={index + 1}
                        title={label}
                        containerStyle={{
                          backgroundColor: "transparent",
                          borderWidth: 0,
                          padding: 3,
                        }}
                        textStyle={{ fontWeight: "normal" }}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        checked={localGender === label}
                        onPress={() => {
                          if (localGender === label) {
                            setGender("");
                            setLocalGender("");
                          } else {
                            setGender(label);
                            setLocalGender(label);
                          }
                        }}
                      />
                    ))}
                  </ScrollView>
                  <View style={AddPostPageStyleSheet.ModalButtonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        localGender
                          ? setSelectedGender(localGender)
                          : setSelectedGender("Preferred Gender");
                        IonNeverDialog.dismiss();
                      }}
                    >
                      <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </>
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedGender}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Age checkbox
  const AgeCheckbox = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postAgeContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 350,
            component: () => {
              return (
                <MultipleSelector
                  setSelectedAgesText={setSelectedAgesText}
                  setSelectedAges={setSelectedAgesList}
                  selectedAges={selectedAgesList}
                  labels={ageLabels}
                />
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedAgesText}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Country checkbox
  const CountryCheckbox = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postCountryContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 600,
            component: () => {
              const [localCountry, setLocalCountry] = useState<string>(country);
              const [localCode, setLocalCode] = useState<string>(code);
              const [search, setSearch] = useState("");
              const [matchedCountryList, setMatchedCountryList] =
                useState(countriesListData);
              useEffect(() => {
                setMatchedCountryList(
                  countriesListData.filter((country) =>
                    country.name
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase()),
                  ),
                );
              }, [search, countriesListData]);
              const updateSearch = (search: string) => {
                setSearch(search);
              };
              type CountryProps = { name: string; code: string };
              const Country = ({ name, code }: CountryProps) => (
                <View>
                  <CheckBox
                    title={name}
                    containerStyle={{
                      backgroundColor: "transparent",
                      borderWidth: 0,
                      padding: 3,
                    }}
                    textStyle={{ fontWeight: "normal" }}
                    checkedIcon="dot-circle-o"
                    uncheckedIcon="circle-o"
                    checked={localCountry === name}
                    onPress={() => {
                      if (localCountry === name) {
                        setCountry("");
                        setCode("");
                        setLocalCountry("");
                        setLocalCode("");
                      } else {
                        setCountry(name);
                        setCode(code);
                        setLocalCountry(name);
                        setLocalCode(code);
                      }
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
                    renderItem={({ item }) => (
                      <Country name={item.name} code={item.code} />
                    )}
                  />
                  <View style={AddPostPageStyleSheet.ModalButtonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        localCountry
                          ? setSelectedCountry(localCountry)
                          : setSelectedCountry("Destination Country *");
                        IonNeverDialog.dismiss();
                      }}
                    >
                      <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </>
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedCountry}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Period Selector
  const PeriodSelector = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postAgeContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 420,
            component: () => {
              return (
                <PeriodPicker
                  setSelectedPeriod={setSelectedPeriod}
                  setPeriod={setPeriod}
                />
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedPeriod}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Language checkbox
  const LanguagesCheckbox = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postCountryContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 560,
            component: () => {
              const [localLanguages, setLocalLanguages] =
                useState<string[]>(languages);
              const [searchLanguages, setSearchLanguages] = useState("");
              const [languagesList, setLanguagesList] =
                useState(languagesListData);
              const [matchedLanguagesList, setMatchedLanguagesList] =
                useState(languagesListData);

              useEffect(() => {
                setMatchedLanguagesList(
                  languagesListData.filter((language) =>
                    language.name
                      .toLocaleLowerCase()
                      .includes(searchLanguages.toLocaleLowerCase()),
                  ),
                );
              }, [searchLanguages, languagesListData]);

              const updateSearch = (search: string) => {
                setSearchLanguages(search);
              };

              const toggleLangaugeSelection = (name: string) => {
                if (localLanguages.includes(name)) {
                  setLocalLanguages(
                    localLanguages.filter(
                      (language: string) => language !== name,
                    ),
                  );
                } else {
                  setLocalLanguages([...localLanguages, name]);
                }
              };

              type LanguagesProps = { name: string };

              const Languages = ({ name }: LanguagesProps) => (
                <View>
                  <CheckBox
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
                    onPress={() => toggleLangaugeSelection(name)}
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
                    renderItem={({ item }) => <Languages name={item.name} />}
                  />
                  <View style={AddPostPageStyleSheet.ModalButtonContainer}>
                    <TouchableOpacity
                      onPress={() => {
                        const selectedLanguagesString =
                          localLanguages.join(", ");
                        setLanguages(localLanguages);
                        selectedLanguagesString
                          ? setSelectedLanguagesText(selectedLanguagesString)
                          : setSelectedLanguagesText("Preferred Language(s)");
                        IonNeverDialog.dismiss();
                      }}
                    >
                      <Text style={AddPostPageStyleSheet.ModalText}>OK</Text>
                    </TouchableOpacity>
                  </View>
                </>
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedLanguagesText}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Skill checkbox
  const SkillCheckbox = () => {
    return (
      <TouchableOpacity
        style={AddPostPageStyleSheet.postAgeContainer}
        onPress={() => {
          {
            focusInput;
          }
          Keyboard.dismiss();
          IonNeverDialog.show({
            dialogHeight: 300,
            component: () => {
              return (
                <MultipleSelectorWithOther
                  setSkills={setSkills}
                  setSelectedSkills={setSelectedSkills}
                  setSkillsListData={setSkillsListData}
                  setSelectedSkillsText={setSelectedSkillsText}
                  skills={skills}
                  selectedSkills={selectedSkills}
                  skillsListData={skillsListData}
                />
              );
            },
          });
        }}
      >
        <Text ref={inputRef}>{selectedSkillsText}</Text>
        <MaterialIcons name="edit" size={16} />
      </TouchableOpacity>
    );
  };

  // Display
  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          Keyboard.dismiss();
        }}
      >
        {/* <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        > */}
        <ScrollView>
          <View style={{ height: "auto", alignItems: "center" }}>
            <View style={AddPostPageStyleSheet.typeContainer}>
              <CheckBox
                center
                title="BLOG"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={checkType === "blog"}
                onPress={() => {
                  setCheckType("blog");
                }}
                size={20}
                containerStyle={{ backgroundColor: "transparent" }}
              />
              <CheckBox
                center
                title="TOUR"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={checkType === "tour"}
                onPress={() => {
                  setCheckType("tour");
                }}
                size={20}
                containerStyle={{ backgroundColor: "transparent" }}
              />
              <CheckBox
                center
                title="ENQUIRE"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={checkType === "enquire"}
                onPress={() => setCheckType("enquire")}
                size={20}
                containerStyle={{ backgroundColor: "transparent" }}
              />
            </View>
            {TitleInput()}
            {checkType === "enquire" ? <></> : <CountryCheckbox />}
            {checkType === "enquire" ? (
              <></>
            ) : (
              <LocationInput code={code} updateInputText={updateInputText} />
            )}
            {checkType !== "enquire" ? <PeriodSelector /> : <></>}
            {checkType === "tour" ? BudgetInput() : <></>}
            {ContentInput()}
            {checkType === "tour" ? <HeadcountCheckbox /> : <></>}
            {checkType === "tour" ? <GenderCheckbox /> : <></>}
            {checkType === "tour" ? <AgeCheckbox /> : <></>}
            {checkType === "tour" ? <LanguagesCheckbox /> : <></>}
            {checkType === "tour" ? <SkillCheckbox /> : <></>}
            <View style={AddPostPageStyleSheet.center}>
              <TouchableOpacity
                style={AddPostPageStyleSheet.addPost}
                onPress={addPost}
              >
                <Text style={AddPostPageStyleSheet.addPostText}>
                  Create New Post
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        {/* </KeyboardAvoidingView> */}
      </TouchableWithoutFeedback>
    </>
  );
}

export function AddPostScreen2() {
  const isSelectingLangauge = useBoolean();
  const languageList = useGet("/languages", languageListParser);
  const selectedLanguage = useSelection<LanguageListItem>();
  return (
    <>
      <ScrollView>
        <TextButton
          text="Select Language"
          onPress={isSelectingLangauge.on}
        ></TextButton>
        <View>
          <Text>on? {isSelectingLangauge.value ? "yes" : "no"}</Text>
        </View>
        <View>
          <Text>
            selected:{" "}
            {selectedLanguage.state.map((item) => item.name).join(", ")}
          </Text>
        </View>
        <Modal state={isSelectingLangauge}>
          <View>
            <FlatList
              style={{ maxHeight: 350 }}
              data={languageList.state}
              renderItem={({ item: language }) => (
                <View>
                  <TouchableWithoutFeedback
                    onPress={() => selectedLanguage.toggle(language)}
                  >
                    <View style={styles.checkboxItem}>
                      <CheckBox
                        checked={selectedLanguage.includes(language)}
                        onPress={() => selectedLanguage.toggle(language)}
                      ></CheckBox>
                      <Text>{language.name}</Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
            />
            <TextButton
              text="Ok"
              onPress={() => {
                isSelectingLangauge.off();
              }}
            ></TextButton>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
}

let styles = StyleSheet.create({
  checkboxItem: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.white,
  },
  checkboxLabel: {
    textAlign: "left",
  },
});

export default AddPostScreen1;
