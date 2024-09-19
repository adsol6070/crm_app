import React, { useState, useCallback } from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	FlatList,
	Modal,
	Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import SkeletonLoader from "../Users/SkeletonLoader";
import { theme } from "../../constants/theme";
import { crsService } from "../../api/crscalculator";
import { components } from "../../components";
import { hasPermission } from "../../utils/HasPermission";
import { usePermissions } from "../../common/context/PermissionContext";
import { useAuth } from "../../common/context/AuthContext";

const ScoreList = () => {
	const navigation = useNavigation();
	const [search, setSearch] = useState<string>("");
	const { user } = useAuth();
	const [isModalVisible, setModalVisible] = useState(false);
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [selectedItem, setSelectedItem] = useState<any>(null);
	const [filteredScores, setFilteredScores] = useState<any[]>([]);
	const [allScores, setAllScores] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const { permissions, refreshPermissions } = usePermissions();

	const handleSearch = (text: string) => {
		setSearch(text);
		if (text === "") {
			setFilteredScores(allScores);
		} else {
			const filteredData = allScores.filter((score) =>
				score.name.toLowerCase().includes(text.toLowerCase())
			);
			setFilteredScores(filteredData);
		}
	};

	const fetchScores = async () => {
		setLoading(true);
		try {
			const response: any = await crsService.getAllScores();
			setAllScores(response);
			setFilteredScores(response);
		} catch (error) {
			console.error("Error fetching scores:", error);
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		refreshPermissions();
		fetchScores().finally(() => setRefreshing(false));
	}, []);


	const handleDelete = (id: string) => {
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to delete this score?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: async () => {
						try {
							await crsService.deleteScoreById(id);
							fetchScores();
						} catch (error) {
							console.error("Error deleting score:", error);
						}
					},
				},
			]
		);
	};

	const handleDeleteAll = () => {
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to delete all scores?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: async () => {
						try {
							await crsService.deleteAllScores(user?.sub);
							fetchScores();
						} catch (error) {
							console.error("Error deleting score:", error);
						}
					},
				},
			]
		);
	};

	useFocusEffect(
		useCallback(() => {
			fetchScores();
			refreshPermissions();
		}, [])
	);

	const getScoreColor = (score: any) => {
		if (score >= 80) return "green";
		if (score >= 50) return "orange";
		return "red";
	};

	const renderItem = ({ item }: { item: any }) => {
		const toggleModal = () => {
			setSelectedItem(item);
			setModalVisible(!isModalVisible);
		};

		return (
			<View style={styles.itemContainer}>
				<View>
					<Text style={styles.nameText}>{item.name}</Text>
					<Text style={styles.scoreText}>Score: {item.score}</Text>
				</View>
				<View style={styles.actionStyles}>
					<TouchableOpacity onPress={toggleModal} style={styles.detailsButton}>
						<Text style={styles.detailsButtonText}>View Details</Text>
					</TouchableOpacity>
					{hasPermission(permissions, 'Scores', 'Delete') &&
						<TouchableOpacity onPress={() => { handleDelete(item.id) }}>
							<MaterialIcons name="delete" size={20} color="red" />
						</TouchableOpacity>}
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<components.Header1
				title="View Results"
				showBackButton={true}
				onBackPress={() => navigation.goBack()}
			/>
			<View style={{ flex: 1 }}>
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
						placeholder="Search by name..."
					/>
				</View>
				<View style={styles.countContainer}>
					{loading ? (
						<SkeletonLoader countOnly={true} withImage={false} />
					) : (
						<View style={styles.deleteAll}>
							{hasPermission(permissions, 'Scores', 'DeleteAll') &&
								<TouchableOpacity onPress={() => { handleDeleteAll() }}>
									<Text style={styles.deleteAllBtn}>Delete All</Text>
								</TouchableOpacity>}
							<Text style={styles.countText}>
								{filteredScores.length === 0
									? "0 Results found"
									: `${filteredScores.length} ${filteredScores.length === 1 ? "Result" : "Results"
									}`}
							</Text>
						</View>
					)}
				</View>
				<View style={{ flex: 1 }}>
					{loading ? (
						Array.from({ length: 8 }).map((_, index) => (
							<SkeletonLoader key={index} />
						))
					) : filteredScores.length === 0 ? (
						<View style={styles.noTextContainer}><Text style={styles.noText}>No results found</Text></View>
					) : (
						<FlatList
							data={filteredScores}
							renderItem={renderItem}
							keyExtractor={(item) => item.id.toString()}
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					)}
				</View>
			</View>

			{selectedItem && (
				<Modal
					visible={isModalVisible}
					animationType="slide"
					transparent={true}
					onRequestClose={() => setModalVisible(false)}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={{ textAlign: "center", color: getScoreColor(selectedItem.score), fontSize: 24, ...theme.FONTS.Mulish_700Bold }}>
								Score: {selectedItem.score}
							</Text>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Name: </Text>
								<Text style={styles.modalText}>{selectedItem.name}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Age: </Text>
								<Text style={styles.modalText}>{selectedItem.age}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Canadian Degree: </Text>
								<Text style={styles.modalText}>{selectedItem.canadian_degree}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Canadian Experience: </Text>
								<Text style={styles.modalText}>{selectedItem.canadian_experience}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Education: </Text>
								<Text style={styles.modalText}>{selectedItem.education}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Email: </Text>
								<Text style={styles.modalText}>{selectedItem.email}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>First Language: </Text>
								<Text style={styles.modalText}>{selectedItem.first_language}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Foreign Experience: </Text>
								<Text style={styles.modalText}>{selectedItem.foreign_experience}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Job Offer: </Text>
								<Text style={styles.modalText}>{selectedItem.job_offer}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Provincial Nomination: </Text>
								<Text style={styles.modalText}>{selectedItem.provincial_nomination}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Spouse: </Text>
								<Text style={styles.modalText}>{selectedItem.spouse}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Spouse Education: </Text>
								<Text style={styles.modalText}>{selectedItem.spouse_education}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Spouse Experience: </Text>
								<Text style={styles.modalText}>{selectedItem.spouse_experience}</Text>
							</View>
							<View style={styles.modalRow}>
								<Text style={styles.modalHeading}>Spouse Language: </Text>
								<Text style={styles.modalText}>{selectedItem.spouse_language}</Text>
							</View>

							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								style={styles.closeButton}
							>
								<Text style={styles.closeButtonText}>Close</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>
			)}
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.COLORS.white,
	},
	itemContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginVertical: 10,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: "#f9f9f9",
		borderRadius: 8,
	},
	actionStyles: {
		width: 150,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-around'
	},
	nameText: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#333",
	},
	deleteAll: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	deleteAllBtn: {
		backgroundColor: 'red',
		color: 'white',
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 50,
	},
	scoreText: {
		fontSize: 16,
		color: "#555",
	},
	detailsButton: {
		backgroundColor: "#007bff",
		paddingVertical: 5,
		paddingHorizontal: 10,
		borderRadius: 5,
	},
	detailsButtonText: {
		color: "#fff",
		fontSize: 14,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: "90%",
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
	},
	modalRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginVertical: 4,
	},
	modalHeading: {
		fontSize: 16,
		...theme.FONTS.Mulish_700Bold
	},
	modalTitle: {
		fontSize: 20,
		marginBottom: 10,
		...theme.FONTS.Mulish_400Regular
	},
	modalText: {
		fontSize: 16,
		...theme.FONTS.Mulish_600SemiBold
	},
	closeButton: {
		marginTop: 20,
		backgroundColor: "#dc3545",
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 5,
		alignItems: "center",
	},
	closeButtonText: {
		color: "#fff",
		fontSize: 16,
	},
	countContainer: {
		marginHorizontal: 22,
		marginBottom: 5,
		flexDirection: "row",
		justifyContent: "flex-end",
	},
	countText: {
		fontSize: 18,
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
		color: theme.COLORS.black,
		fontWeight: "bold",
	},
});

export default ScoreList;
