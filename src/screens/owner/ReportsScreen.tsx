import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Card, useTheme, ActivityIndicator, SegmentedButtons } from 'react-native-paper';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import client from '../../api/client';

const screenWidth = Dimensions.get('window').width;

const ReportsScreen = () => {
    const theme = useTheme();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('revenue');
    const [reportData, setReportData] = useState<any>(null);
    const [growthData, setGrowthData] = useState<any>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [revenueRes, growthRes] = await Promise.all([
                client.get('/reports/revenue'),
                client.get('/reports/growth')
            ]);
            setReportData(revenueRes.data);
            setGrowthData(growthRes.data);
        } catch (error) {
            console.error('Failed to load reports', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const chartConfig = {
        backgroundGradientFrom: theme.colors.surface,
        backgroundGradientTo: theme.colors.surface,
        color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        labelColor: (opacity = 1) => theme.colors.onSurfaceVariant,
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text variant="headlineMedium" style={styles.title}>Reports</Text>

                <SegmentedButtons
                    value={period}
                    onValueChange={setPeriod}
                    buttons={[
                        { value: 'revenue', label: 'Revenue' },
                        { value: 'growth', label: 'Growth' },
                    ]}
                    style={styles.segmentedButton}
                />

                {period === 'revenue' && reportData && (
                    <View>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text variant="titleMedium">Revenue Trend</Text>
                                <LineChart
                                    data={reportData.chartData}
                                    width={screenWidth - 64}
                                    height={220}
                                    chartConfig={chartConfig}
                                    bezier
                                    style={styles.chart}
                                />
                                <View style={styles.statRow}>
                                    <View>
                                        <Text variant="labelMedium" style={{ color: theme.colors.outline }}>Total Revenue</Text>
                                        <Text variant="headlineSmall">${reportData.total.toLocaleString()}</Text>
                                    </View>
                                    <View>
                                        <Text variant="labelMedium" style={{ color: theme.colors.outline }}>Growth</Text>
                                        <Text variant="headlineSmall" style={{ color: '#4CD964' }}>{reportData.growth}</Text>
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    </View>
                )}

                {period === 'growth' && growthData && (
                    <View>
                        <Card style={styles.card}>
                            <Card.Content>
                                <Text variant="titleMedium">New Members (Weekly)</Text>
                                <BarChart
                                    data={growthData}
                                    width={screenWidth - 64}
                                    height={220}
                                    yAxisLabel=""
                                    yAxisSuffix=""
                                    chartConfig={chartConfig}
                                    style={styles.chart}
                                />
                            </Card.Content>
                        </Card>
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
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: 16,
    },
    title: {
        fontWeight: 'bold',
        marginBottom: 16,
    },
    segmentedButton: {
        marginBottom: 24,
    },
    card: {
        marginBottom: 16,
        padding: 8,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
        paddingHorizontal: 16,
    },
});

export default ReportsScreen;
