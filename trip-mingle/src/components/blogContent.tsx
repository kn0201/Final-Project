import { TextInput, TouchableOpacity, View, Text, Image } from "react-native";

import { BlogContentStyleSheet } from "../StyleSheet/blogContentCss";
import AntDesign from "react-native-vector-icons/AntDesign";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { center } from "../StyleSheet/StyleSheetHelper";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";

export default function BlogContent() {
  const [image, setImage] = useState(null);

  const [content, setContent] = useState<string>();

  const addImage = async () => {
    let _image = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    //@ts-ignore
    if (!_image.canceled) {
      //@ts-ignore
      setImage(_image.assets[0].uri);
      //   updateInputText("avatar", _image.assets[0].uri);
    }
  };
  return (
    <>
      <TouchableOpacity
        onPress={addImage}
        style={BlogContentStyleSheet.addButton}
      >
        <Text>{image ? "Edit" : "Upload"} Image</Text>
        <AntDesign name="camera" size={20} color="black" />
      </TouchableOpacity>

      <View style={BlogContentStyleSheet.contentContainer}>
        <View>
          <TextInput
            onChangeText={(content) => {
              setContent(content);
            }}
            multiline
            placeholder="Post Content *"
          />
        </View>
        <View style={BlogContentStyleSheet.uploadContainerSquare}>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 100, height: 100, alignItems: center }}
            />
          )}
        </View>
      </View>
    </>
  );
}
