import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	FlatList,
	Alert,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, NavigationProp } from "@react-navigation/native";
import { capitalizeFirstLetter } from "../../../utils/CapitalizeFirstLetter";
import SkeletonLoader from "../../Users/components/SkeletonLoader";
import { components } from "../../../components";
import { checklistService } from "../../../api/checklist";
import { usePermissions } from "../../../common/context/PermissionContext";
import { hasPermission } from "../../../utils/HasPermission";
import { theme } from "../../../constants/theme";

type RootStackParamList = {
	ChecklistDetail: { visaType: string, checklistId: string };
  };


const ViewChecklist = () => {
	const navigation = useNavigation<NavigationProp<RootStackParamList>>();
	const [search, setSearch] = useState<string>("");
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [filteredChecklists, setFilteredChecklists] = useState<any[]>([]);
	const [allChecklists, setAllChecklists] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { permissions, refreshPermissions } = usePermissions();

	const handleSearch = (text: string) => {
		setSearch(text);
		if (text === "") {
			setFilteredChecklists(allChecklists);
		} else {
			const filteredData = allChecklists.filter((checklist) =>
				checklist.visaType.toLowerCase().includes(text.toLowerCase())
			);
			setFilteredChecklists(filteredData);
		}
	};

	const fetchChecklists = async () => {
		setLoading(true);
		try {
			const checklists: any = await checklistService.getAllChecklist();
			setAllChecklists(checklists.checklists)
			setFilteredChecklists(checklists.checklists);
		} catch (error) {
			console.error("Error fetching checklists:", error);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchChecklists();
		refreshPermissions();
		fetchChecklists().finally(() => setRefreshing(false));
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchChecklists();
			refreshPermissions();
		}, [])
	);

	const handleDelete = (id: string) => {
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to delete this checklist?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: async () => {
						try {
							await checklistService.deleteChecklistById(id);
							fetchChecklists();
						} catch (error) {
							console.error("Error deleting checklist:", error);
						}
					},
				},
			]
		);
	};

	const renderItem = ({ item, index }: { item: any; index: number }) => {
		return (
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
					flex: 1,
					marginVertical: 10,
					marginHorizontal: 20
				}}
			>
				<View>
					<Text style={{ ...theme.FONTS.H4, marginBottom: 4 }}>
						{capitalizeFirstLetter(item.visaType)}
					</Text>
				</View>
				<View style={{
					flexDirection: "row",
				}} >
					{hasPermission(permissions, 'Checklists', 'Read') && 
					<TouchableOpacity
						onPress={() =>
							navigation.navigate("ChecklistDetail", { visaType: item.visaType, checklistId: item.id })
						}
						style={styles.iconButton}
					>
						<AntDesign name="eye" size={20} color={theme.COLORS.black} />
					</TouchableOpacity> }
					{hasPermission(permissions, 'Checklists', 'DeleteChecklist') &&
					<TouchableOpacity
						onPress={() => handleDelete(item.id)}
						style={styles.iconButton}
					>
						<MaterialIcons name="delete" size={20} color="red" />
					</TouchableOpacity>}
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ flex: 1 }}>
				<components.Header1
					title="Checklists"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
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
						placeholder="Search Checklist..."
					/>
				</View>
				<View style={styles.countContainer}>
					{loading ? (
						<SkeletonLoader countOnly={true} withImage={false} />
					) : (
						<Text style={styles.countText}>
							{filteredChecklists.length === 0
								? "0 Cheklists found"
								: `${filteredChecklists.length} ${filteredChecklists.length === 1 ? "Cheklist" : "Cheklists"
								}`}
						</Text>
					)}
				</View>
				<View style={{ flex: 1 }}>
					{loading ? (
						Array.from({ length: 8 }).map((_, index) => (
							<SkeletonLoader key={index} />
						))
					) : filteredChecklists.length === 0 ? (
						<View style={styles.noTextContainer}><Text style={styles.noText}>No Cheklists found</Text></View>
					) : (
						<FlatList
							data={filteredChecklists}
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
	noTextContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingBottom: 150,
		backgroundColor: theme.COLORS.white,
	},
	noText: {
		fontSize: 20,
		...theme.FONTS.Mulish_700Bold
	},
});

export default ViewChecklist;
