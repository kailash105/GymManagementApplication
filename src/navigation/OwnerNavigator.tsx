import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OwnerDashboard from '../screens/owner/OwnerDashboard';
import OwnerMembers from '../screens/owner/OwnerMembers';
import OwnerTrainers from '../screens/owner/OwnerTrainers';
import OwnerPlans from '../screens/owner/OwnerPlans';
import { Ionicons } from '@expo/vector-icons';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AddMemberScreen from '../screens/owner/AddMemberScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MemberStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OwnerMembersList" component={OwnerMembers} />
            <Stack.Screen name="AddMember" component={AddMemberScreen} />
        </Stack.Navigator>
    );
};

const OwnerNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'home';

                    if (route.name === 'Dashboard') iconName = focused ? 'home' : 'home-outline';
                    else if (route.name === 'Members') iconName = focused ? 'people' : 'people-outline';
                    else if (route.name === 'Trainers') iconName = focused ? 'barbell' : 'barbell-outline';
                    else if (route.name === 'Plans') iconName = focused ? 'card' : 'card-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={OwnerDashboard} />
            <Tab.Screen name="Members" component={MemberStack} />
            <Tab.Screen name="Trainers" component={OwnerTrainers} />
            <Tab.Screen name="Plans" component={OwnerPlans} />
        </Tab.Navigator>
    );
};

export default OwnerNavigator;
