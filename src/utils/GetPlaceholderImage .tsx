import { Text, View } from "react-native";

interface PlaceholderImageProps {
  name: string;
}

const getDarkColor = () => {
  const r = Math.floor(Math.random() * 128);
  const g = Math.floor(Math.random() * 128);
  const b = Math.floor(Math.random() * 128);

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
};

const GetPlaceholderImage: React.FC<PlaceholderImageProps> = ({ name }) => {
  const darkColor = getDarkColor();

  const initial = name.charAt(0).toUpperCase();

  return (
    <View
      style={{
        height: 50,
        width: 50,
        borderRadius: 25,
        backgroundColor: darkColor,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "#fff", fontSize: 24 }}>{initial}</Text>
    </View>
  );
};

export default GetPlaceholderImage;
