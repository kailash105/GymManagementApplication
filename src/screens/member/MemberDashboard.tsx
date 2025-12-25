import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Button, Avatar, IconButton, useTheme, Surface } from 'react-native-paper';
import client from '../../api/client';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const MemberDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const [stats, setStats] = useState({
        streak: 12,
        weight: 75,
        workoutsLeft: 0,
    });

    const loadStats = async () => {
        if (!user) return;
        try {
            const res = await client.get('/workouts');
            setStats({
                streak: 12, // Mock streak
                weight: 75, // Mock weight
                workoutsLeft: res.data.length,
            });
        } catch (error) {
            console.error('Failed to load member stats', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [user])
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>Welcome Back,</Text>
                        <Text variant="headlineMedium" style={{ fontWeight: 'bold' }}>{user?.name}</Text>
                    </View>
                    <IconButton
                        icon="logout"
                        iconColor={theme.colors.error}
                        size={24}
                        onPress={logout}
                        mode="contained"
                        containerColor={theme.colors.surface}
                    />
                </View>

                {/* Hero / Next Workout */}
                <Card style={[styles.heroCard, { backgroundColor: '#1E1E1E' }]} mode="elevated">
                    <Card.Content>
                        <Surface style={styles.heroTag} elevation={0}>
                            <Text style={styles.heroTagText}>TODAY'S GOAL</Text>
                        </Surface>
                        <Text variant="headlineSmall" style={styles.heroTitle}>Upper Body Power</Text>
                        <Text variant="bodyMedium" style={styles.heroSubtitle}>45 mins • Intermediate</Text>
                        <Button
                            mode="contained-tonal"
                            onPress={() => navigation.navigate('My Plan')}
                            style={styles.startBtn}
                            labelStyle={{ color: '#1E1E1E', fontWeight: 'bold' }}
                        >
                            Start Workout
                        </Button>
                    </Card.Content>
                    {/* Decorative circles would go here if needed, keeping simple for now */}
                </Card>

                {/* Tracking Grid */}
                <Text variant="titleLarge" style={styles.sectionTitle}>Your Progress</Text>
                <View style={styles.gridContainer}>
                    <Card style={styles.gridCard} mode="contained">
                        <Card.Content style={styles.gridContent}>
                            <MaterialCommunityIcons name="fire" size={32} color="#FF9800" />
                            <Text variant="headlineSmall" style={styles.gridValue}>{stats.streak}</Text>
                            <Text variant="bodySmall" style={styles.gridLabel}>Day Streak</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.gridCard} mode="contained">
                        <Card.Content style={styles.gridContent}>
                            <MaterialCommunityIcons name="scale" size={32} color="#4CAF50" />
                            <Text variant="headlineSmall" style={styles.gridValue}>{stats.weight}kg</Text>
                            <Text variant="bodySmall" style={styles.gridLabel}>Weight</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.gridCard} mode="contained">
                        <Card.Content style={styles.gridContent}>
                            <MaterialCommunityIcons name="dumbbell" size={32} color="#2196F3" />
                            <Text variant="headlineSmall" style={styles.gridValue}>{stats.workoutsLeft}</Text>
                            <Text variant="bodySmall" style={styles.gridLabel}>Plans</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Recent History / Action */}
                <Text variant="titleLarge" style={styles.sectionTitle}>Quick Actions</Text>

                <Card
                    style={styles.actionCard}
                    mode="elevated"
                    onPress={() => navigation.navigate('My Plan')}
                >
                    <Card.Title
                        title="View All Plans"
                        subtitle="Check your assigned routines"
                        left={(props) => <Avatar.Icon {...props} icon="format-list-bulleted" style={{ backgroundColor: '#E3F2FD' }} color="#007AFF" size={40} />}
                        right={(props) => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>

                <Card
                    style={styles.actionCard}
                    mode="elevated"
                    onPress={() => { }}
                >
                    <Card.Title
                        title="Log Health Data"
                        subtitle="Update your weight & stats"
                        left={(props) => <Avatar.Icon {...props} icon="heart" style={{ backgroundColor: '#FFEBEE' }} color="#F44336" size={40} />}
                        right={(props) => <IconButton {...props} icon="chevron-right" />}
                    />
                </Card>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    heroCard: {
        marginBottom: 32,
        padding: 8,
    },
    heroTag: {
        backgroundColor: '#34C759',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        alignSelf: 'flex-start',
        marginBottom: 12,
    },
    heroTagText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    heroTitle: {
        color: '#fff',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    heroSubtitle: {
        color: '#8E8E93',
        marginBottom: 16,
    },
    startBtn: {
        backgroundColor: '#fff',
        borderRadius: 10,
        alignSelf: 'flex-start',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    gridCard: {
        width: (width - 48 - 16) / 3,
        alignItems: 'center',
    },
    gridContent: {
        alignItems: 'center',
        padding: 8,
    },
    gridValue: {
        fontWeight: 'bold',
        marginTop: 8,
    },
    gridLabel: {
        color: '#8E8E93',
        textAlign: 'center',
    },
    actionCard: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
});

export default MemberDashboard;
