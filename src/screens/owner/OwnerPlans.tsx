import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubscriptionPlan } from '../../types';
import client from '../../api/client';
import { useFocusEffect } from '@react-navigation/native';

const OwnerPlans = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadPlans = async () => {
        setIsLoading(true);
        try {
            const res = await client.get('/plans');
            setPlans(res.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load plans');
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadPlans();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Subscription Plans</Text>
            </View>
            {isLoading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={plans}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View>
                                <Text style={styles.planName}>{item.name}</Text>
                                <Text style={styles.planDuration}>{item.duration} Months</Text>
                            </View>
                            <Text style={styles.price}>${item.price}</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No plans found.</Text>}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    list: {
        padding: 16,
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#eee',
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    planDuration: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#007AFF',
    },
});

export default OwnerPlans;
