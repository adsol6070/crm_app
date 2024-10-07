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

const ScoreList = () => {
  const { user } = useAuth();
  const refreshRef = useRef<() => void>();
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState<boolean>(false);

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
          {
            iconName: "delete",
            iconType: "MaterialIcons",
            onPress: (item) => handleDelete(item.id),
            size: 20,
          },
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
            <View style={styles.modalContainer}>
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
});

export default ScoreList;
