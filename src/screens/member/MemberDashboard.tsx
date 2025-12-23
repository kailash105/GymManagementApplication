import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import client from '../../api/client';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MemberDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const navigation = useNavigation<any>();
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
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome Back,</Text>
                        <Text style={styles.userName}>{user?.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn} onPress={logout}>
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                </View>

                {/* Hero / Next Workout */}
                <View style={styles.heroCard}>
                    <View style={styles.heroContent}>
                        <View style={styles.heroTag}>
                            <Text style={styles.heroTagText}>TODAY'S GOAL</Text>
                        </View>
                        <Text style={styles.heroTitle}>Upper Body Power</Text>
                        <Text style={styles.heroSubtitle}>45 mins • Intermediate</Text>
                        <TouchableOpacity style={styles.startBtn} onPress={() => navigation.navigate('My Plan')}>
                            <Text style={styles.startBtnText}>Start Workout</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Abstract decorative circles */}
                    <View style={[styles.circle, { top: -20, right: -20, width: 100, height: 100 }]} />
                    <View style={[styles.circle, { bottom: -40, right: 40, width: 80, height: 80 }]} />
                </View>

                {/* Tracking Grid */}
                <Text style={styles.sectionTitle}>Your Progress</Text>
                <View style={styles.gridContainer}>
                    <View style={styles.gridCard}>
                        <Ionicons name="flame" size={32} color="#FF9800" style={{ marginBottom: 8 }} />
                        <Text style={styles.gridValue}>{stats.streak}</Text>
                        <Text style={styles.gridLabel}>Day Streak</Text>
                    </View>
                    <View style={styles.gridCard}>
                        <Ionicons name="scale" size={32} color="#4CAF50" style={{ marginBottom: 8 }} />
                        <Text style={styles.gridValue}>{stats.weight}kg</Text>
                        <Text style={styles.gridLabel}>Current Weight</Text>
                    </View>
                    <View style={styles.gridCard}>
                        <Ionicons name="barbell" size={32} color="#2196F3" style={{ marginBottom: 8 }} />
                        <Text style={styles.gridValue}>{stats.workoutsLeft}</Text>
                        <Text style={styles.gridLabel}>Plans Assigned</Text>
                    </View>
                </View>

                {/* Recent History / Action */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('My Plan')}>
                    <View style={[styles.iconBox, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="list" size={24} color="#007AFF" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.actionTitle}>View All Plans</Text>
                        <Text style={styles.actionSubtitle}>Check your assigned routines</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionCard}>
                    <View style={[styles.iconBox, { backgroundColor: '#FFEBEE' }]}>
                        <Ionicons name="heart" size={24} color="#F44336" />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.actionTitle}>Log Health Data</Text>
                        <Text style={styles.actionSubtitle}>Update your weight & stats</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

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
        backgroundColor: '#1E1E1E',
        borderRadius: 24,
        padding: 24,
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
        height: 180,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    heroContent: {
        zIndex: 1,
        alignItems: 'flex-start',
    },
    heroTag: {
        backgroundColor: '#34C759',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginBottom: 12,
    },
    heroTagText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    heroTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    heroSubtitle: {
        color: '#8E8E93',
        fontSize: 14,
        marginBottom: 16,
    },
    startBtn: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    startBtnText: {
        color: '#1E1E1E',
        fontWeight: 'bold',
        fontSize: 14,
    },
    circle: {
        position: 'absolute',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 50,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 16,
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    gridCard: {
        backgroundColor: '#fff',
        width: (width - 48 - 24) / 3, // 3 columns
        padding: 16,
        borderRadius: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 3,
    },
    gridValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 4,
    },
    gridLabel: {
        fontSize: 12,
        color: '#8E8E93',
        textAlign: 'center',
    },
    actionCard: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1C1C1E',
        marginBottom: 2,
    },
    actionSubtitle: {
        fontSize: 14,
        color: '#8E8E93',
    },
});

export default MemberDashboard;
