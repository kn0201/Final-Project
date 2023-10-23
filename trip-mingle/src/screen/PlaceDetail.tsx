//Buffer Line

import {
  View,
  Text,
  Dimensions,
  Image,
  FlatList,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useAppRoute } from "../../navigators";
import { Header } from "@rneui/themed";
import PlaceDetailStyleSheet from "../StyleSheet/PlaceDetailCss";
import { center, flex, iosBlue, row } from "../StyleSheet/StyleSheetHelper";
import AntDesign from "react-native-vector-icons/AntDesign";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useEffect, useState } from "react";
import {
  array,
  boolean,
  float,
  number,
  object,
  optional,
  string,
} from "cast.ts";
import { Geometry } from "react-native-google-places-autocomplete";
import { api } from "../apis/api";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import BlogDetailScreenStyleSheet from "../StyleSheet/BlogDetailScreenCss";
import { useToken } from "../hooks/useToken";
import useEvent from "react-use-event";
import { SaveLocationEvent } from "../utils/events";

const { width, height } = Dimensions.get("window");
const aspect_ratio = width / height;
const latitudeDelta = 0.05;
const longitudeDelta = latitudeDelta * aspect_ratio;
const GOOGLE_API_KEY = "AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo";

type Place = {
  name: string;
  geometry: object;
  photos: string;
  rating?: any;
  address: string;
  phone?: string;
  openDate?: any;
  website?: string;
  place_id: string;
};

//@ts-ignore
export default function PlaceDetail({ navigation }) {
  const { token, payload, setToken } = useToken();
  const params = useAppRoute<"PlaceDetail">();
  const [imagePlace, setImage] = useState("");
  const dispatchSaveLocationEvent = useEvent<SaveLocationEvent>("SaveLocation");

  useEffect(() => {
    if (token) {
      checkBookmark(params.id);
    }

    findPlace(params.id)
      .then((placesData) => {
        setPlaces(placesData);
        loadImage(placesData.photos);
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
      });
  }, []);

  const [places, setPlaces] = useState<Place>();

  const [isBookmark, setIsBookmark] = useState(false);

  const checkBookmark = async (id: string) => {
    let json = await api.get(
      `/location/${id}/checkBookmark`,
      object({ result: boolean() }),
      token
    );
    console.log(json.result);

    if (json.result == true) {
      setIsBookmark(true);
    } else {
      setIsBookmark(false);
    }
  };

  const bookmark = async () => {
    console.log("add");

    let json = await api.post(
      "/location/bookmark",
      {
        place_id: places?.place_id,
        name: places?.name,
        address: places?.address,
        geometry: places?.geometry,
      },
      object({ result: boolean() }),
      token
    );
    if (json.result == true) {
      setIsBookmark(true);
      dispatchSaveLocationEvent("SaveLocation");
    }
  };

  const deleteBookmark = async () => {
    console.log("delete");

    let json = await api.patch(
      "/location/bookmark",
      { place_id: places?.place_id },
      object({ result: boolean() }),
      token
    );
    if (json.result == false) {
      setIsBookmark(false);
      dispatchSaveLocationEvent("SaveLocation");
    }
  };

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
  const loadImage = async (url: string) => {
    try {
      const res = await fetch(url);
      const data = await res.blob();
      setImage(URL.createObjectURL(data));
    } catch (error) {
      console.error(error);
    }
  };

  const findPlace = async (id: string) => {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json?` +
      new URLSearchParams({
        place_id: id,
        key: GOOGLE_API_KEY,
      });

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error("Network failure: " + (await res.text()));
    }
    const result = await res.json();
    const data = result.result;

    let GooglePlaceDetailParser = object({
      name: string(),
      geometry: object({
        location: object({
          lat: float(),
          lng: float(),
        }),
      }),
      opening_hours: optional(
        object({
          weekday_text: array(string()),
        })
      ),
      international_phone_number: optional(string()),
      website: optional(string()),
      formatted_address: string(),
      rating: optional(float()),
      place_id: string(),
    });

    const photoWidth = width;
    const photoUrl =
      `https://maps.googleapis.com/maps/api/place/photo?` +
      new URLSearchParams({
        maxwidth: photoWidth.toString(),
        photo_reference: data.photos[0].photo_reference,
        key: GOOGLE_API_KEY,
      });
    let output = GooglePlaceDetailParser.parse(data);

    const { lat, lng } = output.geometry.location;
    const coordinate = {
      latitude: lat,
      longitude: lng,
    };

    const placeDetail = {
      name: output.name,
      geometry: coordinate,
      photos: photoUrl,
      rating: output.rating,
      address: output.formatted_address,
      phone: output.international_phone_number,
      openDate: output.opening_hours,
      website: output.website,
      place_id: output.place_id,
    };

    return placeDetail;
  };
  return (
    <View
      style={{ flex: 1, flexDirection: "column", justifyContent: "flex-end" }}
    >
      <View
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "#fff",

          borderRadius: 10,
        }}
      >
        <Text style={PlaceDetailStyleSheet.header}>{params.name}</Text>
        <View style={PlaceDetailStyleSheet.imageContainer}>
          {imagePlace ? (
            <Image
              source={{ uri: imagePlace }}
              style={{ width: "100%", height: 350, borderRadius: 10 }}
            />
          ) : (
            <></>
          )}
        </View>
        <View style={PlaceDetailStyleSheet.buttonContainer}>
          <Text style={PlaceDetailStyleSheet.bookmarkText}>
            {isBookmark ? "Bookmarked" : "Bookmark"}
          </Text>
          <TouchableOpacity
            onPress={() => {
              isBookmark ? deleteBookmark() : bookmark();
            }}
          >
            <MaterialCommunityIcons
              name={isBookmark ? "bookmark" : "bookmark-outline"}
              size={22}
              style={{ color: iosBlue }}
            />
          </TouchableOpacity>
        </View>
        <View style={PlaceDetailStyleSheet.contentContainer}>
          <View style={PlaceDetailStyleSheet.nameContainer}>
            <Text style={PlaceDetailStyleSheet.allText}>
              Name: {places?.name}
            </Text>
            <View style={{ flexDirection: row }}>
              <Text style={PlaceDetailStyleSheet.allText}>Rating : </Text>
              {setStarRating(places?.rating)}
            </View>
          </View>
          {places?.phone ? (
            <Text style={PlaceDetailStyleSheet.allText}>
              Phone: {places?.phone}
            </Text>
          ) : (
            <></>
          )}
          <Text style={PlaceDetailStyleSheet.allText}>
            Address: {places?.address}
          </Text>

          {places?.openDate ? (
            <>
              <Text style={PlaceDetailStyleSheet.dateText}>
                Open Date & Time
              </Text>
              <FlatList
                data={places?.openDate.weekday_text}
                renderItem={({ item }) => (
                  <Text style={PlaceDetailStyleSheet.allText}>{item}</Text>
                )}
              />
            </>
          ) : (
            <></>
          )}
          {places?.website ? (
            <Text style={PlaceDetailStyleSheet.allText}>
              Website : {places.website}
            </Text>
          ) : (
            <></>
          )}
        </View>
      </View>
    </View>
  );
}
