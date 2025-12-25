import React, { useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SubscriptionPlan } from '../../types';
import client from '../../api/client';
import { useFocusEffect } from '@react-navigation/native';
import { Text, Card, FAB, Button, useTheme, ActivityIndicator, IconButton } from 'react-native-paper';

const OwnerPlans = () => {
    const theme = useTheme();
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
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Text variant="headlineMedium" style={styles.title}>Subscription Plans</Text>
            </View>

            {isLoading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" />
                </View>
            ) : (
                <FlatList
                    data={plans}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <Card style={styles.card} mode="elevated">
                            <Card.Content style={styles.cardContent}>
                                <View>
                                    <Text variant="titleLarge" style={{ fontWeight: 'bold' }}>{item.name}</Text>
                                    <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>{item.duration} Months</Text>
                                </View>
                                <Text variant="headlineMedium" style={{ color: theme.colors.primary, fontWeight: 'bold' }}>${item.price}</Text>
                            </Card.Content>
                            <Card.Actions>
                                <Button onPress={() => { }}>Edit</Button>
                                <Button textColor={theme.colors.error} onPress={() => { }}>Delete</Button>
                            </Card.Actions>
                        </Card>
                    )}
                    contentContainerStyle={styles.list}
                    ListEmptyComponent={
                        <View style={styles.center}>
                            <Text variant="bodyLarge" style={{ color: theme.colors.outline }}>No plans found.</Text>
                        </View>
                    }
                />
            )}
            <FAB
                icon="plus"
                style={[styles.fab, { backgroundColor: theme.colors.primary }]}
                color={theme.colors.onPrimary}
                onPress={() => { }} // Navigate to Add Plan later
                label="Add Plan"
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
        padding: 16,
        paddingBottom: 80,
    },
    card: {
        marginBottom: 16,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
    },
});

export default OwnerPlans;
