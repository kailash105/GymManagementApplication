import React, { useContext, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MockDatabase } from '../../services/storage';

const { width } = Dimensions.get('window');

const OwnerDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const [stats, setStats] = useState({
        members: 0,
        trainers: 0,
        revenue: 0,
    });

    const loadStats = async () => {
        const users = await MockDatabase.getUsers();
        const members = users.filter(u => u.role === 'MEMBER').length;
        const trainers = users.filter(u => u.role === 'TRAINER').length;
        setStats({
            members,
            trainers,
            revenue: members * 50, // Mock revenue calculation ($50/member)
        });
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
                        <Text style={styles.greeting}>Good Morning,</Text>
                        <Text style={styles.userName}>{user?.name}</Text>
                    </View>
                    <TouchableOpacity style={styles.profileBtn} onPress={logout}>
                        <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                    </TouchableOpacity>
                </View>

                {/* Main Stats Card */}
                <View style={styles.revenueCard}>
                    <Text style={styles.revenueTitle}>Total Revenue</Text>
                    <Text style={styles.revenueValue}>${stats.revenue.toLocaleString()}</Text>
                    <View style={styles.revenueBadge}>
                        <Ionicons name="trending-up" size={16} color="#4CD964" />
                        <Text style={styles.revenueBadgeText}>+12.5% this month</Text>
                    </View>
                </View>

                {/* Grid Stats */}
                <View style={styles.gridContainer}>
                    <View style={styles.gridCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="people" size={24} color="#007AFF" />
                        </View>
                        <Text style={styles.gridValue}>{stats.members}</Text>
                        <Text style={styles.gridLabel}>Active Members</Text>
                    </View>
                    <View style={styles.gridCard}>
                        <View style={[styles.iconContainer, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="barbell" size={24} color="#FF9800" />
                        </View>
                        <Text style={styles.gridValue}>{stats.trainers}</Text>
                        <Text style={styles.gridLabel}>Trainers</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionRow}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => navigation.navigate('Members', { screen: 'AddMember' })}
                    >
                        <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="person-add" size={24} color="#4CAF50" />
                        </View>
                        <Text style={styles.actionText}>Add Member</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
                            <Ionicons name="document-text" size={24} color="#9C27B0" />
                        </View>
                        <Text style={styles.actionText}>Reports</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionButton}>
                        <View style={[styles.actionIcon, { backgroundColor: '#FFEBEE' }]}>
                            <Ionicons name="notifications" size={24} color="#F44336" />
                        </View>
                        <Text style={styles.actionText}>Alerts</Text>
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
    revenueCard: {
        backgroundColor: '#1C1C1E',
        borderRadius: 24,
        padding: 24,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 8,
    },
    revenueTitle: {
        color: '#8E8E93',
        fontSize: 14,
        marginBottom: 8,
    },
    revenueValue: {
        color: '#fff',
        fontSize: 36,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    revenueBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    revenueBadgeText: {
        color: '#4CD964',
        marginLeft: 4,
        fontWeight: '600',
        fontSize: 12,
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

export default OwnerDashboard;
