import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MockDatabase } from '../../services/storage';
import client from '../../api/client';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const TrainerDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const [stats, setStats] = useState({
        members: 0,
        workouts: 0,
    });

    const loadStats = async () => {
        try {
            // Mock stats for trainer
            const usersRes = await client.get('/users');
            const members = usersRes.data.filter((u: any) => u.role === 'MEMBER').length;

            // Count total workouts
            const workoutsRes = await client.get('/workouts');
            setStats({
                members,
                workouts: workoutsRes.data.length,
            });
        } catch (error) {
            console.error("Failed to load stats", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, Coach</Text>
                        <Text style={styles.userName}>{user?.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn} onPress={logout}>
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                </View>

                {/* Performance Card */}
                <View style={styles.heroCard}>
                    <View style={styles.heroContent}>
                        <Text style={styles.heroTitle}>Weekly Performance</Text>
                        <Text style={styles.heroSubtitle}>You're doing great!</Text>
                        <View style={styles.progressBar}>
                            <View style={styles.progressFill} />
                        </View>
                        <Text style={styles.progressText}>85% goal reached</Text>
                    </View>
                    <Ionicons name="trophy" size={80} color="rgba(255,255,255,0.2)" style={styles.heroIcon} />
                </View>

                {/* Stats */}
                <View style={styles.gridContainer}>
                    <View style={styles.gridCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E0F7FA' }]}>
                            <Ionicons name="people" size={24} color="#00BCD4" />
                        </View>
                        <Text style={styles.gridValue}>{stats.members}</Text>
                        <Text style={styles.gridLabel}>My Members</Text>
                    </View>
                    <View style={styles.gridCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#F3E5F5' }]}>
                            <Ionicons name="fitness" size={24} color="#AB47BC" />
                        </View>
                        <Text style={styles.gridValue}>{stats.workouts}</Text>
                        <Text style={styles.gridLabel}>Plans Created</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Manage</Text>
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('My Members', { screen: 'TrainerMembersList' })}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="list" size={24} color="#FF9800" />
                        </View>
                        <Text style={styles.actionText}>Members List</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="calendar" size={24} color="#4CAF50" />
                        </View>
                        <Text style={styles.actionText}>Schedule</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.actionIcon, { backgroundColor: '#ECEFF1' }]}>
                            <Ionicons name="chatbubbles" size={24} color="#607D8B" />
                        </View>
                        <Text style={styles.actionText}>Messages</Text>
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8FA',
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
    greeting: {
        fontSize: 16,
        color: '#8E8E93',
        marginBottom: 4,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1C1C1E',
    },
    profileBtn: {
        padding: 8,
        borderRadius: 12,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    heroCard: {
        backgroundColor: '#5856D6',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
        height: 160,
        justifyContent: 'center',
        shadowColor: '#5856D6',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    heroContent: {
        zIndex: 1,
    },
    heroTitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        marginBottom: 4,
        fontWeight: '600',
    },
    heroSubtitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        marginBottom: 8,
        width: '70%',
    },
    progressFill: {
        width: '85%',
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    progressText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    heroIcon: {
        position: 'absolute',
        right: -10,
        bottom: -10,
        transform: [{ rotate: '-15deg' }],
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    gridCard: {
        backgroundColor: '#fff',
        width: (width - 48 - 16) / 2,
        padding: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    gridValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    gridLabel: {
        fontSize: 14,
        color: '#8E8E93',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 16,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        alignItems: 'center',
        width: (width - 48) / 3,
    },
    actionIcon: {
        width: 64,
        height: 64,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    actionText: {
        fontSize: 12,
        color: '#1C1C1E',
        fontWeight: '600',
    },
});

export default TrainerDashboard;
