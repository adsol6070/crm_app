import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
  ScrollView,
  RefreshControl,
  Linking,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { useAuth } from "../../common/context/AuthContext";
import { leadService } from "../../api/lead";
import { components } from "../../components";
import { Picker } from "@react-native-picker/picker";
import { capitalizeFirstLetter } from "../../utils/CapitalizeFirstLetter";
import { skeletonLoader } from "../../components/skeletonLoaders";
import { usePermissions } from "../../common/context/PermissionContext";
import { hasPermission } from "../../utils/HasPermission";
import Header1 from "../../components/Header1";

type RootStackParamList = {
  AddLead: undefined;
  LeadDetail: { leadId: string };
  LeadActions: { leadId: string; visaType: string };
};

const ListLeads = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [search, setSearch] = useState<string>("");
  const { user }: any = useAuth();
  const { permissions, refreshPermissions } = usePermissions();
  const [data, setData] = useState<any[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<any>(data);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [visaCategories, setVisaCategories] = useState<any[]>([]);
  const [selectedVisaCategory, setSelectedVisaCategory] =
    useState<string>("All");

  const getAllLeads = async () => {
    setLoading(true);
    try {
      if (user.role === "superAdmin") {
        const response: any = await leadService.getAllLeads();
        setData(response);
        setFilteredLeads(response);
      } else {
        const response: any = await leadService.getSpecificLeadByUserId(
          user?.sub
        );
        setData(response);
        setFilteredLeads(response);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const getVisaCategories = async () => {
    try {
      const response: any = await leadService.getVisaCategory();
      const newCategories = response.map((category: any) => {
        return {
          value: category.category,
          label: category.category,
        };
      });
      setVisaCategories([
        { value: "All Visa", label: "All Visa" },
        ...newCategories,
      ]);
    } catch (error) {
      console.error("Error fetching visa categories", error);
    }
  };

  useEffect(() => {
    getAllLeads();
    getVisaCategories();
    refreshPermissions();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    getAllLeads();
    getVisaCategories();
    refreshPermissions();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }, []);

  const handleDelete = (id: string) => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete this lead?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await leadService.deleteLead(id);
              getAllLeads();
              refreshPermissions();
            } catch (error) {
              console.error("Error deleting lead:", error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to delete all leads?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              await leadService.deleteAllLeads();
              getAllLeads();
              refreshPermissions();
            } catch (error) {
              console.error("Error deleting all leads", error);
            }
          },
        },
      ]
    );
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    const filteredData = data.filter((lead: any) =>
      lead.firstname.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredLeads(filteredData);
  };

  const openDialer = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const openMailer = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleVisaCategoryChange = (visaCategory: string) => {
    setSelectedVisaCategory(visaCategory);
    filterLeads(search, visaCategory);
  };

  const filterLeads = (searchText: string, visaCategory: string) => {
    let filteredData = data;

    if (visaCategory !== "All Visa") {
      filteredData = filteredData.filter(
        (lead: any) =>
          lead.visaCategory?.toLowerCase() === visaCategory.toLowerCase()
      );
    }

    if (searchText) {
      filteredData = filteredData.filter((lead: any) =>
        lead.firstname.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredLeads(filteredData);
  };

  const renderVisaFilter = () => (
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedVisaCategory}
        onValueChange={handleVisaCategoryChange}
        style={[styles.picker]}
      >
        {visaCategories.map((option: any) => (
          <Picker.Item
            key={option.value}
            label={capitalizeFirstLetter(option.label)}
            value={option.value}
          />
        ))}
      </Picker>
    </View>
  );

  const renderItem = ({ item }: any) =>
    hasPermission(permissions, "Leads", "View") ? (
      <TouchableOpacity
        key={item.id}
        onPress={() => navigation.navigate("LeadDetail", { leadId: item.id })}
        style={styles.listItem}
      >
        <View style={styles.leadNameContainer}>
          <Text style={styles.leadName}>{item.firstname}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => openMailer(item.email)}
            style={styles.iconButton}
          >
            <MaterialIcons name="email" size={20} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openDialer(item.phone)}
            style={styles.iconButton}
          >
            <MaterialIcons name="phone" size={20} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("LeadActions", {
                leadId: item.id,
                visaType: item.visaCategory,
              })
            }
            style={styles.iconButton}
          >
            <MaterialIcons name="settings" size={20} color="black" />
          </TouchableOpacity>
          {hasPermission(permissions, "Leads", "Delete") && (
            <TouchableOpacity
              onPress={() => {
                handleDelete(item.id);
              }}
              style={styles.iconButton}
            >
              <MaterialIcons name="delete" size={20} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    ) : (
      <View style={styles.listItem}>
        <View style={styles.leadNameContainer}>
          <Text style={styles.leadName}>{item.firstname}</Text>
        </View>
        <View style={styles.iconContainer}>
          <TouchableOpacity
            onPress={() => openMailer(item.email)}
            style={styles.iconButton}
          >
            <MaterialIcons name="email" size={20} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => openDialer(item.phone)}
            style={styles.iconButton}
          >
            <MaterialIcons name="phone" size={20} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("LeadActions", {
                leadId: item.id,
                visaType: item.visaCategory,
              })
            }
            style={styles.iconButton}
          >
            <MaterialIcons name="settings" size={20} color="black" />
          </TouchableOpacity>
          {hasPermission(permissions, "Leads", "Delete") && (
            <TouchableOpacity
              onPress={() => {
                handleDelete(item.id);
              }}
              style={styles.iconButton}
            >
              <MaterialIcons name="delete" size={20} color="red" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1 }}>
        <Header1
          title="Leads"
          showBackButton={true}
          onBackPress={() => navigation.goBack()}
          {...(filteredLeads.length > 0
            ? {
                actionIcon: "plus",
                onActionPress: () => navigation.navigate("AddLead"),
              }
            : {})}
        />
        <View style={styles.searchContainer}>
          <AntDesign name="search1" size={24} color={theme.COLORS.black} />
          <TextInput
            style={styles.searchInput}
            value={search}
            onChangeText={handleSearch}
            placeholder="Search lead..."
          />
        </View>
        {loading ? (
          <skeletonLoader.LeadListSkeletonLoader />
        ) : (
          <View>
            <View style={styles.topBtnContainer}>
              {renderVisaFilter()}
              {hasPermission(permissions, "Leads", "DeleteAll") && (
                <View>
                  <TouchableOpacity
                    onPress={handleDeleteAll}
                    style={styles.iconButton}
                  >
                    <Text style={styles.deleteAllBtn}>Delete All</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <View style={styles.countContainer}>
              <Text style={styles.countText}>{filteredLeads.length} leads</Text>
            </View>
            <View>
              {filteredLeads.length > 0 ? (
                <FlatList
                  data={filteredLeads}
                  renderItem={renderItem}
                  keyExtractor={(item) => item.id.toString()}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                />
              ) : (
                <View style={styles.noLeadsContainer}>
                  <Text style={styles.noLeadsText}>No leads found</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.COLORS.white,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 22,
    marginTop: 22,
  },
  headerText: {
    ...theme.FONTS.H4,
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
  searchInput: {
    width: "100%",
    height: "100%",
    marginHorizontal: 12,
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
  pickerContainer: {
    width: "100%",
    overflow: "hidden",
    marginLeft: 10,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: "black",
  },
  picker: {
    height: 30,
  },
  topBtnContainer: {
    width: "65%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deleteAllBtn: {
    backgroundColor: "red",
    color: "white",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 50,
  },
  listItem: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    borderBottomColor: theme.COLORS.secondaryWhite,
    borderBottomWidth: 1,
  },
  leadNameContainer: {
    flex: 1,
    paddingVertical: 15,
  },
  leadName: {
    ...theme.FONTS.H4,
    marginBottom: 4,
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
  noLeadsContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  noLeadsText: {
    ...theme.FONTS.H4,
    color: theme.COLORS.black,
    textAlign: "center",
    margin: 20,
  },
});

export default ListLeads;
