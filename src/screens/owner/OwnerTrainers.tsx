import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User } from '../../types';
import client from '../../api/client';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Text, List, Avatar, FAB, useTheme, Divider, ActivityIndicator, IconButton } from 'react-native-paper';

const OwnerTrainers = () => {
    const navigation = useNavigation<any>();
    const theme = useTheme();
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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.title}>Trainers</Text>
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={trainers}
                    keyExtractor={(item) => item.id}
                    ItemSeparatorComponent={() => <Divider />}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>No trainers found.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <List.Item
                            title={item.name}
                            description={item.email}
                            left={(props) => <Avatar.Icon {...props} icon="dumbbell" style={{ backgroundColor: theme.colors.secondaryContainer }} />}
                            right={(props) => (
                                <IconButton
                                    {...props}
                                    icon="delete"
                                    iconColor={theme.colors.error}
                                    onPress={() => { }} // Delete Logic here
                                />
                            )}
                        />
                    )}
                    contentContainerStyle={styles.list}
                />
            )}
            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
                onPress={() => { }} // Navigate to Add Trainer
                label="Add Trainer"
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
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
    },
    list: {
        paddingBottom: 80,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default OwnerTrainers;
