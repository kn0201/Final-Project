import { useEffect } from "react";
import { View, Text } from "react-native";

export default function OtherProfileScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  // Params
  const { id } = route.params || {
    id: 0,
  };

  // Header
  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Manage Tour",
    });
  }, []);
  return (
    <View>
      <Text>123</Text>
    </View>
  );
}
