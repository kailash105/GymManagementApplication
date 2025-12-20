import React, { useState, useContext, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AuthContext } from '../../context/AuthContext';
import { MockDatabase } from '../../services/storage';
import { WorkoutPlan } from '../../types';
import { useFocusEffect } from '@react-navigation/native';

const MemberPlans = () => {
    const { user } = useContext(AuthContext);
    const [plans, setPlans] = useState<WorkoutPlan[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadPlans = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const data = await MockDatabase.getWorkouts(user.id);
            setPlans(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadPlans();
        }, [user])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Workout Plans</Text>
            </View>

            {isLoading ? (
                <ActivityIndicator style={{ marginTop: 20 }} size="large" />
            ) : (
                <FlatList
                    data={plans}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No workout plans assigned yet.</Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.date}>Assigned: {new Date(item.created_at).toLocaleDateString()}</Text>
                            <View style={styles.divider} />
                            {item.exercises.map((ex, idx) => (
                                <Text key={idx} style={styles.exercise}>• {ex}</Text>
                            ))}
                        </View>
                    )}
                    contentContainerStyle={styles.list}
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
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#007AFF',
    },
    date: {
        fontSize: 12,
        color: '#666',
        marginBottom: 8,
        fontWeight: '600',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginBottom: 8,
    },
    exercise: {
        fontSize: 16,
        marginBottom: 4,
        color: '#333',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 24,
        color: '#999',
    },
});

export default MemberPlans;
