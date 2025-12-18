import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubscriptionPlan } from '../../types';

const MOCK_PLANS: SubscriptionPlan[] = [
    { id: 'p1', name: 'Monthly Basic', duration: 'MONTHLY', price: 29.99 },
    { id: 'p2', name: 'Yearly Pro', duration: 'YEARLY', price: 299.99 },
];

const OwnerPlans = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Subscription Plans</Text>
            </View>
            <FlatList
                data={MOCK_PLANS}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View>
                            <Text style={styles.planName}>{item.name}</Text>
                            <Text style={styles.planDuration}>{item.duration}</Text>
                        </View>
                        <Text style={styles.price}>${item.price}</Text>
                    </View>
                )}
                contentContainerStyle={styles.list}
            />
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
