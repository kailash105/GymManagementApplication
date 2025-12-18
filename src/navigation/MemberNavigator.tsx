import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MemberDashboard from '../screens/member/MemberDashboard';
import MemberPlans from '../screens/member/MemberPlans';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const MemberNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'person';

                    if (route.name === 'Dashboard') iconName = focused ? 'person' : 'person-outline';
                    else if (route.name === 'My Plan') iconName = focused ? 'list' : 'list-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={MemberDashboard} />
            <Tab.Screen name="My Plan" component={MemberPlans} />
        </Tab.Navigator>
    );
};

export default MemberNavigator;
