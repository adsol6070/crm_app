import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { components } from '../../components/'
import { dashboardService } from '../../api/dashboard';
import { useNavigation, NavigationProp } from '@react-navigation/native';

type RootStackParamList = {
    ListLeads: undefined;
    ListBlogs: undefined;
    ViewUsers: undefined;
    ScoreList: undefined;
  };

const DetailCard = ({ refreshKey }: any) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [cardData, setCardData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);

    const getCardData = async () => {
        try {
            const response: any = await dashboardService.getCardsData();
            setCardData(response);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        getCardData();
    }, [refreshKey]);

    return (
        <View>
            <TouchableOpacity
            activeOpacity={0.9} 
                onPress={() => navigation.navigate("ListLeads")}
            >
                <components.ColorfulCard
                    title="Leads"
                    description={cardData.leadsCount}
                    icon="people"
                    cardColor="#ff7675"
                />
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.9} 
                onPress={() => navigation.navigate("ListBlogs")}
            >
            <components.ColorfulCard
                title="Total Blogs"
                description={cardData.blogsCount}
                icon="newspaper"
                cardColor="#6c5ce7"
            />
            </TouchableOpacity>
            <TouchableOpacity
             activeOpacity={0.9} 
                onPress={() => navigation.navigate("ViewUsers")}
            >
            <components.ColorfulCard
                title="Total Users"
                description={cardData.usersCount}
                icon="person"
                cardColor="#74b9ff"
            />
            </TouchableOpacity>
            <TouchableOpacity
            activeOpacity={0.9} 
                onPress={() => navigation.navigate("ScoreList")}
            >
            <components.ColorfulCard
                title="CRS Saved Scores"
                description={cardData.scoresCount}
                icon="calculator"
                cardColor="#00cec9"
            />
             </TouchableOpacity>
        </View>
    )
}

export default DetailCard