import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { User } from '../../types';
import client from '../../api/client';
import { Text, List, Avatar, FAB, Searchbar, useTheme, IconButton, Divider, ActivityIndicator } from 'react-native-paper';

const OwnerMembers = () => {
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const [members, setMembers] = useState<User[]>([]);
    const [filteredMembers, setFilteredMembers] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const loadMembers = async () => {
        setIsLoading(true);
        try {
            const res = await client.get('/users');
            const memberList = res.data.filter((u: User) => u.role === 'MEMBER');
            setMembers(memberList);
            setFilteredMembers(memberList);
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

    const onChangeSearch = (query: string) => {
        setSearchQuery(query);
        if (query) {
            const filtered = members.filter(
                (member) =>
                    member.name.toLowerCase().includes(query.toLowerCase()) ||
                    member.email.toLowerCase().includes(query.toLowerCase())
            );
            setFilteredMembers(filtered);
        } else {
            setFilteredMembers(members);
        }
    };

    const handleDelete = (id: string) => {
        Alert.alert('Confirm Delete', 'Are you sure you want to delete this member?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await client.delete(`/users/${id}`);
                        loadMembers();
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete member');
                    }
                }
            }
        ]);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.title}>Members</Text>
            </View>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Search by name or email"
                    onChangeText={onChangeSearch}
                    value={searchQuery}
                    mode="bar"
                    style={styles.searchBar}
                />
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={filteredMembers}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <Divider />}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>
                                {searchQuery ? 'No members found matching your search.' : 'No members found. Add one!'}
                            </Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.name}
                            description={item.email}
                            left={(props) => <Avatar.Text {...props} size={40} label={item.name.substring(0, 2).toUpperCase()} />}
                            right={(props) => (
                                <IconButton
                                    {...props}
                                    icon="delete"
                                    iconColor={theme.colors.error}
                                    onPress={() => handleDelete(item.id)}
                                />
                            )}
                            onPress={() => { }} // Could navigate to details later
                        />
                    )}
                    contentContainerStyle={styles.list}
                />
            )}

            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
                onPress={() => navigation.navigate('AddMember')}
                label="Add Member"
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    header: {
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
    },
    title: {
        fontWeight: 'bold',
    },
    searchContainer: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    searchBar: {
        elevation: 2,
    },
    list: {
        paddingBottom: 80, // Space for FAB
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default OwnerMembers;
