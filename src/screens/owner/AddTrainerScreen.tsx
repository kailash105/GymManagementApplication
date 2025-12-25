import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import client from '../../api/client';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Appbar, useTheme, HelperText } from 'react-native-paper';

const AddTrainerScreen = () => {
    const navigation = useNavigation();
    const theme = useTheme();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name || !email) {
            Alert.alert('Error', 'Please fill all fields');
            return;
        }

        setIsLoading(true);
        try {
            await client.post('/users', {
                name,
                email,
                role: 'TRAINER'
            });

            Alert.alert('Success', 'Trainer added successfully', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.msg || 'Failed to add trainer');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Appbar.Header>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="Add New Trainer" />
            </Appbar.Header>

            <View style={styles.form}>
                <TextInput
                    mode="outlined"
                    label="Full Name"
                    placeholder="Jane Doe"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                />

                <TextInput
                    mode="outlined"
                    label="Email Address"
                    placeholder="jane@fitness.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                />

                <HelperText type="info" visible={true}>
                    Default password will be generated and sent to email.
                </HelperText>

                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={isLoading}
                    disabled={isLoading}
                    style={styles.saveButton}
                >
                    Save Trainer
                </Button>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    form: {
        padding: 24,
    },
    input: {
        marginBottom: 16,
    },
    saveButton: {
        marginTop: 8,
        paddingVertical: 6,
    },
});

export default AddTrainerScreen;
