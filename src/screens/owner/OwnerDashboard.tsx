import React, { useContext, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { AuthContext } from '../../context/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, Avatar, IconButton, useTheme, Surface, Button, Banner, List } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { MockDatabase } from '../../services/storage';
import client from '../../api/client';

const { width } = Dimensions.get('window');

const OwnerDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const navigation = useNavigation<any>();
    const theme = useTheme();
    const [stats, setStats] = useState({
        members: 0,
        trainers: 0,
        revenue: 0,
    });
    const [alerts, setAlerts] = useState<any[]>([]);
    const [bannerVisible, setBannerVisible] = useState(true);

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

    const loadAlerts = async () => {
        try {
            const res = await client.get('/alerts');
            setAlerts(res.data);
            setBannerVisible(res.data.length > 0);
        } catch (error) {
            console.error('Failed to load alerts', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadStats();
            loadAlerts();
        }, [])
    );

    const urgentAlert = alerts.find(a => a.type === 'warning' || a.type === 'error');

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text variant="bodyMedium" style={{ color: theme.colors.secondary }}>Good Morning,</Text>
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

                {urgentAlert && (
                    <Banner
                        visible={bannerVisible}
                        actions={[
                            {
                                label: 'Dismiss',
                                onPress: () => setBannerVisible(false),
                            },
                            {
                                label: 'View Details',
                                onPress: () => { /* Navigate to alert details */ },
                            },
                        ]}
                        icon={({ size }) => (
                            <MaterialCommunityIcons name="alert-circle" size={size} color={theme.colors.error} />
                        )}
                        style={styles.banner}
                    >
                        {urgentAlert.message}
                    </Banner>
                )}

                {/* Main Stats Card */}
                <Card style={[styles.revenueCard, { backgroundColor: '#1C1C1E' }]} mode="elevated">
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.revenueTitle}>Total Revenue</Text>
                        <Text variant="displayMedium" style={styles.revenueValue}>${stats.revenue.toLocaleString()}</Text>
                        <Surface style={styles.revenueBadge} elevation={0}>
                            <MaterialCommunityIcons name="trending-up" size={16} color="#4CD964" />
                            <Text variant="labelSmall" style={styles.revenueBadgeText}>+12.5% this month</Text>
                        </Surface>
                    </Card.Content>
                </Card>

                {/* Grid Stats */}
                <View style={styles.gridContainer}>
                    <Card style={styles.gridCard} mode="contained">
                        <Card.Content style={styles.gridContent}>
                            <Avatar.Icon size={48} icon="account-group" style={{ backgroundColor: '#E3F2FD' }} color="#007AFF" />
                            <Text variant="headlineSmall" style={styles.gridValue}>{stats.members}</Text>
                            <Text variant="bodySmall" style={styles.gridLabel}>Active Members</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.gridCard} mode="contained">
                        <Card.Content style={styles.gridContent}>
                            <Avatar.Icon size={48} icon="dumbbell" style={{ backgroundColor: '#FFF3E0' }} color="#FF9800" />
                            <Text variant="headlineSmall" style={styles.gridValue}>{stats.trainers}</Text>
                            <Text variant="bodySmall" style={styles.gridLabel}>Trainers</Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Quick Actions */}
                <Text variant="titleLarge" style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionRow}>
                    <Button
                        mode="elevated"
                        onPress={() => navigation.navigate('Members', { screen: 'AddMember' })}
                        style={styles.actionButton}
                        contentStyle={styles.actionButtonContent}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Avatar.Icon size={48} icon="account-plus" style={{ backgroundColor: '#E8F5E9', marginBottom: 8 }} color="#4CAF50" />
                            <Text variant="labelMedium">Add Member</Text>
                        </View>
                    </Button>

                    <Button
                        mode="elevated"
                        onPress={() => navigation.navigate('Reports')}
                        style={styles.actionButton}
                        contentStyle={styles.actionButtonContent}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Avatar.Icon size={48} icon="file-document" style={{ backgroundColor: '#F3E5F5', marginBottom: 8 }} color="#9C27B0" />
                            <Text variant="labelMedium">Reports</Text>
                        </View>
                    </Button>

                    <Button
                        mode="elevated"
                        onPress={() => { /* Toggle alerts modal/view */ }}
                        style={styles.actionButton}
                        contentStyle={styles.actionButtonContent}
                    >
                        <View style={{ alignItems: 'center' }}>
                            <Avatar.Icon size={48} icon="bell" style={{ backgroundColor: '#FFEBEE', marginBottom: 8 }} color="#F44336" />
                            <Text variant="labelMedium">Alerts</Text>
                        </View>
                    </Button>
                </View>

                {/* Recent Alerts List */}
                {alerts.length > 0 && (
                    <View style={styles.alertsContainer}>
                        <Text variant="titleLarge" style={styles.sectionTitle}>Recent Activities</Text>
                        {alerts.map((alert) => (
                            <Card key={alert.id} style={styles.alertCard} mode="outlined">
                                <Card.Title
                                    title={alert.title}
                                    subtitle={alert.message}
                                    left={(props) => <Avatar.Icon {...props} icon="information" size={40} style={{ backgroundColor: theme.colors.surfaceVariant }} />}
                                />
                            </Card>
                        ))}
                    </View>
                )}

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
    banner: {
        marginBottom: 16,
        borderRadius: 8,
        overflow: 'hidden',
    },
    revenueCard: {
        borderRadius: 24,
        marginBottom: 24,
    },
    revenueTitle: {
        color: '#8E8E93',
        marginBottom: 8,
    },
    revenueValue: {
        color: '#fff',
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
    },
    gridContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    gridCard: {
        width: (width - 48 - 16) / 2,
    },
    gridContent: {
        alignItems: 'center',
        padding: 16,
    },
    gridValue: {
        fontWeight: 'bold',
        marginTop: 12,
        marginBottom: 4,
    },
    gridLabel: {
        color: '#8E8E93',
    },
    sectionTitle: {
        fontWeight: 'bold',
        marginBottom: 16,
        marginTop: 16,
    },
    actionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    actionButton: {
        width: (width - 48) / 3 - 5,
        height: 100, // Fixed height for consistency
        borderRadius: 16,
        padding: 0,
    },
    actionButtonContent: {
        height: 100,
        flexDirection: 'column',
        justifyContent: 'center',
    },
    alertsContainer: {
        marginTop: 16,
    },
    alertCard: {
        marginBottom: 8,
    }
});

export default OwnerDashboard;
