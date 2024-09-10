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
import { theme } from "../../constants/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { capitalizeFirstLetter } from "../../utils/CapitalizeFirstLetter";
import SkeletonLoader from "../Users/SkeletonLoader";
import { components } from "../../components";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { leadService } from "../../api/lead";

const schema = yup.object().shape({
	category: yup.string().required("category is required"),
});

const VisaCategory = () => {
	const navigation = useNavigation();
	const [search, setSearch] = useState<string>("");
	const [refreshing, setRefreshing] = useState<boolean>(false);
	const [filteredCategories, setFilteredCategories] = useState<any[]>([]);
	const [allCategories, setAllCategories] = useState<any[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [isEditModalVisible, setIsEditModalVisible] = useState<boolean>(false);
	const [selectedCategory, setSelectedCategory] = useState<any>(null);

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
			setFilteredCategories(allCategories);
		} else {
			const filteredData = allCategories.filter((category) =>
				category.category.toLowerCase().includes(text.toLowerCase())
			);
			setFilteredCategories(filteredData);
		}
	};

	const fetchCategories = async () => {
		setLoading(true);
		try {
			const categories: any = await leadService.getVisaCategory();
			setAllCategories(categories)
			setFilteredCategories(categories);
		} catch (error) {
			console.error("Error fetching categories:", error);
			setLoading(false);
		} finally {
			setLoading(false);
		}
	};

	const onRefresh = useCallback(() => {
		setRefreshing(true);
		fetchCategories();
		reset();
		fetchCategories().finally(() => setRefreshing(false));
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchCategories();
		}, [])
	);

	const onSubmit = async (data: any) => {
		try {
			if (selectedCategory) {
				await leadService.updateVisaCategory(selectedCategory.id, data);
				Alert.alert("Category updated successfully");
			} else {
				await leadService.createVisaCategory(data);
				Alert.alert("Category added successfully");
			}
			fetchCategories();
		} catch (error) {
			console.log("Error creating categories", error)
		}
		reset();
		closeEditModal();
	}

	const handleEdit = (category: any) => {
		setSelectedCategory(category);
		setValue("category", category.category); 
		setIsEditModalVisible(true);
	};

	const closeEditModal = () => {
		setSelectedCategory(null);
		setIsEditModalVisible(false);
		reset();
	};

	const handleDelete = (id: string) => {
		Alert.alert(
			"Confirm Deletion",
			"Are you sure you want to delete this category",
			[
				{
					text: "Cancel",
					style: "cancel",
				},
				{
					text: "OK",
					onPress: async () => {
						try {
							await leadService.deleteVisaCategory(id);
							fetchCategories();
						} catch (error) {
							console.error("Error deleting category:", error);
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
						{capitalizeFirstLetter(item.category)}
					</Text>
				</View>
				<View style={{
					flexDirection: "row",
				}} >
					<TouchableOpacity
						onPress={() => handleEdit(item)}
						style={styles.iconButton}
					>
						<MaterialIcons name="edit" size={20} color="blue" />
					</TouchableOpacity>
					<TouchableOpacity
						onPress={() => handleDelete(item.id)}
						style={styles.iconButton}
					>
						<MaterialIcons name="delete" size={20} color="red" />
					</TouchableOpacity>
				</View>
			</View>
		);
	};

	return (
		<SafeAreaView style={styles.container}>
			<View style={{ flex: 1 }}>
				<components.Header1
					title="Visa Category"
					showBackButton={true}
					onBackPress={() => navigation.goBack()}
				/>
				<View style={styles.addContainer}>
					<Controller
						name="category"
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<components.InputField
								title="Category"
								placeholder="Enter category name"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								error={errors.category?.message}
							/>
						)}
					/>
					<TouchableOpacity
						style={styles.submitButton}
						onPress={handleSubmit(onSubmit)}
					>
						<Text style={styles.submitButtonText}>Add Category</Text>
					</TouchableOpacity>
				</View>
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
						placeholder="Search Category..."
					/>
				</View>
				<View style={styles.countContainer}>
					{loading ? (
						<SkeletonLoader countOnly={true} withImage={false} />
					) : (
						<Text style={styles.countText}>
							{filteredCategories.length === 0
								? "0 Category found"
								: `${filteredCategories.length} ${filteredCategories.length === 1 ? "Category" : "Categories"
								}`}
						</Text>
					)}
				</View>
				<View style={{ flex: 1 }}>
					{loading ? (
						Array.from({ length: 8 }).map((_, index) => (
							<SkeletonLoader key={index} />
						))
					) : filteredCategories.length === 0 ? (
						<View style={styles.noTextContainer}><Text style={styles.noText}>No categories found</Text></View>
					) : (
						<FlatList
							data={filteredCategories}
							renderItem={renderItem}
							keyExtractor={(item) => item.id.toString()}
							refreshing={refreshing}
							onRefresh={onRefresh}
						/>
					)}
				</View>
			
				<Modal
					animationType="slide"
					transparent={true}
					visible={isEditModalVisible}
					onRequestClose={closeEditModal}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalContent}>
							<Text style={styles.modalTitle}>Edit Category</Text>
							<Controller
								name="category"
								control={control}
								render={({ field: { onChange, onBlur, value } }) => (
									<components.InputField
										title="Category"
										placeholder="Enter category name"
										onBlur={onBlur}
										onChangeText={onChange}
										value={value}
										error={errors.category?.message}
									/>
								)}
							/>
							<View style={styles.modalButtons}>
								<TouchableOpacity
									style={styles.modalButton}
									onPress={handleSubmit(onSubmit)}
								>
									<Text style={styles.modalButtonText}>Save</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.modalButtonCancel}
									onPress={closeEditModal}
								>
									<Text style={styles.modalButtonTextCancel}>Cancel</Text>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Modal>
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
	addContainer: {
		margin: 20,
		marginBottom: 5
	},
	submitButton: {
		backgroundColor: theme.COLORS.black,
		paddingVertical: 12,
		borderRadius: 5,
		marginTop: 5,
		alignItems: "center",
		elevation: 2,
	},
	submitButtonText: {
		...theme.FONTS.H5,
		color: theme.COLORS.white,
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalContent: {
		width: 300,
		backgroundColor: "white",
		borderRadius: 20,
		padding: 20,
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	modalTitle: {
		...theme.FONTS.H3,
		marginBottom: 20,
	},
	modalButtons: {
		flexDirection: "row",
		marginTop: 20,
	},
	modalButton: {
		backgroundColor: theme.COLORS.primary,
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
		marginHorizontal: 5,
	},
	modalButtonText: {
		color: "white",
		...theme.FONTS.H4,
	},
	modalButtonCancel: {
		backgroundColor: "grey",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 10,
		marginHorizontal: 5,
	},
	modalButtonTextCancel: {
		color: "white",
		...theme.FONTS.H4,
	},
});

export default VisaCategory;
