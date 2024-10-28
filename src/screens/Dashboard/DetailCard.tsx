import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { components } from '../../components/'
import { dashboardService } from '../../api/dashboard';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { usePermissions } from '../../common/context/PermissionContext';
import { hasPermission } from '../../utils/HasPermission';

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
    const { permissions } = usePermissions();

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

    const LeadCard = (
        <components.ColorfulCard
            title="Leads"
            description={cardData.leadsCount}
            icon="people"
            cardColor="#ff7675"
        />
    );

    const BlogCard = (
        <components.ColorfulCard
            title="Total Blogs"
            description={cardData.blogsCount}
            icon="newspaper"
            cardColor="#6c5ce7"
        />
    );

    const UserCard = (
        <components.ColorfulCard
            title="Total Users"
            description={cardData.usersCount}
            icon="person"
            cardColor="#74b9ff"
        />
    )

    const ScoresCard = (
        <components.ColorfulCard
        title="CRS Saved Scores"
        description={cardData.scoresCount}
        icon="calculator"
        cardColor="#00cec9"
    />
    );

    return (
        <View>
            {hasPermission(permissions, 'Leads', 'View') ? (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate("ListLeads")}
                >{LeadCard}</TouchableOpacity>
            ) : (LeadCard)}
            {hasPermission(permissions, 'Blogs', 'Read') ? (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate("ListBlogs")}
                >{BlogCard}</TouchableOpacity>
            ) : (BlogCard)}
            {hasPermission(permissions, 'Users', 'Read') ? (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate("ViewUsers")}
                >{UserCard}</TouchableOpacity>
            ) : (UserCard)}
            {hasPermission(permissions, 'Scores', 'Read') ? (
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.navigate("ScoreList")}
                >{ScoresCard}</TouchableOpacity>
            ) : (ScoresCard)}
        </View>
    )
}

export default DetailCard