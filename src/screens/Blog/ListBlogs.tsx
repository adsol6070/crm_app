import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { components } from '../../components';

type RootStackParamList = {
  ReadBlog: undefined;
};

const ListBlogs: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const renderHeader = () => {
    return (
      <components.Header
        title="Blog Lists"
        goBack={true}
      />
    );
  };

  const renderContent = () => {
    return (
      <View style={styles.cardContainer}>
        <Image source={{ uri: "https://wallpaperaccess.com/full/266471.jpg" }} style={styles.image} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Technology is the best tool</Text>
          <Text style={styles.date}>Date Category</Text>
          <Text style={styles.shortDescription}>Technology is a driving force behind modern innovation and progress, continually reshaping the way we live, work, and interact.</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.readMoreButton} onPress={() => navigation.navigate("ReadBlog")}>
              <Text style={styles.readMoreText}>Read More</Text>
            </TouchableOpacity>
            <View style={styles.actionContainer}>
              <TouchableOpacity style={styles.actionIcon} onPress={() => navigation.navigate("ReadBlog")}>
                <Ionicons name="pencil" size={24} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionIcon} onPress={() => navigation.navigate("ReadBlog")}>
                <Ionicons name="trash" size={24} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <ScrollView>
        {renderHeader()}
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    margin: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  image: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333333',
  },
  date: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 12,
  },
  shortDescription: {
    fontSize: 16,
    color: '#444444',
    lineHeight: 22,
  },
  readMoreButton: {
    marginTop: 12,
    backgroundColor: '#000',
    borderRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  readMoreText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  actionIcon: {
    marginLeft: 8, 
  },
});

export default ListBlogs;
