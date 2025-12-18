import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const MemberPlans = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>My Plan</Text>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Today's Workout</Text>
                    <View style={styles.card}>
                        <Text style={styles.exercise}>Push-ups: 3 x 15</Text>
                        <Text style={styles.exercise}>Squats: 3 x 20</Text>
                        <Text style={styles.exercise}>Plank: 3 x 60s</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Diet Plan</Text>
                    <View style={styles.card}>
                        <Text style={styles.meal}>Breakfast: Oatmeal & Eggs</Text>
                        <Text style={styles.meal}>Lunch: Grilled Chicken Salad</Text>
                        <Text style={styles.meal}>Dinner: Salmon & Veggies</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
        color: '#333',
    },
    card: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
    },
    exercise: {
        fontSize: 16,
        marginBottom: 8,
    },
    meal: {
        fontSize: 16,
        marginBottom: 8,
        color: '#444',
    },
});

export default MemberPlans;
