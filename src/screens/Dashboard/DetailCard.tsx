import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { components } from '../../components/'
import { dashboardService } from '../../api/dashboard';

const DetailCard = ({ refreshKey }: any) => {
    const [cardData, setCardData] = useState<any>({});
    const [loading, setLoading] = useState<boolean>(true);

    const getCardData = async ()=>{
        try {
            const response: any = await dashboardService.getCardsData();
            setCardData(response);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }
    useEffect(()=>{
        getCardData();
    },[refreshKey]);

    return (
            <View>
                <components.ColorfulCard
                    title="Leads"
                    description={cardData.leadsCount}
                    icon="people"
                    cardColor="#ff7675"
                />
                <components.ColorfulCard
                    title="Total Blogs"
                    description={cardData.blogsCount}
                    icon="newspaper"
                    cardColor="#6c5ce7"
                />
                <components.ColorfulCard
                    title="Total Users"
                    description={cardData.usersCount}
                    icon="person"
                    cardColor="#74b9ff"
                />
                <components.ColorfulCard
                    title="CRS Saved Scores"
                    description={cardData.scoresCount}
                    icon="calculator"
                    cardColor="#00cec9"
                />
            </View>
    )
}

export default DetailCard