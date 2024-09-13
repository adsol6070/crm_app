import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  StyleSheet,
  View,
  Text,
  Linking,
  TouchableOpacity,
  Alert,
} from "react-native";
import { theme } from "../../../constants/theme";
import Header1 from "../../../components/Header1";
import SearchBar from "./SearchBar";
import SkeletonLoader from "../SkeletonLoader";
import ItemList from "./ItemList";
import AddButton from "./AddButton";
import { Picker } from "@react-native-picker/picker";
import { capitalizeFirstLetter } from "../../../utils/CapitalizeFirstLetter";
import { usePermissions } from "../../../common/context/PermissionContext";
import { hasPermission } from "../../../utils/HasPermission";

interface ActionConfig {
  iconName: string;
  iconType: "AntDesign" | "MaterialIcons";
  onPress: (item: any) => void;
  size?: number;
  color?: string;
}

interface ListScreenProps<T> {
  title: string;
  fetchData: () => Promise<T[]>;
  mapData?: (data: T[]) => any[];
  placeholder: string;
  noDataMessage: string;
  onItemPress: (item: string) => void;
  addButtonDestination: string;
  actionConfigs?: ActionConfig[];
  skeletonWithImage?: boolean;
  leadingComponent?: (item: any) => React.ReactNode;
  centerComponent?: (item: any) => React.ReactNode;
  refreshRef?: React.MutableRefObject<() => void>;
  isFilterable?: boolean;
  filterOptions?: any[];
  filterProperty?: string;
  searchKey?: string;
  deleteAllData?: () => Promise<any>;
  listPermissions?: any;
  showDeleteAll?: boolean;
}

const ListScreen = <T extends {}>({
  title,
  fetchData,
  mapData,
  placeholder,
  noDataMessage,
  onItemPress,
  addButtonDestination,
  actionConfigs,
  skeletonWithImage = true,
  leadingComponent = () => null,
  centerComponent = () => null,
  refreshRef,
  isFilterable,
  filterOptions,
  filterProperty = "",
  searchKey = "",
  deleteAllData,
  listPermissions,
  showDeleteAll = false,
}: ListScreenProps<T>) => {
  const navigation = useNavigation();
  const { permissions, refreshPermissions } = usePermissions();
  const [search, setSearch] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  console.log("Permissions:", permissions);

  const handleSearch = (text: string) => {
    setSearch(text);

    let results = allData;
    if (text !== "") {
      results = results.filter((item) =>
        item[searchKey].toLowerCase().includes(text.toLowerCase())
      );
    }

    if (selectedFilter && selectedFilter !== "All") {
      results = results.filter((item) => {
        return (
          item[filterProperty]?.toLowerCase() === selectedFilter.toLowerCase()
        );
      });
    }

    setFilteredData(results);
  };

  const extractArrayFromData = (data: any): any[] => {
    if (Array.isArray(data)) {
      return data;
    }

    if (data && typeof data === "object") {
      const arrayProperty = Object.values(data).find((val) =>
        Array.isArray(val)
      );
      return arrayProperty || [];
    }

    return [];
  };

  const fetchItems = async () => {
    setLoading(true);
    try {
      const data = await fetchData();
      const arrayData = extractArrayFromData(data);
      const formattedData = mapData ? mapData(arrayData) : arrayData;
      setAllData(formattedData);
      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchItems().finally(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchItems();
      refreshPermissions();
    }, [])
  );

  useEffect(() => {
    handleSearch(search);
  }, [selectedFilter]);

  if (refreshRef) {
    refreshRef.current = fetchItems;
  }

  const deleteAllItems = () => {
    Alert.alert(
      "Confirm Deletion",
      `Are you sure you want to delete all ${title.toLowerCase()}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await deleteAllData();
              Alert.alert("Success", "All items have been deleted.");
              fetchItems();
              refreshPermissions();
            } catch (error) {
              console.error("Error deleting all leads", error);
            }
          },
        },
      ]
    );
  };

  const renderAddButton = () => {
    if (allData.length === 0 && !loading) {
      return (
        <>
          <AddButton
            onPress={() => navigation.navigate(addButtonDestination)}
            text={`Click here to add the first ${title
              .slice(0, -1)
              .toLowerCase()} now.`}
          />
        </>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Header1
          title={title}
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          {...(allData.length > 0
            ? {
                actionIcon: "plus",
                onActionPress: () => navigation.navigate(addButtonDestination),
              }
            : {})}
        />
        <SearchBar
          value={search}
          onChangeText={handleSearch}
          placeholder={placeholder}
        />
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 22,
            marginBottom: 10,
            alignItems: "center",
          }}
        >
          {isFilterable && filterOptions?.length > 0 && (
            <View style={{ flex: 7 }}>
              <Text
                style={{
                  ...theme.FONTS.H4,
                  color: theme.COLORS.black,
                  marginBottom: 5,
                }}
              >
                Filter by:
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: theme.COLORS.gray1,
                  borderRadius: 5,
                  overflow: "hidden",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Picker
                  selectedValue={selectedFilter}
                  onValueChange={(value) => {
                    setSelectedFilter(value);
                    handleSearch(search);
                  }}
                  style={{
                    height: 40,
                    width: "100%",
                  }}
                >
                  {filterOptions?.map((option, index) => (
                    <Picker.Item
                      key={index}
                      label={capitalizeFirstLetter(option.label)}
                      value={option.value}
                    />
                  ))}
                </Picker>
              </View>
            </View>
          )}
          {showDeleteAll &&
            hasPermission(
              permissions,
              listPermissions.module,
              listPermissions.permissions.DeleteAllButton
            ) && (
              <View
                style={{
                  flex: 4,
                  alignItems: "flex-end",
                  height: "100%",
                  maxHeight: "100%",
                  justifyContent: "flex-end",
                }}
              >
                <TouchableOpacity
                  onPress={() => deleteAllItems()}
                  style={{
                    backgroundColor: "#007BFF",
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                    borderRadius: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      color: theme.COLORS.white,
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    Delete All
                  </Text>
                </TouchableOpacity>
              </View>
            )}
        </View>

        <View style={styles.countContainer}>
          {loading ? (
            <SkeletonLoader countOnly={true} />
          ) : (
            <Text style={styles.countText}>
              {filteredData.length === 0
                ? noDataMessage
                : `${filteredData.length} ${
                    filteredData.length === 1 ? title.slice(0, -1) : title
                  }`}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonLoader key={index} withImage={skeletonWithImage} />
            ))
          ) : filteredData.length === 0 ? (
            <View style={styles.addButtonContainer}>{renderAddButton()}</View>
          ) : (
            <ItemList
              data={filteredData}
              refreshing={refreshing}
              onRefresh={onRefresh}
              onItemPress={onItemPress}
              actionConfigs={actionConfigs}
              leadingComponent={leadingComponent}
              centerComponent={centerComponent}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  countContainer: {
    marginHorizontal: 22,
    marginBottom: 5,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  countText: {
    ...theme.FONTS.H4,
    color: theme.COLORS.black,
  },
  addButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 150,
    backgroundColor: theme.COLORS.white,
  },
  searchInput: {
    width: "100%",
    height: "100%",
    marginHorizontal: 12,
  },
  searchContainer: {
    marginHorizontal: 22,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.COLORS.secondaryWhite,
    height: 48,
    marginVertical: 22,
    paddingHorizontal: 12,
    borderRadius: 22,
  },
});

export default ListScreen;
