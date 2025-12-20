import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MockDatabase } from '../../services/storage';
import { WorkoutPlan } from '../../types';
import { useNavigation, useRoute } from '@react-navigation/native';

const CreateWorkoutScreen = () => {
    const navigation = useNavigation();
    const route = useRoute<any>();
    const memberId = route.params?.memberId;
    const memberName = route.params?.memberName;

    const [exercise, setExercise] = useState('');
    const [exercises, setExercises] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleAddExercise = () => {
        if (!exercise) return;
        setExercises([...exercises, exercise]);
        setExercise('');
    };

    const handleSave = async () => {
        if (exercises.length === 0) {
            Alert.alert('Error', 'Please add at least one exercise');
            return;
        }

        setIsLoading(true);
        try {
            const newWorkout: WorkoutPlan = {
                id: Date.now().toString(),
                member_id: memberId,
                exercises: exercises,
                created_at: new Date().toISOString(),
            };

            await MockDatabase.addWorkout(newWorkout);
            Alert.alert('Success', 'Workout assigned successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert('Error', 'Failed to save workout');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <Text style={styles.title}>New Plan for {memberName}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.subtitle}>Add Exercises</Text>

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        placeholder="e.g. Bench Press 3x10"
                        value={exercise}
                        onChangeText={setExercise}
                    />
                    <TouchableOpacity style={styles.addButton} onPress={handleAddExercise}>
                        <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.list}>
                    {exercises.map((ex, index) => (
                        <View key={index} style={styles.listItem}>
                            <Text>{index + 1}. {ex}</Text>
                        </View>
                    ))}
                </View>

                {exercises.length > 0 && (
                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Assign Workout</Text>
                        )}
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    backButton: {
        padding: 8,
    },
    backButtonText: {
        color: '#007AFF',
        fontSize: 16,
    },
    content: {
        padding: 24,
    },
    subtitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginRight: 8,
        backgroundColor: '#fafafa',
    },
    addButton: {
        backgroundColor: '#34C759',
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 8,
    },
    addButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    list: {
        marginBottom: 24,
    },
    listItem: {
        padding: 12,
        backgroundColor: '#f1f3f5',
        marginBottom: 8,
        borderRadius: 4,
    },
    saveButton: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default CreateWorkoutScreen;
