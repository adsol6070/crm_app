import { View, Text } from 'react-native'
import React from 'react'
import { components } from '../../components/'

const DetailCard = () => {
    return (
            <View>
                <components.ColorfulCard
                    title="Leads"
                    description="16"
                    icon="people"
                    cardColor="#ff7675"
                />
                <components.ColorfulCard
                    title="Total Blogs"
                    description="8"
                    icon="newspaper"
                    cardColor="#6c5ce7"
                />
                <components.ColorfulCard
                    title="Total Users"
                    description="15"
                    icon="person"
                    cardColor="#74b9ff"
                />
                <components.ColorfulCard
                    title="CRS Saved Scores"
                    description="17"
                    icon="calculator"
                    cardColor="#00cec9"
                />
            </View>
    )
}

export default DetailCard