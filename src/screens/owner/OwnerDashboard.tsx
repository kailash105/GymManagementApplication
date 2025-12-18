import React, { useContext } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const OwnerDashboard = () => {
    const { logout, user } = useContext(AuthContext);

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>Owner Dashboard</Text>
            <Text style={styles.subtitle}>Welcome, {user?.name}</Text>
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Revenue</Text>
                <Text style={styles.cardValue}>$12,500</Text>
            </View>
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
    card: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 16,
    },
    cardTitle: {
        fontSize: 14,
        color: '#666',
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#28a745',
    },
});

export default OwnerDashboard;
