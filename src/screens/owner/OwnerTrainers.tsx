import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../../types';
import client from '../../api/client';
import { useFocusEffect } from '@react-navigation/native';

const OwnerTrainers = () => {
    const [trainers, setTrainers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadTrainers = async () => {
        setIsLoading(true);
        try {
            const res = await client.get('/users/trainers');
            setTrainers(res.data);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load trainers');
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadTrainers();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Trainers</Text>
                <TouchableOpacity style={styles.addButton}>
                    <Text style={styles.addButtonText}>+ Add Trainer</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <ActivityIndicator size="large" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={trainers}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.email}>{item.email}</Text>
                            <Text style={styles.subtext}>Active</Text>
                        </View>
                    )}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#666' }}>No trainers found.</Text>}
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    list: {
        padding: 16,
    },
    card: {
        padding: 16,
        backgroundColor: '#f0f4f8',
        borderRadius: 8,
        marginBottom: 12,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    subtext: {
        marginTop: 8,
        fontSize: 12,
        color: 'green',
        fontWeight: 'bold',
    },
});

export default OwnerTrainers;
