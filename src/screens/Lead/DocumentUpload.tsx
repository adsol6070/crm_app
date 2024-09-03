import { View, Text, TouchableOpacity, StyleSheet, Alert, Modal, Linking } from 'react-native';
import React, { useEffect, useState } from 'react';
import { components } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { theme } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { leadService } from '../../api/lead';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAuth } from '../../common/context/AuthContext';

const iconMapping: any = {
    'Passport': 'badge',
    'Photo': 'person',
    'Travel Insurance': 'card-travel',
    'Proof of Financial Means': 'attach-money',
    'Addhaar Code': 'badge',
    'Biometric Information': 'fingerprint'
};

const DocumentUpload = () => {
    const route = useRoute();
    const { user }: any = useAuth();
    const { leadId, documentName }: any = route.params;
    const [loading, setLoading] = useState(true);
    const [documentStatus, setDocumentStatus] = useState(false);
    const [uploadedDocument, setUploadedDocument] = useState<any>(null);
    const [documentUrl, setDocumentUrl] = useState<string | null>(null);
    const [file, setFile] = useState<{ uri: string, type: string, name: string } | null>(null);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const MAX_FILE_SIZE = 4 * 1024 * 1024;

    const checkFileSize = async (fileUri: string) => {
        try {
            const fileInfo: any = await FileSystem.getInfoAsync(fileUri);
            return fileInfo.size <= MAX_FILE_SIZE;
        } catch (error) {
            console.error("Error checking file size:", error);
            return false;
        }
    };

    const getSingleDocument = async () => {
        setLoading(true);
        try {
            const response: any = await leadService.getUploadedDocuments(leadId);
            const uploadedDocument = response.documents.find((doc: any) => doc.name === documentName);
            if (uploadedDocument) {
                setUploadedDocument(uploadedDocument);
                setDocumentStatus(true);
                const urlResponse: any = await leadService.getSingleDocumentUrl(leadId, uploadedDocument.filename);
                const url = urlResponse.url;
                setDocumentUrl(url);
            } else {
                setDocumentStatus(false);
            }
        } catch (error) {
            console.error("Error fetching documents:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSingleDocument();
    }, []);

    const extensionGetter = (fileName: string) => {
        const normalizedFileName = fileName.replace(/\s+/g, '-').toLowerCase();
        
        const lastDotIndex = normalizedFileName.lastIndexOf('.');
        
        if (lastDotIndex === -1 || lastDotIndex === 0) {
            return '';
        }
        
        return normalizedFileName.substring(lastDotIndex + 1);
    };

    const uploadDocumnet = async () => {
        if (!file) {
            Alert.alert("No file selected", "Please select a file to upload.");
            return;
        }
        try {
            const isValidSize = await checkFileSize(file.uri);
            if (!isValidSize) {
                Alert.alert("File too large", "The file size exceeds the 4 MB limit.");
                return;
            }

            const formData = new FormData();
            formData.append('tenantID', user.tenantID);
            formData.append('leadID', leadId);
            formData.append('name', documentName);
            formData.append('uploadType', `leadDocuments-${leadId}`);

            const extName = extensionGetter(file.name);
            const correctedFile = {
                ...file,
                name: `${documentName}.${extName}`
            }

            formData.append('documents', correctedFile)
            await leadService.uploadSingleDocument(leadId, formData);
            setFile(null)
            Alert.alert("File Uploaded Successfully");
            getSingleDocument()
        } catch (error) {
            console.error("Error uploading document:", error);
        } finally {
            setLoading(false);
        }
    }

    const updateSingleDocumnet = async () => {
        if (!file) {
            Alert.alert("No file selected", "Please select a file to update.");
            return;
        }
        try {
            const isValidSize = await checkFileSize(file.uri);
            if (!isValidSize) {
                Alert.alert("File too large", "The file size exceeds the 4 MB limit.");
                return;
            }
            const formData = new FormData();
            formData.append('name', documentName);
            formData.append('uploadType', `leadDocuments-${leadId}`);
            const extName = extensionGetter(file.name);
            const correctedFile = {
                ...file,
                name: `${documentName}.${extName}`
            }
            formData.append('documents', correctedFile);

            await leadService.updateSingleDocument(leadId, uploadedDocument.filename, formData);
            Alert.alert("File Updated Successfully");
            handleModalClose();
            getSingleDocument()
        } catch (error) {
            console.error("Error updating document:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleEditClick = () => {
        setIsModalVisible(true);
    };

    const handleModalClose = () => {
        setFile(null)
        setIsModalVisible(false);
    };

    const getIconName = (name: string) => {
        return iconMapping[name] || 'description';
    };

    const handleShareClick = async () => {
        if (typeof documentUrl === 'string' && documentUrl.startsWith('http')) {
            try {
                const fileExtension = documentUrl.split('.').pop();
                const fileName = documentName + (fileExtension ? `.${fileExtension}` : '');
                const fileUri = FileSystem.documentDirectory + fileName;
                const { uri } = await FileSystem.downloadAsync(documentUrl, fileUri);
                await Sharing.shareAsync(uri);
            } catch (error) {
                Alert.alert("Download Error", "There was an error downloading the document.");
            }
        } else {
            Alert.alert("Invalid URL", "The document URL is not valid.");
        }
    };
    const handleView = () => {
        Linking.openURL(documentUrl as string) 
    }

    const handleDeleteClick = () => {
        Alert.alert(
            "Confirm Deletion",
            "Are you sure you want to delete the document?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        try {
                            await leadService.deleteSingleDocument(leadId, uploadedDocument.filename);
                            getSingleDocument();
                        } catch (error) {
                            console.error("Error deleting document:", error);
                        }
                    },
                },
            ]
        );
    };

    const renderHeader = () => {
        return (
            <components.Header
                title="Upload"
                goBack={true}
            />
        );
    };

    const renderContent = () => {
        const iconName = getIconName(documentName);


        if (loading) {
            return (
                <View style={styles.spinnerContainer}>
                    <components.Spinner />
                </View>
            );
        }

        return (
            <View>
                <View style={styles.uploadHeader}>
                    <MaterialIcons name={iconName} style={styles.iconStyles} color={theme.COLORS.black} />
                    <Text style={styles.headerText}>{documentName}</Text>
                    <Text style={styles.titleText}>Upload your documents in PDF, JPEG, or PNG formats</Text>
                </View>
                <View style={styles.uploadedArea}>
                    {documentStatus ?
                        <View style={styles.viewArea}>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleShareClick}
                            >
                                <MaterialIcons name="share" size={25} color='white' />
                                <Text style={styles.buttonText}>Share</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleView}
                            >
                                <MaterialIcons name="visibility" size={25} color='white' />
                                <Text style={styles.buttonText}>View</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleEditClick}
                            >
                                <MaterialIcons name="edit" size={25} color='white' />
                                <Text style={styles.buttonText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={handleDeleteClick}
                            >
                                <MaterialIcons name="delete" size={25} color='white' />
                                <Text style={styles.buttonText}>Delete</Text>
                            </TouchableOpacity>
                        </View> :
                        <View>
                            <components.FilePicker file={file} setFile={setFile} allowFilePick={true} />
                            <View style={styles.uploadBtn}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={uploadDocumnet}
                                >
                                    <MaterialIcons name="upload" size={25} color='white' />
                                    <Text style={styles.buttonText}>Upload</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    }
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {renderHeader()}
                {renderContent()}
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isModalVisible}
                    onRequestClose={handleModalClose}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View>
                                <Text style={styles.modalTitle}>Update Document</Text>
                            </View>
                            <View style={styles.filePickerContainer}>
                                <components.FilePicker file={file} setFile={setFile} allowFilePick={true} />
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={updateSingleDocumnet}
                                >
                                    <Text style={styles.modalButtonText}>Update Document</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={handleModalClose}
                                >
                                    <Text style={styles.modalButtonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: theme.COLORS.white,
    },
    uploadHeader: {
        backgroundColor: '#041e39',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    iconStyles: {
        fontSize: 150,
        color: 'white',
    },
    headerText: {
        fontSize: 20,
        color: 'white',
        textAlign: 'center'
    },
    titleText: {
        fontSize: 16,
        margin: 10,
        color: 'white',
        textAlign: 'center'
    },
    uploadedArea: {
        margin: 20,
    },
    viewArea: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.COLORS.black,
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    uploadBtn: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20
    },
    modalContainer: {
        flex: 1,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        height: '50%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 10,
        marginTop: 10,
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
    filePickerContainer: {
        height: '40%',
        width: '100%',
        marginBottom: 10,
    },
});

export default DocumentUpload;
