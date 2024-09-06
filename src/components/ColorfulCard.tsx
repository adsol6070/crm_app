import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface ColorfulCardProps {
  title?: string;
  description?: string;
  icon?: any;
  cardColor?: string;  
  iconColor?: string;  
}

const ColorfulCard: React.FC<ColorfulCardProps> = ({ title, description, icon, cardColor = '#FF6F61', iconColor = '#fff' }) => {
  return (
    <View style={[styles.card, { backgroundColor: cardColor }]}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.icon}>
        {icon ? <Ionicons name={icon} size={24} color={iconColor} /> : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    margin: 10,
    padding: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    ...theme.FONTS.Mulish_700Bold
  },
  description: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    ...theme.FONTS.Mulish_400Regular
  },
  icon: {
    marginLeft: 20,
    borderColor: "white",
    borderWidth: 2,
    padding: 10,
    borderRadius: 50
  },
});

export default ColorfulCard;
