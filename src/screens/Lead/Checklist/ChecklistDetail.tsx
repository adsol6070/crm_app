import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	TextInput,
	FlatList,
	Alert,
	Modal,
} from "react-native";
import React, { useCallback, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRoute } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { theme } from "../../../constants/theme";
import { capitalizeFirstLetter } from "../../../utils/CapitalizeFirstLetter";
import SkeletonLoader from "../../Users/SkeletonLoader";
import { components } from "../../../components";
import { checklistService } from "../../../api/checklist";
import { usePermissions } from "../../../common/context/PermissionContext";
import { hasPermission } from "../../../utils/HasPermission";

const schema = yup.object().shape({
	document: yup.string().required("Document name is required"),
});

const ChecklistDetail = () => {
	const navigation = useNavigation();
	const route = useRoute();
	const { visaType, checklistId }: any = route.params;
	const [search, setSearch] = useState<string>("");
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [filteredDocuments, setFilteredDocuments] = useState<any[]>([]);
	const [allDocuments, setAllDocuments] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
	const [isAddModalVisible, setIsAddModalVisible] = useState<boolean>(false);
	const [selectedDocument, setSelectedDocument] = useState<any>(null);
	const { permissions, refreshPermissions } = usePermissions();

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
	} = useForm({
		resolver: yupResolver(schema),
	});

	const handleSearch = (text: string) => {
		setSearch(text);
		if (text === "") {
			setFilteredDocuments(allDocuments);
		} else {
			const filteredData = allDocuments.filter((document) =>
				document.name.toLowerCase().includes(text.toLowerCase())
			);
			setFilteredDocuments(filteredData);
		}
	};

	const fetchDocuments = async () => {
		setLoading(true);
		try {
			const documents: any = await checklistService.getChecklistByVisaType(visaType);
			const checklists = documents?.checklists;
			setAllDocuments(checklists.checklist);
			setFilteredDocuments(checklists.checklist);
		} catch (error) {
			console.error("Error fetching documents:", error);
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		refreshPermissions();
		fetchDocuments().finally(() => setRefreshing(false));
	}, []);

	useFocusEffect(
		useCallback(() => {
			refreshPermissions();
			fetchDocuments();
		}, [])
	);

	const onSubmit = async (data: any) => {
		try {
			if (selectedDocument) {
				// Update document
				const updatedDocuments = allDocuments.map((doc) =>
					doc.name === selectedDocument.name ? { ...doc, name: data.document } : doc
				);
				const formattedDocument = {
					checklist: JSON.stringify(updatedDocuments)
				}
				setAllDocuments(updatedDocuments);
				setFilteredDocuments(updatedDocuments);
				await checklistService.updateChecklistById(checklistId, formattedDocument);
				Alert.alert("Document updated successfully");
			} else {
				// Add document
				const newDocument = { name: data.document, required: true };
				const updatedDocuments = [...allDocuments, newDocument];
				const formattedDocument = {
					checklist: JSON.stringify(updatedDocuments)
				}
				await checklistService.updateChecklistById(checklistId, formattedDocument);
				setAllDocuments(updatedDocuments);
				setFilteredDocuments(updatedDocuments);
				Alert.alert("Document added successfully");
			}
			fetchDocuments();
		} catch (error) {
			console.error("Error saving document", error);
		}
		reset();
		closeModals();
	};

	const handleEdit = (document: any) => {
		setSelectedDocument(document);
		setValue("document", document.name);
		setIsEditModalVisible(true);
	};

	const handleAdd = () => {
		reset();
		setIsAddModalVisible(true);
	};

	const closeModals = () => {
		setSelectedDocument(null);
		setIsEditModalVisible(false);
		setIsAddModalVisible(false);
	};

	const handleDelete = (name: string) => {
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to delete this document?",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: async () => {
						const updatedDocuments = allDocuments.filter((doc) => doc.name !== name);
						setAllDocuments(updatedDocuments);
						setFilteredDocuments(updatedDocuments);
						const formattedDocument = {
							checklist: JSON.stringify(updatedDocuments)
						}
						await checklistService.updateChecklistById(checklistId, formattedDocument);
						Alert.alert("Document deleted successfully");
					},
				},
			]
		);
	};

	const renderItem = ({ item }: { item: any }) => {
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
					<Text style={{ ...theme.FONTS.H4, marginBottom: 4, width: 250 }}>
						{capitalizeFirstLetter(item.name)}
					</Text>
				</View>
				<View style={{
					flexDirection: "row",
				}} >
					{hasPermission(permissions, "Checklists", "EditDocument") &&
					<TouchableOpacity
						onPress={() => handleEdit(item)}
						style={styles.iconButton}
					>
						<MaterialIcons name="edit" size={20} color="blue" />
					</TouchableOpacity> }
					{hasPermission(permissions, "Checklists", "DeleteDocument") &&
					<TouchableOpacity
						onPress={() => handleDelete(item.name)}
						style={styles.iconButton}
					>
						<MaterialIcons name="delete" size={20} color="red" />
					</TouchableOpacity> }
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ flex: 1 }}>
				<components.Header1
					title="Checklist Detail"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
				/>
				{hasPermission(permissions, "Checklists", "AddDocument") && 
				<View style={styles.addContainer}>
					<TouchableOpacity
						style={styles.submitButton}
						onPress={handleAdd}
					>
						<Text style={styles.submitButtonText}>
							Add Document
						</Text>
					</TouchableOpacity>
				</View> }
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
						placeholder="Search Document..."
					/>
				</View>
				<View style={styles.countContainer}>
					{loading ? (
						<SkeletonLoader countOnly={true} withImage={false} />
					) : (
						<Text style={styles.countText}>
							{filteredDocuments.length === 0
								? "0 Document found"
								: `${filteredDocuments.length} ${filteredDocuments.length === 1 ? "Document" : "Documents"
								}`}
						</Text>
					)}
				</View>
				<View style={{ flex: 1 }}>
					{loading ? (
						Array.from({ length: 8 }).map((_, index) => (
							<SkeletonLoader key={index} />
						))
					) : filteredDocuments.length === 0 ? (
						<View style={styles.emptyContainer}>
							<Text style={styles.emptyText}>No Documents Found</Text>
						</View>
					) : (
						<FlatList
							data={filteredDocuments}
							renderItem={renderItem}
							keyExtractor={(item) => item.name}
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					)}
				</View>
			</View>
			<Modal
				animationType="slide"
				transparent={true}
				visible={isEditModalVisible || isAddModalVisible}
				onRequestClose={closeModals}
			>
				<View style={styles.modalContainer}>
					<View style={styles.modalContent}>
						<Text style={styles.modalTitle}>
							{isEditModalVisible ? "Edit Document" : "Add Document"}
						</Text>
						<Controller
							control={control}
							name="document"
							render={({ field: { onChange, onBlur, value } }) => (
								<TextInput
									style={styles.input}
									placeholder="Document Name"
									onBlur={onBlur}
									onChangeText={onChange}
									value={value}
								/>
							)}
						/>
						{errors.document && (
							<Text style={styles.errorText}>{errors.document.message}</Text>
						)}
						<TouchableOpacity
							style={styles.submitButton}
							onPress={handleSubmit(onSubmit)}
						>
							<Text style={styles.submitButtonText}>
								{isEditModalVisible ? "Update" : "Add"}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={styles.cancelButton}
							onPress={closeModals}
						>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</TouchableOpacity>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.COLORS.white,
	},
	addContainer: {
		marginHorizontal: 20,
		marginTop: 15,
	},
	submitButton: {
		backgroundColor: theme.COLORS.primary,
		padding: 10,
		borderRadius: 5,
	},
	submitButtonText: {
		color: theme.COLORS.white,
		fontWeight: "bold",
		textAlign: "center",
	},
	countContainer: {
		marginHorizontal: 20,
		alignItems: 'flex-end'
	},
	countText: {
		color: theme.COLORS.black,
		fontWeight: "bold",
		textAlign: 'right'
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	emptyText: {
		color: theme.COLORS.gray1,
		fontSize: 18,
	},
	iconButton: {
		marginHorizontal: 10,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
	},
	modalContent: {
		width: "80%",
		backgroundColor: theme.COLORS.white,
		padding: 20,
		borderRadius: 10,
	},
	modalTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 10,
	},
	input: {
		borderColor: theme.COLORS.gray1,
		borderWidth: 1,
		padding: 10,
		marginBottom: 15,
		borderRadius: 5,
	},
	errorText: {
		color: "red",
		marginBottom: 10,
	},
	cancelButton: {
		backgroundColor: theme.COLORS.gray1,
		padding: 10,
		borderRadius: 5,
		marginVertical: 10,
	},
	cancelButtonText: {
		color: theme.COLORS.white,
		fontWeight: "bold",
		textAlign: "center",
	},
});

export default ChecklistDetail;
