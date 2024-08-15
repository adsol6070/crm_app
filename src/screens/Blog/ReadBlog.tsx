import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { components } from '../../components';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-gesture-handler';

const ReadBlog = () => {

    const renderHeader = () => {
        return (
            <components.Header
                title="Read Blog"
                goBack={true}
            />
        );
    };
    const renderContent = () => {
        return (
            <View style={styles.blogContainer}>
                <Image source={{ uri: "https://wallpaperaccess.com/full/266471.jpg" }} style={styles.image} />
                <View style={styles.textContainer}>
                    <View style={styles.titleContainer}>
                <Text style={styles.title}>Technology is the best Tool</Text>
                    </View>
                <Text style={styles.textDesign}>Date | Category</Text>
                <Text style={styles.shortDescription}>Technology is a driving force behind modern innovation and progress, continually reshaping the way we live, work, and interact.</Text>
                <Text style={styles.description}>Technology is a driving force behind modern innovation and progress, continually reshaping the way we live, work, and interact. From the dawn of the digital age to the present day, technology has revolutionized industries, transformed communication, and expanded the boundaries of what is possible. Advances in computing power, artificial intelligence, and connectivity have led to breakthroughs that enhance our daily lives, streamline complex processes, and open new frontiers for exploration and creativity. As technology continues to evolve at an unprecedented pace, it presents both opportunities and challenges, necessitating a balanced approach to harness its potential while addressing ethical considerations and ensuring equitable access. Embracing technology's potential can lead to remarkable advancements, fostering a future where innovation drives positive change and enhances the quality of life globally.</Text>
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
    )
}

const styles = StyleSheet.create({
    blogContainer: {
        margin: 10,
    },
    textContainer: {
        margin: 10,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    image: {
        width: '100%',
        height: 150,
        resizeMode: 'cover',
    },
    titleContainer: {
        height: 80,
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: "black",
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10
    },
    textDesign: {
        fontSize: 14,
        color: '#888888',
        marginBottom: 12,
    },
    shortDescription: {
        fontSize: 14,
        color: '#444444',
        lineHeight: 20,
        margin: 10
    },
    description: {
        fontSize: 16,
        color: '#444444',
        lineHeight: 22,
        margin: 10
    },
});

export default ReadBlog