import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const TrainerDashboard = () => {
    const { logout, user } = useContext(AuthContext);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Trainer Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, {user?.name}</Text>
            <Button title="Logout" onPress={() => logout()} />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        color: '#666',
        marginBottom: 24,
    },
});

export default TrainerDashboard;
