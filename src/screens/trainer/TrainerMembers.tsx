import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { User } from '../../types';
import { MockDatabase } from '../../services/storage';

const TrainerMembers = () => {
    const navigation = useNavigation<any>();
    const [members, setMembers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadMembers = async () => {
        setIsLoading(true);
        try {
            const data = await MockDatabase.getUsers();
            // In a real app, filtering would be by trainer assignment
            setMembers(data.filter(u => u.role === 'MEMBER'));
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadMembers();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Members</Text>
            </View>
            {isLoading ? (
                <ActivityIndicator style={{ marginTop: 20 }} size="large" />
            ) : (
                <FlatList
                    data={members}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No members assigned.</Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <View>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.email}>{item.email}</Text>
                            </View>
                            <TouchableOpacity
                                style={styles.assignButton}
                                onPress={() => navigation.navigate('CreateWorkout', {
                                    memberId: item.id,
                                    memberName: item.name
                                })}
                            >
                                <Text style={styles.assignText}>Assign Plan</Text>
                            </TouchableOpacity>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    assignButton: {
        backgroundColor: '#e3f2fd',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 16,
    },
    assignText: {
        color: '#007AFF',
        fontWeight: '600',
        fontSize: 12,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 24,
        color: '#999',
    },
});

export default TrainerMembers;
