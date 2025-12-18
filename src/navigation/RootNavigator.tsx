import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthContext } from '../context/AuthContext';
import LoginScreen from '../screens/auth/LoginScreen';
import OwnerNavigator from './OwnerNavigator';
import TrainerNavigator from './TrainerNavigator';
import MemberNavigator from './MemberNavigator';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();

const RootNavigator = () => {
    const { user, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {user ? (
                    // Role-based navigation
                    user.role === 'OWNER' ? (
                        <Stack.Screen name="OwnerApp" component={OwnerNavigator} />
                    ) : user.role === 'TRAINER' ? (
                        <Stack.Screen name="TrainerApp" component={TrainerNavigator} />
                    ) : (
                        <Stack.Screen name="MemberApp" component={MemberNavigator} />
                    )
                ) : (
                    // Auth Stack
                    <Stack.Screen name="Login" component={LoginScreen} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default RootNavigator;
