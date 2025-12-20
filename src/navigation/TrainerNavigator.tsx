import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import TrainerDashboard from '../screens/trainer/TrainerDashboard';
import TrainerMembers from '../screens/trainer/TrainerMembers';
import { Ionicons } from '@expo/vector-icons';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CreateWorkoutScreen from '../screens/trainer/CreateWorkoutScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MemberStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TrainerMembersList" component={TrainerMembers} />
            <Stack.Screen name="CreateWorkout" component={CreateWorkoutScreen} />
        </Stack.Navigator>
    );
};

const TrainerNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = 'fitness';

                    if (route.name === 'Dashboard') iconName = focused ? 'fitness' : 'fitness-outline';
                    else if (route.name === 'My Members') iconName = focused ? 'people' : 'people-outline';

                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="Dashboard" component={TrainerDashboard} />
            <Tab.Screen name="My Members" component={MemberStack} />
        </Tab.Navigator>
    );
};

export default TrainerNavigator;
