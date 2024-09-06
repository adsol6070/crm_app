import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SkeletonLoader from "./SkeletonLoader";
import { rolesService } from "../../api/roles";
import Header1 from "../../components/Header1";
import { capitalizeFirstLetter } from "../../utils/CapitalizeFirstLetter";

const RoleList = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState<string>("");
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filteredRoles, setFilteredRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = filteredRoles.filter((role) =>
      role.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredRoles(filteredData);
  };

  const fetchRoles = async () => {
    setLoading(true);
    try {
      const roles = await rolesService.getAllRoles();
      const formattedRoles = roles.map((role: string, index: number) => ({
        id: index + 1,
        name: role,
      }));
      setFilteredRoles(formattedRoles);
    } catch (error) {
      console.error("Error fetching roles:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchRoles().finally(() => setRefreshing(false));
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchRoles();
    }, [])
  );

  const renderItem = ({ item, index }: { item: any; index: number }) => {
    return (
      <TouchableOpacity
        key={item.id}
        onPress={() =>
          navigation.navigate("RoleDetail", { roleName: item.name })
        }
        style={[
          {
            width: "100%",
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 22,
            paddingVertical: 15,
            borderBottomColor: theme.COLORS.secondaryWhite,
            borderBottomWidth: 1,
          },
          index % 2 !== 0
            ? {
                backgroundColor: theme.COLORS.tertiaryWhite,
              }
            : null,
        ]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
          }}
        >
          <Text style={{ ...theme.FONTS.H4, marginBottom: 4 }}>
            {capitalizeFirstLetter(item.name)}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("RoleDetail", { roleId: item.id })
            }
            style={styles.iconButton}
          >
            <AntDesign name="eye" size={20} color={theme.COLORS.black} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAddButton = () => {
    if (filteredRoles.length === 0 && !loading) {
      return (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("HandleAccess")}
          >
            <AntDesign
              name="pluscircleo"
              size={50}
              color={theme.COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.addButtonText}>
            Click here to add first role now.
          </Text>
        </>
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Header1
          title="Roles"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          {...(filteredRoles.length > 0
            ? {
                actionIcon: "plus",
                onActionPress: () => navigation.navigate("HandleAccess"),
              }
            : {})}
        />
        <View
          style={{
            marginHorizontal: 22,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: theme.COLORS.secondaryWhite,
            height: 48,
            marginVertical: 22,
            paddingHorizontal: 12,
            borderRadius: 22,
          }}
        >
          <Ionicons name="search" size={24} color={theme.COLORS.black} />
          <TextInput
            style={{ width: "100%", height: "100%", marginHorizontal: 12 }}
            value={search}
            onChangeText={handleSearch}
            placeholder="Search role..."
          />
        </View>
        <View style={styles.countContainer}>
          {loading ? (
            <SkeletonLoader countOnly={true} withImage={false} />
          ) : (
            <Text style={styles.countText}>
              {filteredRoles.length === 0
                ? "0 Roles found"
                : `${filteredRoles.length} ${
                    filteredRoles.length === 1 ? "Role" : "Roles"
                  }`}
            </Text>
          )}
        </View>
        <View style={{ flex: 1 }}>
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <SkeletonLoader key={index} />
            ))
          ) : filteredRoles.length === 0 ? (
            <View style={styles.addButtonContainer}>{renderAddButton()}</View>
          ) : (
            <FlatList
              data={filteredRoles}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              refreshing={refreshing}
              onRefresh={onRefresh}
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
  iconButton: {
    padding: 8,
    marginHorizontal: 5,
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
  addButton: {
    marginBottom: 10,
  },
  addButtonText: {
    ...theme.FONTS.H4,
    color: theme.COLORS.black,
  },
});

export default RoleList;
