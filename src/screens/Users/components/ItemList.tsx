import React from "react";
import { View, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { theme } from "../../../constants/theme";

interface ActionConfig {
  iconName: string;
  iconType: "AntDesign" | "MaterialIcons";
  onPress: (item: any) => void;
  size?: number;
  color?: string;
}

interface ItemListProps {
  data: any[];
  refreshing: boolean;
  onRefresh: () => void;
  onItemPress: (item: string) => void;
  leadingComponent?: (item: any) => React.ReactNode;
  centerComponent?: (item: any) => React.ReactNode;
  actionConfigs?: ActionConfig[];
}

const ItemList: React.FC<ItemListProps> = ({
  data,
  refreshing,
  onRefresh,
  onItemPress,
  leadingComponent = () => null,
  centerComponent = () => null,
  actionConfigs = [],
}) => {
  const renderItem = ({ item, index }: { item: any; index: number }) => {
    const leading = leadingComponent(item);
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() => {
          if (onItemPress) {
            onItemPress(item);
          }
        }}
        style={[
          styles.itemContainer,
          index % 2 !== 0
            ? { backgroundColor: theme.COLORS.tertiaryWhite }
            : null,
          !leading ? { paddingVertical: 15 } : null,
        ]}
      >
        {leadingComponent(item) && (
          <View style={styles.leadingContainer}>{leadingComponent(item)}</View>
        )}
        <View style={styles.detailsContainer}>
          {centerComponent(item)}
          <View style={styles.iconContainer}>
            {actionConfigs.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => action.onPress(item)}
                style={styles.iconButton}
              >
                {action.iconType === "AntDesign" ? (
                  <AntDesign
                    name={action.iconName}
                    size={action.size}
                    color={action.color || theme.COLORS.black}
                  />
                ) : (
                  <MaterialIcons
                    name={action.iconName}
                    size={action.size}
                    color={action.color || theme.COLORS.black}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    borderBottomColor: theme.COLORS.secondaryWhite,
    borderBottomWidth: 1,
  },
  leadingContainer: {
    paddingVertical: 15,
    marginRight: 22,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 25,
  },
  detailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
  },
  textContainer: {
    flexDirection: "column",
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginHorizontal: 5,
  },
});

export default ItemList;
