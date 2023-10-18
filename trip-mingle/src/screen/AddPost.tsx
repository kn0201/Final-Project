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
} from "react-native";
import { AddPostCountryList, LanguageList, PostInfo } from "../utils/types";

import { useIonNeverNotification } from "../components/IonNeverNotification/NotificationProvider";
import AddPostPageStyleSheet from "../StyleSheet/AddPostScreenCss";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import LocationInput from "../components/locationInput";
import PeriodPicker from "../components/PeriodPicker";
import MultipleSelector from "../components/MutlipleSelector";
import SingleSelectorWithOther from "../components/SingleSelectorWithOther";
import MultipleSelectorWithOther from "../components/MultipleSelectorWithOther";
import {
  addPostCountryListParser,
  addTourPostParser,
  countryListParser,
} from "../utils/parser";
import { api } from "../apis/api";
import { useToken } from "../hooks/useToken";

export default function AddPost() {
  const { token, payload, setToken } = useToken();
  const { IonNeverToast, IonNeverDialog } = useIonNeverNotification();
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
  const [selectedPeriod, setSelectedPeriod] = useState("Expected Period");
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
  const [countriesListData, setCountriesListData] = useState<
    AddPostCountryList[]
  >([]);
  const getCountryList = async () => {
    const json = await api.getList(
      "/login/country_list",
      addPostCountryListParser,
    );
    setCountriesListData(json);
  };
  const [languagesListData, setLanguagesListData] = useState<LanguageList[]>(
    [],
  );
  const getLanguageList = async () => {
    const json = await api.getList("/user/language_list", countryListParser);
    setLanguagesListData(json);
  };
  const [checkType, setCheckType] = useState("none");

  useEffect(() => {
    getCountryList();
    getLanguageList();
  }, []);

  const postInfo = useRef<PostInfo>({
    type: "",
    title: "",
    content: "",
    trip_country: "",
    trip_location: "",
    trip_period: "",
    trip_headcount: "",
    trip_budget: "",
    preferred_gender: "",
    preferred_age: "",
    preferred_language: "",
    preferred_hobby: "",
  }).current;

  const addPost = async () => {
    try {
      if (checkType !== "none") {
        updateInputText("type", checkType);
      }
      if (title !== "") {
        updateInputText("title", title);
      } else {
        IonNeverDialog.show({
          type: "warning",
          title: "Error",
          message: "Missing title",
          firstButtonVisible: true,
          firstButtonFunction: () => {
            IonNeverDialog.dismiss();
          },
        });
        throw new Error("Missing title");
      }
      if (selectedCountry !== "Destination Country *") {
        updateInputText("trip_country", selectedCountry);
      } else {
        IonNeverDialog.show({
          type: "warning",
          title: "Error",
          message: "Missing destination country",
          firstButtonVisible: true,
          firstButtonFunction: () => {
            IonNeverDialog.dismiss();
          },
        });
        throw new Error("Missing destination country");
      }
      if (content !== "") {
        updateInputText("content", content);
      } else {
        IonNeverDialog.show({
          type: "warning",
          title: "Error",
          message: "Missing content",
          firstButtonVisible: true,
          firstButtonFunction: () => {
            IonNeverDialog.dismiss();
          },
        });
        throw new Error("Missing content");
      }
      if (selectedHeadcount !== "Preferred Headcount *") {
        updateInputText("trip_headcount", selectedHeadcount);
      } else {
        IonNeverDialog.show({
          type: "warning",
          title: "Error",
          message: "Missing preferred headcount",
          firstButtonVisible: true,
          firstButtonFunction: () => {
            IonNeverDialog.dismiss();
          },
        });
        throw new Error("Missing preferred headcount");
      }
      if (selectedPeriod !== "Expected Period") {
        updateInputText("trip_period", selectedPeriod);
      }
      if (budget !== "") {
        updateInputText("trip_budget", budget);
      }
      if (selectedGender !== "Preferred Gender") {
        updateInputText("preferred_gender", selectedGender);
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
      // const json = await api.post(
      //   "/blog/tour",
      //   postInfo,
      //   addTourPostParser,
      //   token,
      // );
      console.log(postInfo);
    } catch (e) {
      console.log({ e });
    }
  };

  // Update Input fields
  const updateInputText = (field: string, value: string) => {
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
              const [countryList, setCountryList] = useState(countriesListData);
              const [matchedCountryList, setMatchedCountryList] =
                useState(countriesListData);
              useEffect(() => {
                setMatchedCountryList(
                  countryList.filter((country) =>
                    country.name
                      .toLocaleLowerCase()
                      .includes(search.toLocaleLowerCase()),
                  ),
                );
              }, [search, countryList]);
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
    const { IonNeverDialog } = useIonNeverNotification();
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
                  languagesList.filter((language) =>
                    language.name
                      .toLocaleLowerCase()
                      .includes(searchLanguages.toLocaleLowerCase()),
                  ),
                );
              }, [searchLanguages, languagesList]);

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
                onPress={() => setCheckType("blog")}
                size={20}
                containerStyle={{ backgroundColor: "transparent" }}
              />
              <CheckBox
                center
                title="TOUR"
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                checked={checkType === "tour"}
                onPress={() => setCheckType("tour")}
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
            {checkType === "tour" ? <PeriodSelector /> : <></>}
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
