//Buffer line

import { View, Text, Image, TouchableOpacity } from "react-native";
import { Geometry } from "react-native-google-places-autocomplete";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { center, row } from "../StyleSheet/StyleSheetHelper";
import { useAppNavigation } from "../../navigators";

//@ts-ignore
export default function MarkerDetail({ place }) {
  const navigation = useAppNavigation();
  const setStarRating = (rating: number) => {
    rating = Math.round(rating * 2) / 2;
    let output = [];
    for (var i = rating; i >= 1; i--) output.push(1);
    if (i >= 0.5 && i < 1) output.push(0.5);
    for (let i = 5 - rating; i >= 1; i--) output.push(0);
    return output.map((star, index) => (
      <MaterialCommunityIcons
        key={index}
        name={
          star === 1 ? "star" : star === 0.5 ? "star-half-full" : "star-outline"
        }
        color={"#DEB934"}
        size={16}
      />
    ));
  };
  return (
    <>
      <View
        style={{
          flexDirection: row,
          alignItems: center,
          justifyContent: center,
          gap: 8,
          width: "auto",
        }}
      >
        <View>
          <Text>{place.placeName}</Text>
          <View style={{ flexDirection: row }}>
            {setStarRating(place.rating)}
          </View>
        </View>
        <MaterialCommunityIcons name="chevron-right" size={20} />
      </View>
    </>
  );
}
