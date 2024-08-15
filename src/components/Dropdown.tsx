import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DropdownProps {
    options: string[];
    selectedValue: any;
    onSelect: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: any;
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedValue, onSelect, placeholder, label, error }) => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleDropdown = () => {
        setIsVisible(!isVisible);
    };

    const handleSelect = (value: string) => {
        onSelect(value);
        setIsVisible(false);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableOpacity style={styles.dropdownButton} onPress={toggleDropdown}>
                <View style={styles.inputStyle}>
                    <Text style={styles.buttonText}>{selectedValue || placeholder}</Text>
                    <Ionicons name="chevron-down" size={20} color="#bbb" />
                </View>
            </TouchableOpacity>

            <Modal
                transparent={true}
                visible={isVisible}
                animationType="slide"
                onRequestClose={() => setIsVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <FlatList
                            data={options}
                            keyExtractor={(item) => item}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.option} onPress={() => handleSelect(item)}>
                                    <Text style={styles.optionText}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>
            {error && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 10,
        marginBottom: 10,
    },
    label: {
        position: 'absolute',
        top: -10,
        left: 20,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 5,
        fontSize: 12,
        color: '#000',
        zIndex: 1,
    },
    inputStyle: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dropdownButton: {
        padding: 15,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 25,
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#bbb',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    option: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    optionText: {
        fontSize: 16,
        color: '#000',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
        marginLeft: 10,
    },
});

export default Dropdown;
