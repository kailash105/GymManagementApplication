import React, { useState, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { User } from '../../types';
import { MockDatabase } from '../../services/storage';

const OwnerMembers = () => {
    const navigation = useNavigation<any>();
    const [members, setMembers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadMembers = async () => {
        setIsLoading(true);
        try {
            const data = await MockDatabase.getUsers();
            // Filter only members
            setMembers(data.filter(u => u.role === 'MEMBER'));
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to load members');
        } finally {
            setIsLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadMembers();
        }, [])
    );

    const handleDelete = (id: string) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this member?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await MockDatabase.deleteUser(id);
                        loadMembers();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete member');
                    }
                }
            }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Members</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('AddMember')}
                >
                    <Text style={styles.addButtonText}>+ Add Member</Text>
                </TouchableOpacity>
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={members}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <Text style={styles.emptyText}>No members found. Add one!</Text>
                    }
                    renderItem={({ item }) => (
                        <View style={styles.memberCard}>
                            <View>
                                <Text style={styles.memberName}>{item.name}</Text>
                                <Text style={styles.memberEmail}>{item.email}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => handleDelete(item.id)}
                            >
                                <Text style={styles.deleteText}>Delete</Text>
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    memberCard: {
        padding: 16,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        marginBottom: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    memberName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    memberEmail: {
        fontSize: 14,
        color: '#666',
    },
    deleteText: {
        color: 'red',
        fontWeight: '600',
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 24,
        color: '#999',
    },
});

export default OwnerMembers;
