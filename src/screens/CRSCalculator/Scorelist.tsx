import { useRef, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { theme } from "../../constants/theme";
import { crsService } from "../../api/crscalculator";
import { useAuth } from "../../common/context/AuthContext";
import ListScreen from "../Users/components/ListScreen";
import { usePermissions } from "../../common/context/PermissionContext";
import { hasPermission } from "../../utils/HasPermission";

const ScoreList = () => {
  const { user } = useAuth();
  const refreshRef = useRef<() => void>();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);
  const { permissions } = usePermissions();

  const toggleModal = (item: any) => {
    setSelectedItem(item);
    setModalVisible(!isModalVisible);
  };

  const getScoreColor = (score: any) => {
    if (score >= 80) return "green";
    if (score >= 50) return "orange";
    return "red";
  };

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
              refreshRef.current?.();
            } catch (error) {
              console.error("Error deleting score:", error);
            }
          },
        },
      ]
    );
  };

  const handleDeleteAll = async () => {
    try {
      await crsService.deleteAllScores(user?.sub);
    } catch (error) {
      console.error("Error deleting score:", error);
    }
  };

  return (
    <>
      <ListScreen
        title="Results"
        fetchData={crsService.getAllScores}
        skeletonWithImage={false}
        placeholder="Search by name..."
        centerComponent={(item) => (
          <View style={{ flexDirection: "column" }}>
            <Text style={theme.FONTS.H4}>{item.name}</Text>
            <Text style={theme.FONTS.Mulish_400Regular}>
              Score: {item.score}
            </Text>
          </View>
        )}
        actionConfigs={[
          {
            iconName: "eye",
            iconType: "AntDesign",
            onPress: (item) => toggleModal(item),
            size: 20,
          },
          ...(hasPermission(permissions, 'Scores', 'Delete') ? [{
            iconName: "delete",
            iconType: "MaterialIcons",
            onPress: (item) => handleDelete(item.id),
            size: 20,
          }] : []),
        ]}
        refreshRef={refreshRef}
        deleteAllData={handleDeleteAll}
        searchKey="name"
      />
      {selectedItem && (
        <Modal
          visible={isModalVisible}
          animationType="fade"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            {/* <View style={styles.modalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <Text
                    style={{
                      textAlign: "center",
                      color: getScoreColor(selectedItem.score),
                      fontSize: 24,
                      fontWeight: "bold",
                    }}
                  >
                    Score: {selectedItem.score}
                  </Text>
                  <Text>Name: {selectedItem.name}</Text>
                  <Text>Age: {selectedItem.age}</Text>
                  <Text>Canadian Degree: {selectedItem.canadian_degree}</Text>
                  <Text>
                    Canadian Experience: {selectedItem.canadian_experience}
                  </Text>
                  <Text>Education: {selectedItem.education}</Text>
                  <Text>Email: {selectedItem.email}</Text>
                  <Text>First Language: {selectedItem.first_language}</Text>
                  <Text>
                    Foreign Experience: {selectedItem.foreign_experience}
                  </Text>
                  <Text>Job Offer: {selectedItem.job_offer}</Text>
                  <Text>
                    Provincial Nomination: {selectedItem.provincial_nomination}
                  </Text>
                  <Text>Spouse: {selectedItem.spouse}</Text>
                  <Text>Spouse Education: {selectedItem.spouse_education}</Text>
                  <Text>
                    Spouse Experience: {selectedItem.spouse_experience}
                  </Text>
                  <Text>Spouse Language: {selectedItem.spouse_language}</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View> */}
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
							{selectedItem.spouse != "no" &&
								<View>
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
								</View>
							}

							<TouchableOpacity
								onPress={() => setModalVisible(false)}
								style={styles.closeButton}
							>
								<Text style={styles.closeButtonText}>Close</Text>
							</TouchableOpacity>
						</View>
					</View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
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
	modalText: {
		fontSize: 16,
		...theme.FONTS.Mulish_600SemiBold
	},
});

export default ScoreList;
