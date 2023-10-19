import { Text } from "react-native";

const TourDetailScreen = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { id } = route.params;

  return <Text>{id}</Text>;
};

export default TourDetailScreen;
