//Buffer Line

import { View, Text, Dimensions, Image, FlatList } from "react-native";
import { useAppRoute } from "../../navigators";
import { Header } from "@rneui/themed";
import PlaceDetailStyleSheet from "../StyleSheet/PlaceDetailCss";
import { center, iosBlue } from "../StyleSheet/StyleSheetHelper";
import AntDesign from "react-native-vector-icons/AntDesign";
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useEffect, useState } from "react";
import { string } from "cast.ts";
import { Geometry } from "react-native-google-places-autocomplete";

const { width, height } = Dimensions.get("window");
const aspect_ratio = width / height;
const latitudeDelta = 0.05;
const longitudeDelta = latitudeDelta * aspect_ratio;
const GOOGLE_API_KEY = "AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo";

type Place = {
  address: string;
  phone: string;
  geometry: LatLng;
  name: string;
  openDate?: any;
  photos: string;
  rating: number;
  website?: string;
};

//@ts-ignore
export default function PlaceDetail({ navigation }) {
  const params = useAppRoute<"PlaceDetail">();

  useEffect(() => {
    findPlace(params.id)
      .then((placesData) => {
        setPlaces(placesData);
        console.log(placesData);
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
      });
  }, []);

  const [places, setPlaces] = useState<Place>();

  type ItemProps = { title: string };

  const Item = ({ title }: ItemProps) => (
    <View>
      <Text>{title}</Text>
    </View>
  );

  return (
    <>
      <Header
        backgroundColor="white"
        leftComponent={
          <AntDesign
            name="left"
            color={"black"}
            size={20}
            onPress={() => {
              navigation.goBack();
            }}
          />
        }
        centerContainerStyle={{ justifyContent: center }}
        centerComponent={{
          text: params.name,
          style: PlaceDetailStyleSheet.header,
        }}
      ></Header>
      <View>
        <Image
          source={{
            uri: "https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=AcJnMuG7J9qPkbS5jOy3D7TSgyAJ7eE-wcgdc2K9lyyW3UjOd7txahrqdcaX5x_3aAPlnMRuViKsRFmBW4bkYYg2LVFlGkbIUxTi02CD6_0BCKf4rEQEISASt1dTWWq0icFzx3e-_yxo8G-W3fTS-cV47me3DgstAAhWesDzxNxon9Ap1myV&key=AIzaSyDkl6HfJvmSSKDGWH0L0Y183PbBuY9fjdo",
          }}
        />
      </View>
      <View>
        <Text>Name: {places?.name}</Text>
        <Text>phone: {places?.phone}</Text>
        <Text>Address: {places?.address}</Text>
        <Text>Open Date & Time </Text>
        <FlatList
          data={places?.openDate}
          renderItem={({ item }) => <Item title={item.title} />}
          keyExtractor={(item) => item.id}
        />
      </View>
    </>
  );
}
const findPlace = async (id: string) => {
  const url =
    `https://maps.googleapis.com/maps/api/place/details/json?` +
    new URLSearchParams({
      place_id: id,
      key: GOOGLE_API_KEY,
    });
  console.log(url);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error("Network failure: " + (await res.text()));
  }
  const result = await res.json();
  const data = result.result;

  const width = 800;
  const photoUrl =
    `https://maps.googleapis.com/maps/api/place/photo?` +
    new URLSearchParams({
      maxwidth: width.toString(),
      photo_reference: data.photos[0].photo_reference,
      key: GOOGLE_API_KEY,
    });
  const { lat, lng } = data.geometry.location;
  const coordinate = {
    latitude: lat,
    longitude: lng,
  };
  const openDate = data.opening_hours.weekday_text || null;
  const website = data.website || null;
  const placeDetail = {
    name: data.name,
    geometry: coordinate,
    photos: photoUrl,
    rating: data.rating,
    address: data.formatted_address,
    phone: data.international_phone_number,
    openDate: openDate,
    website: website,
  };

  return placeDetail;
};
